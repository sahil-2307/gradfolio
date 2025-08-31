// Vercel serverless function for S3 portfolio upload
const BUCKET_NAME = 'gradfolio-previews';

export default async function handler(req, res) {
  // Log function start for debugging
  console.log('Portfolio S3 function started');
  console.log('Method:', req.method);
  console.log('Environment variables check:', {
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Check if AWS credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials not configured');
      res.status(500).json({ 
        error: 'AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.' 
      });
      return;
    }

    const { username, templateType, htmlContent, cssContent } = req.body;

    if (!username || !htmlContent) {
      res.status(400).json({ error: 'Username and HTML content are required' });
      return;
    }

    // Dynamically import AWS SDK to avoid Vercel issues
    const AWS = await import('aws-sdk');
    
    // Configure AWS
    const s3 = new AWS.default.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    console.log('Uploading to S3 for user:', username);

    // Upload HTML file
    const htmlKey = `portfolios/${username}/index.html`;
    await s3.upload({
      Bucket: BUCKET_NAME,
      Key: htmlKey,
      Body: htmlContent,
      ContentType: 'text/html'
    }).promise();

    console.log('HTML uploaded successfully');

    // Upload CSS file
    if (cssContent) {
      const cssKey = `portfolios/${username}/styles.css`;
      await s3.upload({
        Bucket: BUCKET_NAME,
        Key: cssKey,
        Body: cssContent,
        ContentType: 'text/css'
      }).promise();
      
      console.log('CSS uploaded successfully');
    }

    const portfolioUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/portfolios/${username}/index.html`;
    console.log('Portfolio URL:', portfolioUrl);

    res.status(200).json({
      success: true,
      portfolioUrl: portfolioUrl
    });

  } catch (error) {
    console.error('S3 upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload portfolio to S3',
      details: error.message
    });
  }
}