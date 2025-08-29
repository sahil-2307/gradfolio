import React from 'react';
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
  const handleFreePlan = () => {
    // Redirect directly to admin panel for free plan
    window.location.href = template.adminUrl;
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
            <h3>Get Started for Free</h3>
            
            <div className="pricing-cards">
              <div className="pricing-card selected">
                <div className="plan-header">
                  <h4>Free Plan</h4>
                  <div className="price">$0<span>/forever</span></div>
                </div>
                <div className="plan-features">
                  <div className="feature">✓ Full template access</div>
                  <div className="feature">✓ Complete customization</div>
                  <div className="feature">✓ Export HTML/CSS</div>
                  <div className="feature">✓ Portfolio builder</div>
                  <div className="feature">✓ Mobile responsive</div>
                  <div className="feature">✓ Easy to use interface</div>
                </div>
                <button 
                  className="plan-btn selected"
                  onClick={handleFreePlan}
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;