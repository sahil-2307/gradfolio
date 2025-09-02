import React, { useState } from 'react';
import './PaymentPage.css';

interface Template {
  id: number;
  name: string;
  description: string;
  adminUrl: string;
}

interface PaymentPageProps {
  template: Template;
  onCancel: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ template, onCancel }) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');


  const createPaymentOrder = async () => {
    try {
      setPaymentLoading(true);
      setError('');

      const response = await fetch(`/api/test-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          templateName: template.name,
          amount: getDiscountedPrice(), // 50% off price
        }),
      });

      const data = await response.json();
      if (data.success) {
        return data.paymentOrder;
      } else {
        throw new Error(data.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('Payment order creation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to initiate payment: ${errorMessage}`);
      return null;
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleUPIPayment = async () => {
    try {
      setPaymentLoading(true);
      
      // Create payment order
      const paymentOrder = await createPaymentOrder();
      if (!paymentOrder) return;

      // Load Cashfree v3 SDK dynamically
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => {
        // Initialize Cashfree v3
        const cashfree = (window as any).Cashfree({
          mode: process.env.REACT_APP_CASHFREE_ENVIRONMENT || 'sandbox'
        });

        // Start hosted checkout
        cashfree.checkout({
          paymentSessionId: paymentOrder.payment_session_id,
          returnUrl: `${window.location.origin}/payment-success?template=${template.id}`,
        }).then((result: any) => {
          if (result.error) {
            console.error('Payment failed:', result.error);
            setError('Payment failed. Please try again.');
          }
        }).catch((error: any) => {
          console.error('Payment error:', error);
          setError('Payment failed. Please try again.');
        });
      };
      
      document.head.appendChild(script);

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Payment failed: ${errorMessage}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const getOriginalPrice = () => {
    // Simple pricing: ₹10 for basic, ₹99 for premium
    return selectedPlan === 'free' ? 10 : 99;
  };

  const getDiscountedPrice = () => {
    return getOriginalPrice(); // No discount, direct pricing
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <button className="back-btn" onClick={onCancel}>
            <i className="fas fa-arrow-left"></i>
            Back to Templates
          </button>
          <div className="selected-template">
            <h2>Selected Template: <span className="template-name">{template.name}</span></h2>
            <p>{template.description}</p>
          </div>
        </div>

        <div className="payment-content">
          <div className="pricing-section">
            <h3>Choose Your Plan</h3>
            
            <div className="pricing-cards">
              {/* Basic Plan */}
              <div className={`pricing-card ${selectedPlan === 'free' ? 'selected' : ''}`}>
                <div className="plan-header">
                  <h4>Basic Plan</h4>
                  <div className="price">₹10<span>/lifetime</span></div>
                </div>
                <div className="plan-features">
                  <div className="feature">✓ Basic template access</div>
                  <div className="feature">✓ Standard customization</div>
                  <div className="feature">✓ Export HTML/CSS</div>
                  <div className="feature">✓ Portfolio builder</div>
                  <div className="feature">✓ Mobile responsive</div>
                  <div className="feature-limitation">✗ Priority support</div>
                </div>
                <button 
                  className={`plan-btn ${selectedPlan === 'free' ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan('free')}
                >
                  Select Basic Plan
                </button>
              </div>

              {/* Premium Plan */}
              <div className={`pricing-card premium ${selectedPlan === 'premium' ? 'selected' : ''}`}>
                <div className="plan-badge">Best Value!</div>
                <div className="plan-header">
                  <h4>Premium Plan</h4>
                  <div className="price">
                    ₹99<span>/lifetime</span>
                  </div>
                </div>
                <div className="plan-features">
                  <div className="feature">✓ Premium template access</div>
                  <div className="feature">✓ Advanced customization</div>
                  <div className="feature">✓ Export HTML/CSS/React</div>
                  <div className="feature">✓ Advanced portfolio builder</div>
                  <div className="feature">✓ Mobile + Desktop responsive</div>
                  <div className="feature">✓ Priority email support</div>
                  <div className="feature">✓ SEO optimization</div>
                  <div className="feature">✓ Custom domain support</div>
                </div>
                <button 
                  className={`plan-btn premium ${selectedPlan === 'premium' ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan('premium')}
                >
                  Select Premium Plan
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-section">
              {selectedPlan === 'free' ? (
                <button 
                  className="action-btn premium"
                  onClick={handleUPIPayment}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-mobile-alt"></i>
                      Pay ₹10 - Basic Plan
                    </>
                  )}
                </button>
              ) : (
                <button 
                  className="action-btn premium"
                  onClick={handleUPIPayment}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-mobile-alt"></i>
                      Pay ₹99 - Premium Plan
                    </>
                  )}
                </button>
              )}

              <div className="payment-info">
                <p>Secure payment via UPI (GPay, PhonePe, Paytm, etc.)</p>
                <p>✓ Instant access after payment</p>
              </div>

              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;