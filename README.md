# AWIBI MEDTECH - Full Stack Application

A comprehensive healthcare technology community platform built with React.js frontend and Node.js backend.

## 🚀 Features

- **Modern React Frontend**: Built with React + Vite + TypeScript + Tailwind CSS
- **Robust Node.js Backend**: Express.js with MongoDB integration
- **Authentication System**: JWT + Google OAuth support
- **Responsive Design**: Mobile-first approach with clean UI
- **CORS Configured**: Ready for Vercel frontend and Render backend deployment
- **Community Features**: Chapters, Events, Badges, and User Management

## 📁 Project Structure

```
awibi-medtech/
├── frontend/awibi-medtech-frontend/    # React application
│   ├── src/
│   │   ├── components/                 # Reusable components
│   │   ├── pages/                      # Page components
│   │   ├── contexts/                   # React contexts
│   │   ├── lib/                        # API and utilities
│   │   └── assets/                     # Images and static files
│   ├── .env.example                    # Environment variables template
│   └── package.json
├── backend/                            # Node.js API server
│   ├── config/                         # Database and auth config
│   ├── models/                         # MongoDB models
│   ├── routes/                         # API routes
│   ├── middleware/                     # Custom middleware
│   ├── server-final.js                 # Main server file
│   ├── .env.example                    # Environment variables template
│   └── package.json
└── README.md                           # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm/pnpm
- MongoDB (local or cloud)
- Google OAuth credentials (optional)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/awibi-medtech

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Google OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend/awibi-medtech-frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your backend URL:
```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Google OAuth Configuration (optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

5. Start the frontend development server:
```bash
pnpm run dev
```

The frontend will run on `http://localhost:5173`

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Build the frontend:
```bash
cd frontend/awibi-medtech-frontend
pnpm run build
```

2. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Set the build command: `pnpm run build`
   - Set the output directory: `dist`
   - Add environment variables in Vercel dashboard:
     - `VITE_API_URL`: Your backend URL (e.g., `https://your-app.onrender.com`)
     - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=10000
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-production-jwt-secret
     FRONTEND_URL=https://your-vercel-app.vercel.app
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     SESSION_SECRET=your-production-session-secret
     ```

## 🔧 CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- Any `.vercel.app` domain
- The `FRONTEND_URL` environment variable

For production, update the `FRONTEND_URL` environment variable with your deployed frontend URL.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Chapters
- `GET /api/chapters` - Get all chapters
- `GET /api/chapters/:id` - Get chapter by ID
- `POST /api/chapters` - Create new chapter

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event

### Badges
- `GET /api/badges` - Get all badges
- `GET /api/badges/:id` - Get badge by ID

## 🎨 Design System

The application uses a clean, modern design inspired by Google Developer Community:
- **Colors**: Blue primary, gray secondary, white background
- **Typography**: Clean, readable fonts with proper hierarchy
- **Layout**: Responsive grid system with proper spacing
- **Components**: Consistent button styles, form inputs, and cards

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers
- Input validation and sanitization

## 🧪 Testing

### Frontend Testing
```bash
cd frontend/awibi-medtech-frontend
pnpm run test
```

### Backend Testing
```bash
cd backend
npm test
```

## 📝 Environment Variables Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/awibi-medtech
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-session-secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - User authentication (JWT + Google OAuth)
  - Chapter management
  - Event system
  - Badge system
  - Responsive design
  - CORS configuration for deployment

---

Built with ❤️ for the AWIBI MEDTECH community

