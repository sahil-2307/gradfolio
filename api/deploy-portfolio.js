// Import AWS SDK v3
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs').promises;
const path = require('path');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'gradfolio-portfolios';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { userId, username, templateId, resumeData, templateData } = req.body;

    console.log('Portfolio deployment request:', {
      userId: userId?.substring(0, 8) + '...',
      username,
      templateId,
      hasResumeData: !!resumeData,
      hasTemplateData: !!templateData
    });

    // Validate required fields
    if (!userId || !username || !templateId || !resumeData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, username, templateId, resumeData'
      });
    }

    // Check AWS credentials
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials not configured');
      return res.status(500).json({
        success: false,
        error: 'AWS credentials not configured'
      });
    }

    // Map template ID to template name
    const templateMap = {
      1: 'modern',
      2: 'creative'
    };

    const templateName = templateMap[templateId];
    if (!templateName) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID'
      });
    }

    console.log(`Deploying ${templateName} template for user ${username}`);

    // Generate unique folder for this deployment
    const timestamp = Date.now();
    const folderName = `${username}-${timestamp}`;
    const baseUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${folderName}`;

    try {
      // Read template files from the templates directory
      const templatePath = path.join(process.cwd(), 'templates', templateName);
      console.log('Template path:', templatePath);

      // Check if template directory exists
      try {
        await fs.access(templatePath);
      } catch (error) {
        console.error('Template directory not found:', templatePath);
        return res.status(404).json({
          success: false,
          error: `Template ${templateName} not found`
        });
      }

      // Read template files
      const indexHtml = await fs.readFile(path.join(templatePath, 'index.html'), 'utf8');
      const stylesCSS = await fs.readFile(path.join(templatePath, 'styles.css'), 'utf8');
      const scriptJS = await fs.readFile(path.join(templatePath, 'script.js'), 'utf8');
      
      // Read portfolio updater script
      let portfolioUpdaterJS = '';
      try {
        portfolioUpdaterJS = await fs.readFile(path.join(templatePath, 'portfolio-updater.js'), 'utf8');
      } catch (error) {
        console.log('Portfolio updater script not found, using basic version');
        portfolioUpdaterJS = generateBasicPortfolioUpdater();
      }

      // Replace placeholders in HTML with actual data
      let processedHtml = indexHtml;
      
      // Inject user data into the HTML
      processedHtml = injectUserData(processedHtml, templateData, resumeData);

      // Upload files to S3
      const uploads = [
        {
          key: `${folderName}/index.html`,
          body: processedHtml,
          contentType: 'text/html'
        },
        {
          key: `${folderName}/styles.css`,
          body: stylesCSS,
          contentType: 'text/css'
        },
        {
          key: `${folderName}/script.js`,
          body: scriptJS,
          contentType: 'application/javascript'
        },
        {
          key: `${folderName}/portfolio-updater.js`,
          body: portfolioUpdaterJS,
          contentType: 'application/javascript'
        }
      ];

      // Upload additional assets if they exist
      try {
        const assetsPath = path.join(templatePath, 'assets');
        const assetFiles = await fs.readdir(assetsPath);
        
        for (const assetFile of assetFiles) {
          const assetPath = path.join(assetsPath, assetFile);
          const assetContent = await fs.readFile(assetPath);
          const contentType = getContentType(assetFile);
          
          uploads.push({
            key: `${folderName}/assets/${assetFile}`,
            body: assetContent,
            contentType
          });
        }
      } catch (error) {
        console.log('No assets directory found, skipping assets upload');
      }

      // Perform uploads
      for (const upload of uploads) {
        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: upload.key,
          Body: upload.body,
          ContentType: upload.contentType,
          ACL: 'public-read'
        });

        await s3Client.send(command);
        console.log(`Uploaded: ${upload.key}`);
      }

      const portfolioUrl = `${baseUrl}/index.html`;

      console.log('Portfolio deployed successfully:', portfolioUrl);

      return res.status(200).json({
        success: true,
        portfolioUrl,
        folderName,
        templateName,
        message: 'Portfolio deployed successfully'
      });

    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({
        success: false,
        error: `Upload failed: ${uploadError.message}`
      });
    }

  } catch (error) {
    console.error('Portfolio deployment error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

function injectUserData(html, templateData, resumeData) {
  let processedHtml = html;
  
  // Replace common placeholders
  const replacements = {
    '{{NAME}}': templateData.name || resumeData.personal?.fullName || 'Your Name',
    '{{EMAIL}}': templateData.email || resumeData.personal?.email || 'your.email@example.com',
    '{{PHONE}}': templateData.phone || resumeData.personal?.phone || '',
    '{{LINKEDIN}}': templateData.linkedin || resumeData.personal?.linkedin || '',
    '{{GITHUB}}': templateData.github || resumeData.personal?.github || '',
    '{{WEBSITE}}': templateData.website || resumeData.personal?.website || '',
    '{{ABOUT}}': templateData.about || (resumeData.about?.paragraph1 + ' ' + resumeData.about?.paragraph2) || 'About me section',
    '{{PORTFOLIO_DATA}}': JSON.stringify(templateData),
    '{{RESUME_DATA}}': JSON.stringify(resumeData)
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    processedHtml = processedHtml.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value || '');
  }

  return processedHtml;
}

function generateBasicPortfolioUpdater() {
  return `
// Basic Portfolio Updater
function updatePortfolioData() {
  // This function will be called to update portfolio data dynamically
  console.log('Portfolio data loaded');
}

// Call on page load
document.addEventListener('DOMContentLoaded', updatePortfolioData);
  `;
}

function getContentType(filename) {
  const extension = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain'
  };
  return mimeTypes[extension] || 'application/octet-stream';
}