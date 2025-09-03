import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-content">
        <header className="privacy-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <section className="privacy-section">
          <h2>1. Information We Collect</h2>
          <p>
            OnlinePortfolios collects information you provide directly to us, such as when you:
          </p>
          <ul>
            <li>Create an account on our platform</li>
            <li>Upload your resume for portfolio creation</li>
            <li>Connect your LinkedIn profile</li>
            <li>Use our portfolio creation tools</li>
          </ul>
          
          <h3>LinkedIn Integration</h3>
          <p>
            When you connect your LinkedIn profile, we access:
          </p>
          <ul>
            <li>Basic profile information (name, headline, summary)</li>
            <li>Work experience and education</li>
            <li>Email address</li>
          </ul>
          <p>
            This information is used solely to pre-populate your portfolio and is not shared with third parties.
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Create and customize your professional portfolio</li>
            <li>Process payments for premium features</li>
            <li>Communicate with you about our services</li>
            <li>Ensure the security of our platform</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to outside parties except:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With service providers who assist us in operating our platform (under strict confidentiality agreements)</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, 
            alteration, disclosure, or destruction. Your data is encrypted in transit and at rest.
          </p>
        </section>

        <section className="privacy-section">
          <h2>5. LinkedIn Data</h2>
          <p>
            When you connect your LinkedIn profile:
          </p>
          <ul>
            <li>We only access the minimum data necessary to create your portfolio</li>
            <li>Your LinkedIn data is processed in accordance with LinkedIn's privacy policies</li>
            <li>You can disconnect your LinkedIn integration at any time</li>
            <li>We do not store your LinkedIn access tokens permanently</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>6. Resume Data</h2>
          <p>
            When you upload your resume:
          </p>
          <ul>
            <li>The file is processed to extract relevant information for your portfolio</li>
            <li>The original resume file is deleted after processing</li>
            <li>Only the extracted structured data is retained</li>
            <li>You maintain full control over your portfolio information</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>7. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to:
          </p>
          <ul>
            <li>Maintain your logged-in session</li>
            <li>Remember your preferences</li>
            <li>Analyze site usage and improve our services</li>
          </ul>
          <p>
            You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="privacy-section">
          <h2>8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Export your portfolio data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>9. Data Retention</h2>
          <p>
            We retain your personal information only as long as necessary to provide our services and comply with legal obligations. 
            When you delete your account, we remove your personal data within 30 days.
          </p>
        </section>

        <section className="privacy-section">
          <h2>10. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
            information from children under 13.
          </p>
        </section>

        <section className="privacy-section">
          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
            privacy policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="privacy-section">
          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our data practices, please contact us at:
          </p>
          <div className="contact-info">
            <p>Email: privacy@onlineportfolios.in</p>
            <p>Website: https://onlineportfolios.in</p>
          </div>
        </section>

        <div className="privacy-footer">
          <p>
            This privacy policy is effective as of {new Date().toLocaleDateString()} and governs the collection, 
            use, and disclosure of information by OnlinePortfolios.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;