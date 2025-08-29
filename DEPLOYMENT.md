# Gradfolio Deployment Guide

## Quick Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Link to existing project or create new one
   - Confirm project settings
   - Deploy

### Option 2: Deploy to Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `build` folder
   - Or connect your GitHub repository

### Option 3: Deploy to GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/gradfolio",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## Environment Setup

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Test Production Build Locally
```bash
npm install -g serve
serve -s build
```

## Features Available After Deployment

✅ **Template Selection** - Users can choose from multiple portfolio templates  
✅ **Live Preview** - Preview templates without settings button  
✅ **Free Portfolio Creation** - No payment required  
✅ **Customization Panel** - Full admin interface for portfolio customization  
✅ **Source Code Download** - Users can download their customized portfolio as ZIP  
✅ **Responsive Design** - Works on all devices  
✅ **Performance Optimized** - Fast loading with optimized assets  

## File Structure

```
build/
├── index.html          # Main React app
├── static/            # React app assets
├── landing_1/         # Modern Professional template
│   ├── index.html     # Full template with admin access
│   ├── preview.html   # Preview version (no admin button)
│   ├── admin.html     # Admin panel
│   └── assets...
├── landing_2/         # Creative Portfolio template
│   ├── index.html     # Full template with admin access
│   ├── preview.html   # Preview version (no admin button)
│   ├── admin.html     # Admin panel
│   └── assets...
└── other assets...
```

## Custom Domain Setup

### For Vercel:
1. Go to your project dashboard
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### For Netlify:
1. Go to site settings
2. Domain management → Custom domains
3. Add domain and verify DNS

## SSL Certificate

Both Vercel and Netlify provide automatic SSL certificates for HTTPS.

## Post-Deployment Checklist

- [ ] Main React app loads correctly at root URL
- [ ] Template previews work at `/landing_1/preview.html` and `/landing_2/preview.html`
- [ ] Admin panels accessible at `/landing_1/admin.html` and `/landing_2/admin.html`
- [ ] Download source code feature works in admin panels
- [ ] All assets load correctly (CSS, JS, images)
- [ ] Mobile responsiveness works
- [ ] Template selection flow works from main app

## Monitoring

- Set up analytics (Google Analytics, Plausible, etc.)
- Monitor error logs in deployment platform
- Test regularly on different devices and browsers