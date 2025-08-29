# 🎓 GradFolio

Enterprise portfolio platform for graduates, colleges, and companies to create, manage, and discover professional portfolios at scale.

## ✨ Features

### 🎯 Core Features
- **Easy Profile Creation**: Simple form-based profile setup
- **File Upload Support**: Profile photos and PDF resume uploads
- **Dynamic Landing Pages**: Auto-generated personal pages at `/profile/username`
- **Social Media Integration**: Links to LinkedIn, GitHub, Twitter, and personal websites
- **Skills Showcase**: Dynamic skill tags and categories
- **Responsive Design**: Mobile-first, fully responsive layout

### 🌟 Visual Features
- **Animated Backgrounds**: Three.js powered particle systems
- **Basic Template**: Clean, professional layout with subtle animations
- **Premium Template**: Advanced 3D effects, interactive elements, and enhanced visuals
- **Mouse Interactions**: Premium users get interactive 3D elements

### 💳 Premium Features
- **Advanced Animations**: Enhanced particle systems with floating 3D cubes
- **Interactive Elements**: Mouse-responsive 3D background
- **Premium Badge**: Visual indicator of premium status
- **Enhanced Styling**: Glass morphism effects and advanced animations

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Three.js** for 3D animations and particle systems
- **React Router** for client-side routing
- **Axios** for API communication
- **CSS3** with modern features (backdrop-filter, gradients)

### Backend
- **Node.js** with Express
- **Multer** for file uploads
- **CORS** for cross-origin requests
- **In-memory storage** for POC (easily replaceable with MongoDB)
- **Stripe** integration for payments (test mode)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gradfolio
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```
   
   For the frontend, you'll need to update the Stripe publishable key in:
   `src/components/StripeCheckout.tsx` (line 7)

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   node index.js
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   # From the root directory
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser**
   Visit `http://localhost:3000` to see the application

## 🎯 Usage Flow

### Creating a Profile

1. **Fill out the form** at the homepage (`/`)
   - Enter your username (will be your URL slug)
   - Provide basic information (name, bio, university, graduation year)
   - Upload a profile photo (optional)
   - Upload your resume as PDF (optional)
   - Add skills using the tag system
   - Add social media links

2. **Submit the form**
   - Your profile will be created and stored
   - You'll be redirected to your personal page

3. **View your landing page**
   - Your page will be available at `/profile/your-username`
   - Share this URL with employers or on social media

### Upgrading to Premium

1. **Click "Upgrade to Premium"** on your profile page
2. **Complete the checkout process** (simulated in POC mode)
3. **Enjoy premium features** including advanced 3D animations

## 📁 Project Structure

```
gradfolio/
├── backend/
│   ├── index.js              # Express server
│   ├── package.json          # Backend dependencies
│   ├── .env                  # Environment variables
│   └── uploads/              # File storage (auto-created)
│       ├── profiles/         # Profile photos
│       └── resumes/          # Resume PDFs
├── src/
│   ├── components/
│   │   ├── UserForm.tsx      # Profile creation form
│   │   ├── UserForm.css
│   │   ├── LandingPage.tsx   # Generated profile pages
│   │   ├── LandingPage.css
│   │   ├── ThreeBackground.tsx # 3D animations
│   │   ├── StripeCheckout.tsx  # Payment component
│   │   └── StripeCheckout.css
│   ├── App.tsx               # Main app with routing
│   ├── App.css
│   └── index.tsx             # React entry point
├── public/                   # Static assets
├── package.json              # Frontend dependencies
└── README.md                 # This file
```

## 🛠️ API Endpoints

### Profile Management
- `POST /api/profile` - Create a new user profile
- `GET /api/profile/:username` - Get user profile by username
- `GET /api/users` - List all users (debugging)

### Premium Features
- `POST /api/profile/:username/premium` - Upgrade user to premium
- `POST /api/stripe/webhook` - Stripe webhook handler

### File Serving
- `GET /profiles/:filename` - Serve profile photos
- `GET /resumes/:filename` - Serve resume PDFs

## 🎨 Templates

### Basic Template
- Clean, professional design
- Subtle particle background
- Responsive layout
- Standard social links
- Resume download button

### Premium Template
- Glass morphism design
- Advanced particle systems with 3D cubes
- Mouse-interactive elements
- Enhanced animations and transitions
- Premium badge display

## 🔧 Configuration

### Stripe Setup (for real payments)
1. Create a Stripe account
2. Get your test/live API keys
3. Update the `.env` file in backend
4. Update the publishable key in `StripeCheckout.tsx`

### File Upload Limits
- Profile photos: 10MB max, image files only
- Resumes: 10MB max, PDF files only

## 🐛 Known Issues & Limitations

### Current POC Limitations
- **In-memory storage**: Data is lost when server restarts
- **No authentication**: Anyone can access any profile
- **Simulated payments**: Stripe integration is demo-only
- **No email verification**: Usernames are not validated for uniqueness beyond memory
- **No image optimization**: Uploaded images are served as-is

### Potential Improvements
- Add MongoDB or PostgreSQL for persistent storage
- Implement user authentication and ownership
- Add image resizing and optimization
- Add email notifications
- Add profile analytics
- Add custom domain support
- Add SEO optimization
- Add social media preview cards

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder to your preferred platform
3. Update API endpoints to point to your backend URL

### Backend (Heroku/Railway/DigitalOcean)
1. Add environment variables to your deployment platform
2. Ensure file upload directories are properly configured
3. Consider using cloud storage (AWS S3, Cloudinary) for files

## 🤝 Contributing

This is a proof of concept project. For production use, consider:

1. Adding comprehensive error handling
2. Implementing user authentication
3. Adding database migrations
4. Setting up proper logging
5. Adding comprehensive testing
6. Implementing proper security measures

## 📄 License

MIT License - feel free to use this project as a starting point for your own implementations.

## 🙋‍♂️ Support

This is a proof of concept project created for demonstration purposes. For questions or issues, please refer to the codebase comments and documentation.

---

**Built with ❤️ using React, Node.js, and Three.js**