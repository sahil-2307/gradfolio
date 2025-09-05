# Google OAuth Integration Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "OnlinePortfolios"
3. Enable **Google+ API** and **People API**

## Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in:
   - App name: OnlinePortfolios
   - User support email: your-email@domain.com
   - Developer contact: your-email@domain.com
   - Authorized domains: onlineportfolios.in

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. Name: OnlinePortfolios Web Client
5. Authorized redirect URIs:
   - `https://onlineportfolios.in/api/google-callback`
   - `http://localhost:3000/api/google-callback` (for development)

## Step 4: Environment Variables

### Frontend (.env)
```env
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Backend/Vercel (.env or environment variables)
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Step 5: Frontend Implementation

### Add Google OAuth Button to Login Page
```javascript
// In Login.tsx
const handleGoogleLogin = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/google-callback`;
  const scope = 'openid email profile';
  
  const googleAuthUrl = `https://accounts.google.com/oauth/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=code&` +
    `access_type=offline`;
    
  window.location.href = googleAuthUrl;
};

// Button JSX
<button onClick={handleGoogleLogin} className="btn btn-google">
  <i className="fab fa-google"></i> Continue with Google
</button>
```

### CSS for Google Button
```css
.btn-google {
  background: #4285f4;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-google:hover {
  background: #3367d6;
  transform: translateY(-2px);
}
```

## Step 6: Backend API Implementation

### Create `/api/google-callback.js`
```javascript
export default async function handler(req, res) {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect('/login?error=missing_code');
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${req.headers.origin}/api/google-callback`,
      }),
    });

    const tokens = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const googleUser = await userResponse.json();
    
    // Create/login user in your system
    const user = await createOrLoginGoogleUser(googleUser);
    
    // Set session/JWT token
    // Redirect to dashboard
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect('/login?error=google_auth_failed');
  }
}

function createOrLoginGoogleUser(googleUser) {
  // Implement your user creation/login logic
  // Save to Supabase or your database
  return {
    id: googleUser.id,
    email: googleUser.email,
    name: googleUser.name,
    picture: googleUser.picture,
    provider: 'google'
  };
}
```

## Benefits:
- ✅ One-click registration/login
- ✅ Instant profile data
- ✅ High conversion rates
- ✅ No password complexity issues