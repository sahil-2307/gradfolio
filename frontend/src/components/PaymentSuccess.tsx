import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get URL parameters
        const templateId = searchParams.get('template');
        const planType = searchParams.get('plan');
        const amount = searchParams.get('amount');
        const orderId = searchParams.get('order_id');
        const paymentId = searchParams.get('payment_id');

        if (!templateId || !planType || !amount) {
          setStatus('error');
          setMessage('Missing payment information');
          return;
        }

        // Get current user
        const user = await AuthService.getCurrentUser();
        if (!user) {
          setStatus('error');
          setMessage('User not authenticated');
          return;
        }

        // Store payment in database
        const response = await fetch('/api/store-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            templateId: parseInt(templateId),
            planType: planType === 'free' ? 'basic' : planType,
            amount: parseFloat(amount),
            paymentId: paymentId,
            orderId: orderId
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          setStatus('success');
          setMessage('Payment successful! Redirecting to your template...');
          
          // Redirect to template admin after 2 seconds
          setTimeout(() => {
            const templates = {
              '1': '/landing_1/admin.html',
              '2': '/landing_2/admin.html',
              '3': '/landing_3/admin.html',
              '4': '/landing_4/admin.html'
            };
            window.location.href = templates[templateId as keyof typeof templates] || '/dashboard';
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.message || 'Failed to process payment');
        }

      } catch (error) {
        console.error('Payment processing error:', error);
        setStatus('error');
        setMessage('An error occurred while processing your payment');
      }
    };

    processPayment();
  }, [searchParams]);

  const handleRetry = () => {
    navigate('/templates');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(26, 26, 46, 0.8)',
        borderRadius: '20px',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {status === 'processing' && (
          <div>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(30, 115, 190, 0.3)',
              borderTop: '4px solid #1E73BE',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 2rem'
            }}></div>
            <h2 style={{ marginBottom: '1rem', color: '#1E73BE' }}>Processing Payment</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#22c55e',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              fontSize: '30px'
            }}>
              ✓
            </div>
            <h2 style={{ marginBottom: '1rem', color: '#22c55e' }}>Payment Successful!</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{message}</p>
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
              fontSize: '30px'
            }}>
              ✕
            </div>
            <h2 style={{ marginBottom: '1rem', color: '#ef4444' }}>Payment Failed</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>{message}</p>
            <button
              onClick={handleRetry}
              style={{
                background: 'linear-gradient(135deg, #1E73BE 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '25px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;