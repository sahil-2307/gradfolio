# Set Vercel Environment Variables for LinkedIn

## Method 1: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your `onlineportfolios` project
3. Click on **Settings** tab
4. Navigate to **Environment Variables**
5. Add these variables:

### Frontend Variables:
```
Name: REACT_APP_LINKEDIN_CLIENT_ID
Value: 77mf916vuv8u6i
Environment: Production, Preview, Development
```

### Backend Variables:
```
Name: LINKEDIN_CLIENT_ID  
Value: 77mf916vuv8u6i
Environment: Production, Preview, Development
```

```
Name: LINKEDIN_CLIENT_SECRET
Value: [Your Client Secret - click "Show" in LinkedIn Developer Console]
Environment: Production, Preview, Development
```

## Method 2: Via Vercel CLI

If you have Vercel CLI installed:

```bash
# Frontend
vercel env add REACT_APP_LINKEDIN_CLIENT_ID

# Backend  
vercel env add LINKEDIN_CLIENT_ID
vercel env add LINKEDIN_CLIENT_SECRET
```

## Method 3: Via .env Files (Local Development)

Create `/Users/sahilb/Code/Sahil/Gradfolio/.env.local`:
```env
# LinkedIn OAuth - Backend
LINKEDIN_CLIENT_ID=77mf916vuv8u6i
LINKEDIN_CLIENT_SECRET=your_secret_here

# LinkedIn OAuth - Frontend  
REACT_APP_LINKEDIN_CLIENT_ID=77mf916vuv8u6i
```

## ⚠️ After Adding Environment Variables

1. **Redeploy your app** (environment variables require redeployment)
2. **Test LinkedIn OAuth** - it should now complete the full flow
3. **Check console logs** for debugging information

## 🔍 Testing Steps

1. Click "Connect LinkedIn" button
2. LinkedIn popup should open
3. Login/authorize your app
4. Should redirect back to your app with data
5. Check browser console and Vercel function logs for any errors

## 📋 Troubleshooting

If LinkedIn still goes to feed instead of callback:
- ✅ Verify OAuth scopes are added in LinkedIn Developer Console
- ✅ Check redirect URI matches exactly: `https://onlineportfolios.in/api/linkedin-callback`
- ✅ Ensure environment variables are deployed (redeploy if needed)
- ✅ Check Vercel function logs for errors