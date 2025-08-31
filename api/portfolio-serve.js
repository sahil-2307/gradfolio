// Vercel serverless function to serve portfolios via custom URLs
const BUCKET_NAME = 'gradfolio-previews';

export default async function handler(req, res) {
  console.log('Portfolio serve function started');
  console.log('Method:', req.method);
  console.log('Query params:', req.query);

  // Extract username and template from the URL path
  const { username } = req.query;

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
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
      res.status(500).json({ 
        error: 'AWS credentials not configured' 
      });
      return;
    }

    // Dynamically import AWS SDK
    const AWS = await import('aws-sdk');
    
    // Configure AWS
    const s3 = new AWS.default.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    console.log(`Fetching portfolio for user: ${actualUsername}, template: ${templateType}`);

    // Fetch HTML content from S3
    const htmlKey = `portfolios/${actualUsername}/${templateType}/index.html`;
    
    try {
      const htmlObject = await s3.getObject({
        Bucket: BUCKET_NAME,
        Key: htmlKey
      }).promise();

      const htmlContent = htmlObject.Body.toString();

      // Fetch CSS content from S3
      const cssKey = `portfolios/${actualUsername}/${templateType}/styles.css`;
      let cssContent = '';
      
      try {
        const cssObject = await s3.getObject({
          Bucket: BUCKET_NAME,
          Key: cssKey
        }).promise();
        cssContent = cssObject.Body.toString();
      } catch (cssError) {
        console.log('CSS file not found, serving without custom styles');
      }

      // Inject CSS inline if available
      let finalHtml = htmlContent;
      if (cssContent) {
        // Replace external CSS link with inline styles
        finalHtml = finalHtml.replace(
          '<link rel="stylesheet" href="styles.css">',
          `<style>${cssContent}</style>`
        );
      }

      // Set appropriate headers
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
      
      // Serve the HTML content
      res.status(200).send(finalHtml);

    } catch (s3Error) {
      console.error('Portfolio not found in S3:', s3Error);
      
      // Portfolio not found - serve a friendly 404 page
      const notFoundHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Not Found - Gradfolio</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            max-width: 500px;
            padding: 2rem;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Portfolio Not Found</h1>
        <p>The portfolio for <strong>${actualUsername}</strong> doesn't exist yet or hasn't been published.</p>
        <a href="/" class="btn">← Back to Gradfolio</a>
    </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(404).send(notFoundHtml);
    }

  } catch (error) {
    console.error('Error serving portfolio:', error);
    res.status(500).json({
      error: 'Failed to serve portfolio',
      details: error.message
    });
  }
}