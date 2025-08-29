const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


// In-memory portfolio storage (replace with database in production)
let portfolios = {};

exports.handler = async (event, context) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: corsHeaders, body: '' };
    }

    try {
        switch (event.httpMethod) {
            case 'POST':
                return await savePortfolio(event);
            case 'GET':
                return await getPortfolio(event);
            default:
                return {
                    statusCode: 405,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }
    } catch (error) {
        console.error('Portfolio function error:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Server error' })
        };
    }
};

async function savePortfolio(event) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    const authHeader = event.headers.authorization;
    if (!authHeader) {
        return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'No authorization header' })
        };
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);
        const { portfolioData, templateType } = JSON.parse(event.body);

        // Generate HTML content
        const htmlContent = await generatePortfolioHTML(portfolioData, templateType);
        
        // Save portfolio data
        portfolios[decoded.username] = {
            userId: decoded.userId,
            username: decoded.username,
            portfolioData,
            templateType,
            htmlContent,
            updatedAt: new Date().toISOString()
        };

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                portfolioUrl: `${process.env.URL}/u/${decoded.username}`,
                message: 'Portfolio saved successfully'
            })
        };
    } catch (error) {
        console.error('Save portfolio error:', error);
        return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Invalid token' })
        };
    }
}

async function getPortfolio(event) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    const pathParts = event.path.split('/');
    const username = pathParts[pathParts.length - 1];

    if (!username || username === 'portfolio') {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Username required' })
        };
    }

    const portfolio = portfolios[username];
    if (!portfolio) {
        return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Portfolio not found' })
        };
    }

    return {
        statusCode: 200,
        headers: {
            ...corsHeaders,
            'Content-Type': 'text/html'
        },
        body: portfolio.htmlContent
    };
}

async function generatePortfolioHTML(data, templateType) {
    try {
        // Read base template
        let templatePath;
        switch (templateType) {
            case 'modern':
                templatePath = 'landing_1/index.html';
                break;
            case 'creative':
                templatePath = 'landing_2/index.html';
                break;
            default:
                templatePath = 'landing_1/index.html';
        }

        // For now, create a simple HTML template
        // In production, read from actual template files
        const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal?.fullName || data.personal?.name || 'Portfolio'}</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background: #1a1a2e;
            color: white;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .hero {
            text-align: center;
            padding: 4rem 0;
        }
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .hero h2 {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .section {
            margin: 4rem 0;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .section h3 {
            color: #ffd700;
            font-size: 2rem;
            margin-bottom: 2rem;
        }
        .contact-info {
            display: flex;
            gap: 2rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        .contact-item {
            padding: 1rem;
            background: rgba(255, 215, 0, 0.1);
            border-radius: 10px;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .container { padding: 1rem; }
            .contact-info { flex-direction: column; align-items: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>${data.personal?.fullName || data.personal?.name || 'Portfolio'}</h1>
            <h2>${data.personal?.designation || data.personal?.title || 'Professional'}</h2>
            <p>${data.personal?.tagline || 'Welcome to my portfolio'}</p>
        </div>

        <div class="section">
            <h3>About</h3>
            <p>${data.about?.paragraph1 || data.about?.description || 'Professional portfolio showcasing my work and experience.'}</p>
            ${data.about?.paragraph2 ? `<p>${data.about.paragraph2}</p>` : ''}
        </div>

        <div class="section">
            <h3>Contact</h3>
            <div class="contact-info">
                ${data.contact?.email ? `<div class="contact-item">📧 ${data.contact.email}</div>` : ''}
                ${data.contact?.phone ? `<div class="contact-item">📱 ${data.contact.phone}</div>` : ''}
                ${data.contact?.location ? `<div class="contact-item">📍 ${data.contact.location}</div>` : ''}
            </div>
        </div>

        <div style="text-align: center; margin-top: 4rem; opacity: 0.7;">
            <p>Portfolio created with <a href="https://gradfolio.netlify.app" style="color: #ffd700;">Gradfolio</a></p>
        </div>
    </div>
</body>
</html>`;

        return htmlTemplate;
    } catch (error) {
        console.error('Error generating HTML:', error);
        return '<html><body><h1>Error generating portfolio</h1></body></html>';
    }
}