import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './StripeCheckout.css';

// This would normally come from environment variables
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

const StripeCheckout: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePremiumUpgrade = async () => {
    if (!username) {
      setError('Username not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real implementation, you would:
      // 1. Create a checkout session on your backend
      // 2. Redirect to Stripe Checkout
      // 3. Handle the success/cancel flow
      
      // For this POC, we'll simulate the upgrade process
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      // Simulate a successful payment for the POC
      // In production, you'd make a request to your backend to create a checkout session
      const response = await fetch(`http://localhost:5000/api/profile/${username}/premium`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Simulate successful payment
        setTimeout(() => {
          alert('🎉 Upgrade successful! Your profile is now premium.');
          navigate(`/profile/${username}`);
        }, 2000);
      } else {
        throw new Error('Failed to process upgrade');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    '✨ Premium animated background with interactive elements',
    '🎨 Advanced visual effects and animations',
    '🖱️ Mouse interaction with 3D elements',
    '🔄 Enhanced particle systems',
    '📱 Priority mobile responsiveness',
    '🌟 Exclusive premium badge',
    '⚡ Faster loading times',
    '🔮 Future premium features'
  ];

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <div className="checkout-header">
          <h1>Upgrade to Premium</h1>
          <p>Unlock the full potential of your Gradfolio</p>
        </div>

        <div className="pricing-section">
          <div className="price">
            <span className="currency">$</span>
            <span className="amount">9</span>
            <span className="period">one-time</span>
          </div>
          <p className="price-description">
            Lifetime access to premium features
          </p>
        </div>

        <div className="features-section">
          <h3>What you get:</h3>
          <ul className="features-list">
            {features.map((feature, index) => (
              <li key={index} className="feature-item">
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="checkout-actions">
          <button
            className="premium-button"
            onClick={handlePremiumUpgrade}
            disabled={loading}
          >
            {loading ? 'Processing...' : '🚀 Upgrade Now'}
          </button>
          
          <button
            className="back-button"
            onClick={() => navigate(`/profile/${username}`)}
            disabled={loading}
          >
            ← Back to Profile
          </button>
        </div>

        <div className="security-notice">
          <p>
            🔒 Secure payment powered by Stripe<br/>
            💳 All major credit cards accepted<br/>
            ✅ 30-day money-back guarantee
          </p>
        </div>

        <div className="demo-notice">
          <strong>Demo Mode:</strong> This is a proof of concept. No real payment will be processed.
          Clicking "Upgrade Now" will simulate a successful purchase.
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;