# 🎓 Gradfolio - Professional Portfolio Generator

A modern, responsive portfolio generator specifically designed for college graduates and professionals. Create stunning portfolios in minutes with multiple templates and full customization options.

## ✨ Features

- **Multiple Templates**: Choose from professionally designed templates
  - Modern Professional (Dark theme with gold accents)
  - Creative Portfolio (Vibrant gradients and animations)  
  - More templates coming soon!

- **Live Preview**: See templates before customizing
- **Easy Customization**: User-friendly admin panel for all content
- **Source Code Download**: Download your customized portfolio as a ZIP file
- **Responsive Design**: Works perfectly on all devices
- **No Payment Required**: Completely free to use
- **Performance Optimized**: Fast loading and smooth animations

## 🚀 Quick Start

### Development

```bash
# Clone the repository
git clone <your-repo-url>
cd gradfolio

# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:3000` to see the application.

### Production

```bash
# Build for production
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Home.tsx/css          # Main landing page
│   ├── ThreeBackground.tsx   # 3D particle background
│   ├── TemplateSelector.tsx  # Template selection interface
│   └── PaymentPage.tsx       # Free plan selection
public/
├── landing_1/               # Modern Professional Template
│   ├── index.html          # Full template with admin access
│   ├── preview.html        # Clean preview version
│   ├── admin.html          # Customization panel
│   └── assets...
├── landing_2/               # Creative Portfolio Template
│   ├── index.html          # Full template with admin access
│   ├── preview.html        # Clean preview version
│   ├── admin.html          # Customization panel
│   └── assets...
└── other assets...
```

## 🛠️ How It Works

### For Users:
1. **Visit the main site** - See the landing page with features
2. **Click "Create Portfolio"** - Choose from available templates
3. **Preview templates** - See clean previews without admin buttons
4. **Select template** - Choose and confirm (free plan)
5. **Customize** - Use the admin panel to personalize content
6. **Download** - Get source code as ZIP file for hosting anywhere

### Template System:
- **index.html**: Full template with admin access button
- **preview.html**: Clean version for previewing (no admin button)
- **admin.html**: Customization interface
- **Automatic data injection**: User data gets embedded directly into HTML

## 🎨 Templates

### 1. Modern Professional
- Dark theme with gold accents
- Animated particle background  
- Perfect for developers and tech professionals
- Clean, minimalist design

### 2. Creative Portfolio
- Vibrant gradient themes
- Interactive animations
- Ideal for designers and creative professionals
- Gallery-focused layout

## 💻 Customization Options

Each template includes full customization for:
- **Personal Information**: Name, title, contact details
- **About Section**: Personal description and bio
- **Skills**: Technical and soft skills with categories
- **Experience**: Work history and positions
- **Projects**: Portfolio pieces with descriptions and links
- **Contact**: Social media links and contact methods
- **Theme**: Colors and styling options

## 📦 Download Feature

Users can download their customized portfolio as a complete ZIP package including:
- `index.html` - Customized portfolio page
- `styles.css` - All styling
- `script.js` - Interactive functionality
- `README.md` - Setup instructions
- All necessary assets

The downloaded portfolio is completely self-contained and ready to host on any platform.

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment options:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop build folder
- **GitHub Pages**: Use gh-pages package

## 🔧 Technology Stack

- **Frontend**: React 19, TypeScript
- **3D Graphics**: Three.js
- **Styling**: CSS3 with modern features
- **Build Tool**: Create React App
- **Deployment**: Vercel/Netlify ready

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Additional portfolio templates
- [ ] Custom domain integration
- [ ] Advanced theme customization
- [ ] Template marketplace
- [ ] Analytics integration
- [ ] SEO optimization tools

## 🆘 Support

If you have any questions or issues:
- Create an issue on GitHub
- Check the deployment guide
- Review the documentation

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ for college graduates and professionals looking to showcase their work beautifully.**