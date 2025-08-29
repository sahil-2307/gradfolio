const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user storage (replace with database in production)
let users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const { action, email, password, username } = JSON.parse(event.body);

    try {
        switch (action) {
            case 'register':
                return await register(email, password, username);
            case 'login':
                return await login(email, password);
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Invalid action' })
                };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server error' })
        };
    }
};

async function register(email, password, username) {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'User already exists' })
        };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
        id: Date.now().toString(),
        email,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };

    users.push(user);

    // Generate token
    const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { expiresIn: '7d' });

    return {
        statusCode: 201,
        body: JSON.stringify({
            success: true,
            token,
            user: { id: user.id, email, username }
        })
    };
}

async function login(email, password) {
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid credentials' })
        };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid credentials' })
        };
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            token,
            user: { id: user.id, email: user.email, username: user.username }
        })
    };
}