// Fallback authentication utilities for when serverless functions aren't available

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

// Simple client-side authentication (for development/fallback)
export class FallbackAuth {
  private static users: any[] = JSON.parse(localStorage.getItem('gradfolio_users') || '[]');

  static async register(email: string, password: string, username: string): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = this.users.find(u => u.email === email || u.username === username);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      // Create user
      const user = {
        id: Date.now().toString(),
        email,
        username,
        password: btoa(password), // Simple encoding (NOT secure for production)
        createdAt: new Date().toISOString()
      };

      this.users.push(user);
      localStorage.setItem('gradfolio_users', JSON.stringify(this.users));

      // Generate simple token
      const token = btoa(JSON.stringify({ userId: user.id, username, timestamp: Date.now() }));

      return {
        success: true,
        token,
        user: { id: user.id, email, username }
      };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Find user
      const user = this.users.find(u => u.email === email);
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Verify password (simple check)
      if (user.password !== btoa(password)) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Generate simple token
      const token = btoa(JSON.stringify({ userId: user.id, username: user.username, timestamp: Date.now() }));

      return {
        success: true,
        token,
        user: { id: user.id, email: user.email, username: user.username }
      };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  static verifyToken(token: string): { valid: boolean; user?: any } {
    try {
      const decoded = JSON.parse(atob(token));
      // Check if token is less than 7 days old
      const tokenAge = Date.now() - decoded.timestamp;
      if (tokenAge > 7 * 24 * 60 * 60 * 1000) {
        return { valid: false };
      }
      return { valid: true, user: decoded };
    } catch (error) {
      return { valid: false };
    }
  }
}

// Enhanced authentication that tries serverless first, falls back to localStorage
export async function authenticate(action: 'login' | 'register', data: any): Promise<AuthResponse> {
  try {
    // First try the serverless function
    const response = await fetch('/.netlify/functions/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...data }),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Serverless function failed');
    }
  } catch (error) {
    console.warn('Serverless auth failed, using fallback:', error);
    
    // Fallback to localStorage-based auth
    if (action === 'register') {
      return FallbackAuth.register(data.email, data.password, data.username);
    } else {
      return FallbackAuth.login(data.email, data.password);
    }
  }
}

// Portfolio storage utilities
export class PortfolioStorage {
  private static portfolios: any = JSON.parse(localStorage.getItem('gradfolio_portfolios') || '{}');

  static async savePortfolio(token: string, portfolioData: any, templateType: string): Promise<{ success: boolean; portfolioUrl?: string; error?: string }> {
    try {
      // First try serverless function
      const response = await fetch('/.netlify/functions/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ portfolioData, templateType })
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Serverless function failed');
      }
    } catch (error) {
      console.warn('Serverless portfolio save failed, using fallback:', error);
      
      // Fallback to localStorage
      const tokenData = FallbackAuth.verifyToken(token);
      if (!tokenData.valid) {
        return { success: false, error: 'Invalid token' };
      }

      const username = tokenData.user.username;
      this.portfolios[username] = {
        portfolioData,
        templateType,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('gradfolio_portfolios', JSON.stringify(this.portfolios));
      
      return {
        success: true,
        portfolioUrl: `${window.location.origin}/u/${username}`
      };
    }
  }

  static getPortfolio(username: string): any {
    return this.portfolios[username];
  }

  static generateHTML(portfolioData: any, templateType: string): string {
    // Simple HTML generation for fallback
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioData.personal?.fullName || portfolioData.personal?.name || 'Portfolio'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 2rem; background: #1a1a2e; color: white; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { color: #ffd700; text-align: center; }
        .section { margin: 2rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px; }
        .contact { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .contact-item { padding: 0.5rem; background: rgba(255,215,0,0.2); border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${portfolioData.personal?.fullName || portfolioData.personal?.name || 'My Portfolio'}</h1>
        <div class="section">
            <h2>About</h2>
            <p>${portfolioData.about?.paragraph1 || portfolioData.about?.description || 'Welcome to my portfolio'}</p>
        </div>
        <div class="section">
            <h2>Contact</h2>
            <div class="contact">
                ${portfolioData.contact?.email ? `<div class="contact-item">📧 ${portfolioData.contact.email}</div>` : ''}
                ${portfolioData.contact?.phone ? `<div class="contact-item">📱 ${portfolioData.contact.phone}</div>` : ''}
                ${portfolioData.contact?.location ? `<div class="contact-item">📍 ${portfolioData.contact.location}</div>` : ''}
            </div>
        </div>
        <div style="text-align: center; margin-top: 2rem; opacity: 0.7;">
            <p>Created with <a href="${window.location.origin}" style="color: #ffd700;">Gradfolio</a></p>
        </div>
    </div>
</body>
</html>`;
  }
}