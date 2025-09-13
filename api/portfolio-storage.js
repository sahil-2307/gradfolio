const BUCKET_NAME = 'gradfolio-previews';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action } = req.body || req.query || {};

    switch (action) {
      case 'upload':
        return await uploadPortfolio(req, res);
      case 'serve':
        return await servePortfolio(req, res);
      default:
        // Legacy support - determine action from method
        if (req.method === 'POST') {
          return await uploadPortfolio(req, res);
        } else if (req.method === 'GET') {
          return await servePortfolio(req, res);
        } else {
          return res.status(405).json({
            success: false,
            message: 'Invalid action or method. Supported actions: upload, serve'
          });
        }
    }
  } catch (error) {
    console.error('Portfolio storage error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Upload Portfolio to S3
async function uploadPortfolio(req, res) {
  console.log('Portfolio S3 upload function started');
  console.log('Method:', req.method);
  console.log('Environment variables check:', {
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Check if AWS credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials not configured');
      return res.status(500).json({
        success: false,
        message: 'AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.'
      });
    }

    const { username, templateType, htmlContent, cssContent } = req.body;

    if (!username || !templateType || !htmlContent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, templateType, htmlContent'
      });
    }

    // Dynamically import AWS SDK
    const AWS = await import('aws-sdk');

    // Configure AWS
    AWS.default.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    const s3 = new AWS.default.S3();

    // Generate file paths
    const baseKey = `${username}/${templateType}`;
    const htmlKey = `${baseKey}/index.html`;
    const cssKey = `${baseKey}/style.css`;

    console.log('Uploading to S3:', {
      bucket: BUCKET_NAME,
      htmlKey,
      cssKey: cssContent ? cssKey : 'none'
    });

    const uploadPromises = [];

    // Upload HTML file
    uploadPromises.push(
      s3.upload({
        Bucket: BUCKET_NAME,
        Key: htmlKey,
        Body: htmlContent,
        ContentType: 'text/html',
        CacheControl: 'public, max-age=31536000'
      }).promise()
    );

    // Upload CSS file if provided
    if (cssContent) {
      uploadPromises.push(
        s3.upload({
          Bucket: BUCKET_NAME,
          Key: cssKey,
          Body: cssContent,
          ContentType: 'text/css',
          CacheControl: 'public, max-age=31536000'
        }).promise()
      );
    }

    const results = await Promise.all(uploadPromises);

    console.log('Upload successful:', {
      htmlLocation: results[0].Location,
      cssLocation: results[1]?.Location || 'none'
    });

    // Generate URLs
    const portfolioUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${htmlKey}`;
    const customUrl = `https://gradfolio.onlineportfolios.in/${username}/${templateType}`;

    res.status(200).json({
      success: true,
      message: 'Portfolio uploaded successfully',
      data: {
        portfolioUrl,
        customUrl,
        htmlKey,
        cssKey: cssContent ? cssKey : null,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Portfolio upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload portfolio'
    });
  }
}

// Serve Portfolio from S3
async function servePortfolio(req, res) {
  console.log('Portfolio serve function started');
  console.log('Method:', req.method);
  console.log('Query params:', req.query);

  // Extract username and template from the URL path
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: 'Username is required'
    });
  }

  // Parse username to extract template if specified (e.g., "johndoe/creative")
  let actualUsername = username;
  let templateType = 'modern'; // default

  if (username.includes('/')) {
    const parts = username.split('/');
    actualUsername = parts[0];
    templateType = parts[1] || 'modern';
  }

  try {
    // Check if AWS credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials not configured');
      return res.status(500).json({
        success: false,
        message: 'AWS credentials not configured'
      });
    }

    // Dynamically import AWS SDK
    const AWS = await import('aws-sdk');

    // Configure AWS
    AWS.default.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    const s3 = new AWS.default.S3();

    // Try to get the portfolio file from S3
    const s3Key = `${actualUsername}/${templateType}/index.html`;

    console.log('Attempting to retrieve from S3:', {
      bucket: BUCKET_NAME,
      key: s3Key
    });

    try {
      const s3Response = await s3.getObject({
        Bucket: BUCKET_NAME,
        Key: s3Key
      }).promise();

      const htmlContent = s3Response.Body.toString('utf-8');

      // Set appropriate headers for HTML content
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      res.status(200).send(htmlContent);

    } catch (s3Error) {
      console.log('S3 Error:', s3Error.code, s3Error.message);

      if (s3Error.code === 'NoSuchKey') {
        // Portfolio not found - return 404 with helpful message
        res.status(404).json({
          success: false,
          message: `Portfolio not found for username: ${actualUsername} with template: ${templateType}`,
          details: 'The requested portfolio may not exist or may not have been deployed yet.'
        });
      } else {
        // Other S3 error
        console.error('S3 retrieval error:', s3Error);
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve portfolio from storage',
          error: s3Error.message
        });
      }
    }

  } catch (error) {
    console.error('Portfolio serve error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to serve portfolio'
    });
  }
}