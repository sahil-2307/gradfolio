import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './LinkedInCallback.css';

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
    <div className="linkedin-callback-container">
      <div className="linkedin-callback-card">
        {status === 'processing' && (
          <div>
            <div className="loading-spinner"></div>
            <h2 className="linkedin-callback-title processing">Processing LinkedIn Data</h2>
            <p className="linkedin-callback-message">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="status-icon success">
              ✓
            </div>
            <h2 className="linkedin-callback-title success">LinkedIn Import Successful!</h2>
            <p className="linkedin-callback-message">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="status-icon error">
              ✕
            </div>
            <h2 className="linkedin-callback-title error">LinkedIn Import Failed</h2>
            <p className="linkedin-callback-message with-button">{message}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="linkedin-callback-button"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInCallback;