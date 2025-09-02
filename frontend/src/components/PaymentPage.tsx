import React, { useState } from 'react';
import { load } from '@cashfreepayments/cashfree-js';
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

  const handleFreePlan = () => {
    // Redirect directly to admin panel for free plan
    window.location.href = template.adminUrl;
  };

  const createPaymentOrder = async () => {
    try {
      setPaymentLoading(true);
      setError('');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create-payment-order`, {
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
      setError('Failed to initiate payment. Please try again.');
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

      // Initialize Cashfree
      const cashfree = await load({
        mode: process.env.REACT_APP_CASHFREE_ENVIRONMENT as 'sandbox' | 'production'
      });

      const checkoutOptions = {
        paymentSessionId: paymentOrder.payment_session_id,
        redirectTarget: '_modal',
      };

      cashfree.checkout(checkoutOptions).then((result: any) => {
        if (result.error) {
          console.error('Payment failed:', result.error);
          setError('Payment failed. Please try again.');
        } else if (result.redirect) {
          console.log('Payment successful, redirecting...');
          // Redirect to admin panel after successful payment
          window.location.href = template.adminUrl;
        }
      });

    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getOriginalPrice = () => {
    // Define pricing based on template
    const pricing = {
      1: 999, // Basic
      2: 1499, // Plus  
      3: 2499, // Pro
      4: 3999, // Executive
    };
    return pricing[template.id as keyof typeof pricing] || 999;
  };

  const getDiscountedPrice = () => {
    return Math.round(getOriginalPrice() * 0.5); // 50% off
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
              {/* Free Plan */}
              <div className={`pricing-card ${selectedPlan === 'free' ? 'selected' : ''}`}>
                <div className="plan-header">
                  <h4>Free Plan</h4>
                  <div className="price">₹0<span>/forever</span></div>
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
                  Select Free Plan
                </button>
              </div>

              {/* Premium Plan */}
              <div className={`pricing-card premium ${selectedPlan === 'premium' ? 'selected' : ''}`}>
                <div className="plan-badge">50% OFF - Fresh Grad Special!</div>
                <div className="plan-header">
                  <h4>Premium Plan</h4>
                  <div className="price">
                    ₹{getDiscountedPrice()}
                    <span className="original-price">₹{getOriginalPrice()}</span>
                    <span>/lifetime</span>
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
                  className="action-btn free"
                  onClick={handleFreePlan}
                  disabled={paymentLoading}
                >
                  Get Started Free
                </button>
              ) : (
                <div className="premium-actions">
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
                        Pay with UPI - ₹{getDiscountedPrice()}
                      </>
                    )}
                  </button>
                  <div className="payment-info">
                    <p>Secure payment via UPI (GPay, PhonePe, Paytm, etc.)</p>
                    <p>✓ Instant access after payment</p>
                  </div>
                </div>
              )}

              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;