const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// In-memory portfolio storage (replace with database in production)
let portfolios = {};

export default async function handler(req, res) {
  // Set CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  };

  res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
  res.setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);
  res.setHeader('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods']);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { action } = req.body || req.query || {};

    switch (action) {
      case 'save':
        return await savePortfolio(req, res, corsHeaders);
      case 'get':
        return await getPortfolio(req, res, corsHeaders);
      case 'deploy':
        return await deployPortfolio(req, res, corsHeaders);
      default:
        // Legacy support - determine action from method
        switch (req.method) {
          case "POST":
            return await savePortfolio(req, res, corsHeaders);
          case "GET":
            return await getPortfolio(req, res, corsHeaders);
          default:
            return res.status(405).json({
              success: false,
              message: 'Invalid action or method. Supported actions: save, get, deploy'
            });
        }
    }
  } catch (error) {
    console.error('Portfolio management error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Save Portfolio
async function savePortfolio(req, res, corsHeaders) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { personalInfo, workExperience, education, skills, projects } = req.body;
    const userId = decoded.id;

    // Store portfolio data
    portfolios[userId] = {
      personalInfo,
      workExperience: workExperience || [],
      education: education || [],
      skills: skills || [],
      projects: projects || [],
      updatedAt: new Date().toISOString(),
    };

    console.log(`Portfolio saved for user ${userId}`);

    res.status(200).json({
      success: true,
      message: "Portfolio saved successfully",
      data: portfolios[userId]
    });

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }

    console.error("Save portfolio error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to save portfolio"
    });
  }
}

// Get Portfolio
async function getPortfolio(req, res, corsHeaders) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const portfolio = portfolios[userId];

    if (!portfolio) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Portfolio not found" }),
      };
    }

    res.status(200).json({
      success: true,
      data: portfolio
    });

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }

    console.error("Get portfolio error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve portfolio"
    });
  }
}

// Deploy Portfolio
async function deployPortfolio(req, res, corsHeaders) {
  try {
    const { userId, username, templateId, resumeData, templateData } = req.body;

    console.log('Portfolio deployment request:', {
      userId: userId?.substring(0, 8) + '...',
      username,
      templateId,
      hasResumeData: !!resumeData,
      hasTemplateData: !!templateData
    });

    if (!userId || !username || !templateId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, username, templateId'
      });
    }

    // Check if AWS credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials not configured');
      return res.status(500).json({
        success: false,
        message: 'AWS credentials not configured. Please contact support.'
      });
    }

    try {
      // Import AWS SDK v3
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

      // Initialize S3 client
      const s3Client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'gradfolio-portfolios';

      // Generate portfolio content
      const portfolioHtml = generatePortfolioHtml(resumeData, templateData, templateId);

      // Create S3 key
      const s3Key = `${username}/index.html`;

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: portfolioHtml,
        ContentType: 'text/html',
        CacheControl: 'public, max-age=31536000',
      });

      await s3Client.send(uploadCommand);

      // Generate portfolio URL
      const portfolioUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`;
      const customUrl = `https://gradfolio.onlineportfolios.in/${username}`;

      console.log('Portfolio deployed successfully:', {
        userId: userId.substring(0, 8) + '...',
        username,
        s3Key,
        portfolioUrl: portfolioUrl.substring(0, 50) + '...'
      });

      res.status(200).json({
        success: true,
        message: 'Portfolio deployed successfully',
        data: {
          portfolioUrl,
          customUrl,
          s3Key,
          deployedAt: new Date().toISOString()
        }
      });

    } catch (awsError) {
      console.error('AWS deployment error:', awsError);
      res.status(500).json({
        success: false,
        message: 'Failed to deploy portfolio to AWS S3',
        error: awsError.message
      });
    }

  } catch (error) {
    console.error('Deploy portfolio error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to deploy portfolio'
    });
  }
}

// Helper function to generate portfolio HTML
function generatePortfolioHtml(resumeData, templateData, templateId) {
  // This is a simplified version - in production, you'd want more sophisticated templating
  const name = resumeData?.personalInfo?.name || 'Portfolio Owner';
  const email = resumeData?.personalInfo?.email || '';
  const phone = resumeData?.personalInfo?.phone || '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${name} - Portfolio</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .section { margin-bottom: 30px; }
            .section h2 { border-bottom: 2px solid #333; padding-bottom: 10px; }
            .contact-info { text-align: center; margin-bottom: 30px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${name}</h1>
                <div class="contact-info">
                    ${email && `<p>Email: ${email}</p>`}
                    ${phone && `<p>Phone: ${phone}</p>`}
                </div>
            </div>

            ${resumeData?.workExperience?.length ? `
            <div class="section">
                <h2>Work Experience</h2>
                ${resumeData.workExperience.map(exp => `
                    <div>
                        <h3>${exp.title} at ${exp.company}</h3>
                        <p><strong>${exp.duration}</strong></p>
                        <p>${exp.description}</p>
                    </div>
                `).join('')}
            </div>` : ''}

            ${resumeData?.education?.length ? `
            <div class="section">
                <h2>Education</h2>
                ${resumeData.education.map(edu => `
                    <div>
                        <h3>${edu.degree} - ${edu.school}</h3>
                        <p><strong>${edu.duration}</strong></p>
                    </div>
                `).join('')}
            </div>` : ''}

            ${resumeData?.skills?.length ? `
            <div class="section">
                <h2>Skills</h2>
                <p>${resumeData.skills.join(', ')}</p>
            </div>` : ''}

            ${resumeData?.projects?.length ? `
            <div class="section">
                <h2>Projects</h2>
                ${resumeData.projects.map(project => `
                    <div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        ${project.link ? `<p><a href="${project.link}" target="_blank">View Project</a></p>` : ''}
                    </div>
                `).join('')}
            </div>` : ''}
        </div>
    </body>
    </html>
  `;
}