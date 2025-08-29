import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import LandingPage from './components/LandingPage';
import StripeCheckout from './components/StripeCheckout';
import TemplateSelector from './components/TemplateSelector';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DebugEnv from './components/DebugEnv';
import { AuthService } from './services/authService';
import type { User } from './config/supabase';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated with Supabase
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1a1a2e',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <DebugEnv />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<TemplateSelector />} />
          <Route path="/profile/:username" element={<LandingPage />} />
          <Route path="/checkout/:username" element={<StripeCheckout />} />
          
          {/* Authentication Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <Dashboard user={user} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch-all route for user portfolios */}
          <Route path="/u/:username" element={<UserPortfolio />} />
        </Routes>
      </div>
    </Router>
  );
}

// Component to display user portfolios
const UserPortfolio: React.FC = () => {
  const [portfolioHtml, setPortfolioHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const username = window.location.pathname.split('/u/')[1];
    fetchPortfolio(username);
  }, []);

  const fetchPortfolio = async (username: string) => {
    try {
      // Import PortfolioService dynamically to avoid circular imports
      const { PortfolioService } = await import('./services/portfolioService');
      const result = await PortfolioService.getPortfolioByUsername(username);
      
      if (result.success && result.portfolio) {
        // If we have HTML content, use it; otherwise generate basic HTML
        if (result.portfolio.html_content) {
          setPortfolioHtml(result.portfolio.html_content);
        } else {
          // Generate basic HTML from portfolio data
          const basicHtml = generateBasicPortfolioHtml(result.portfolio);
          setPortfolioHtml(basicHtml);
        }
      } else {
        setError('Portfolio not found');
      }
    } catch (error) {
      setError('Error loading portfolio');
    } finally {
      setLoading(false);
    }
  };

  const generateBasicPortfolioHtml = (portfolio: any) => {
    const data = portfolio.portfolio_data;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data.personal?.fullName || portfolio.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 2rem; background: #1a1a2e; color: white; }
          .container { max-width: 800px; margin: 0 auto; }
          h1 { color: #ffd700; }
          .section { margin: 2rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${data.personal?.fullName || portfolio.title}</h1>
          <div class="section">
            <h2>About</h2>
            <p>${data.about?.paragraph1 || 'Welcome to my portfolio'}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading portfolio...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>Portfolio Not Found</h2>
        <p>{error}</p>
        <a href="/">Go back to home</a>
      </div>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: portfolioHtml }} />;
};

export default App;
