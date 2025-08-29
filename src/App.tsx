import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import LandingPage from './components/LandingPage';
import StripeCheckout from './components/StripeCheckout';
import TemplateSelector from './components/TemplateSelector';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('gradfolio_token');
    const userData = localStorage.getItem('gradfolio_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('gradfolio_token');
        localStorage.removeItem('gradfolio_user');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (token: string, userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('gradfolio_token');
    localStorage.removeItem('gradfolio_user');
    setIsAuthenticated(false);
    setUser(null);
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
      const response = await fetch(`/.netlify/functions/portfolio/${username}`);
      if (response.ok) {
        const html = await response.text();
        setPortfolioHtml(html);
      } else {
        setError('Portfolio not found');
      }
    } catch (error) {
      setError('Error loading portfolio');
    } finally {
      setLoading(false);
    }
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
