import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const LinkedInCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing LinkedIn data...');

  useEffect(() => {
    const processLinkedInCallback = async () => {
      const error = searchParams.get('error');
      const errorMessage = searchParams.get('message');

      if (error) {
        setStatus('error');
        setMessage(getErrorMessage(error, errorMessage));
        setTimeout(() => navigate('/dashboard'), 5000);
        return;
      }

      // If no error, show success and redirect
      setStatus('success');
      setMessage('LinkedIn data imported successfully! Redirecting to portfolio creation...');
      setTimeout(() => navigate('/dashboard'), 2000);
    };

    processLinkedInCallback();
  }, [searchParams, navigate]);

  const getErrorMessage = (error: string, message: string | null): string => {
    const errorMessages: { [key: string]: string } = {
      'linkedin_auth_failed': 'LinkedIn authentication failed. Please try again.',
      'missing_parameters': 'Missing required parameters from LinkedIn.',
      'invalid_state': 'Invalid authentication state. Please try again.',
      'invalid_user_info': 'Invalid user information. Please log in again.',
      'linkedin_not_configured': 'LinkedIn integration is not configured. Please contact support.',
      'token_exchange_failed': 'Failed to exchange LinkedIn authorization code. Please try again.',
      'profile_fetch_failed': 'Failed to fetch LinkedIn profile data. Please try again.',
      'callback_error': message || 'An error occurred during LinkedIn authentication.'
    };

    return errorMessages[error] || 'An unknown error occurred. Please try again.';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F8FB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#123C63',
      padding: '2rem',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #E9F1FA'
      }}>
        {status === 'processing' && (
          <div>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #E9F1FA',
              borderTop: '4px solid #1E73BE',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 2rem'
            }}></div>
            <h2 style={{ marginBottom: '1rem', color: '#1E73BE' }}>Processing LinkedIn Data</h2>
            <p style={{ color: '#4A4A4A' }}>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#4caf50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              fontSize: '30px',
              color: 'white'
            }}>
              ✓
            </div>
            <h2 style={{ marginBottom: '1rem', color: '#4caf50' }}>LinkedIn Import Successful!</h2>
            <p style={{ color: '#4A4A4A' }}>{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              fontSize: '30px',
              color: 'white'
            }}>
              ✕
            </div>
            <h2 style={{ marginBottom: '1rem', color: '#ef4444' }}>LinkedIn Import Failed</h2>
            <p style={{ color: '#4A4A4A', marginBottom: '2rem' }}>{message}</p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#1E73BE',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#155A96'}
              onMouseOut={(e) => e.currentTarget.style.background = '#1E73BE'}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LinkedInCallback;