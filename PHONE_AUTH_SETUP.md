# Phone Number Authentication Guide

## Best Options for Phone Auth

### Option 1: Firebase Authentication (Recommended)
- ✅ **Free**: 10K verifications/month
- ✅ **Global**: Works in 200+ countries  
- ✅ **Secure**: Built-in spam protection
- ✅ **Easy**: Simple SDK integration

### Option 2: Twilio Verify
- ✅ **Professional**: Enterprise-grade
- ✅ **Flexible**: Custom SMS templates
- ✅ **Analytics**: Detailed reporting
- ❌ **Cost**: $0.05 per verification

### Option 3: Supabase Auth (Built-in)
- ✅ **Integrated**: Already using Supabase
- ✅ **Simple**: One setup for all auth
- ✅ **Cost**: Free tier included

## Implementation: Firebase Phone Auth

### Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create project: "OnlinePortfolios"
3. Enable **Authentication** → **Phone** provider
4. Add authorized domains: `onlineportfolios.in`

### Step 2: Install Firebase SDK

```bash
npm install firebase
```

### Step 3: Firebase Configuration

```javascript
// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "onlineportfolios.firebaseapp.com",
  projectId: "onlineportfolios",
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Step 4: Phone Login Component

```javascript
// PhoneLogin.tsx
import { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './firebase-config';

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [confirmationResult, setConfirmationResult] = useState(null);

  const sendOTP = async () => {
    try {
      // Setup reCAPTCHA
      const recaptcha = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
      }, auth);

      // Send OTP
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const verifyOTP = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // User is signed in - redirect to dashboard
      console.log('Phone authentication successful:', user);
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="phone-auth">
      {step === 'phone' ? (
        <div className="phone-step">
          <h3>Enter Phone Number</h3>
          <input
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={sendOTP}>Send OTP</button>
        </div>
      ) : (
        <div className="otp-step">
          <h3>Enter Verification Code</h3>
          <p>Code sent to {phoneNumber}</p>
          <input
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify</button>
        </div>
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
};
```

### Step 5: Environment Variables

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=onlineportfolios.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=onlineportfolios
```

## Alternative: Supabase Phone Auth

If you want to keep everything in Supabase:

```javascript
// Supabase phone auth
import { supabase } from './supabase-config';

const sendOTP = async (phone) => {
  const { error } = await supabase.auth.signInWithOtp({
    phone: phone,
  });
  
  if (error) console.error('Error:', error);
};

const verifyOTP = async (phone, token) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phone,
    token: token,
    type: 'sms'
  });
  
  if (error) console.error('Error:', error);
  else console.log('User:', data.user);
};
```

## Benefits:
- ✅ Universal access
- ✅ High security with 2FA
- ✅ No email required
- ✅ Good for international users