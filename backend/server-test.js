const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();

// Trust proxy for accurate IP addresses behind reverse proxy
app.set('trust proxy', 1);

// Enhanced CORS configuration for Vercel and Render deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Define allowed origins
    const allowedOrigins = [
   const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      /\.vercel\.app$/,
      /\.netlify\.app$/,
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      console.log('CORS allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-CSRF-Token'
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs in development
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration (without MongoDB store for testing)
app.use(session({
  secret: process.env.SESSION_SECRET || 'awibi-medtech-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for development
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax',
  },
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AWIBI MEDTECH API is running (Test Mode)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Not connected (Test Mode)',
  });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working correctly',
    origin: req.get('Origin'),
    timestamp: new Date().toISOString(),
  });
});

// Test authentication endpoints
app.post('/api/auth/test-register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  // Simulate registration
  res.status(201).json({
    success: true,
    message: 'User registered successfully (Test Mode)',
    data: {
      user: {
        id: 'test-user-id',
        firstName,
        lastName,
        email,
        role: 'Member',
      },
      token: 'test-jwt-token',
    },
  });
});

app.post('/api/auth/test-login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulate login
  res.status(200).json({
    success: true,
    message: 'Login successful (Test Mode)',
    data: {
      user: {
        id: 'test-user-id',
        firstName: 'Test',
        lastName: 'User',
        email,
        role: 'Member',
      },
      token: 'test-jwt-token',
    },
  });
});

app.get('/api/auth/test-profile', (req, res) => {
  // Simulate getting user profile
  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully (Test Mode)',
    data: {
      user: {
        id: 'test-user-id',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'Member',
        avatar: '',
        chapters: [],
        badges: [],
      },
    },
  });
});

// Test dashboard endpoint
app.get('/api/dashboard/test-overview', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dashboard data retrieved successfully (Test Mode)',
    data: {
      user: {
        id: 'test-user-id',
        fullName: 'Test User',
        role: 'Member',
        avatar: '',
        badgeCount: 3,
        chapterCount: 1,
        unreadNotifications: 2,
      },
      stats: {
        eventsAttended: 5,
        eventsCreated: 0,
        badgesEarned: 3,
        contributionScore: 150,
      },
      memberStats: {
        joinedChapters: [
          {
            _id: 'test-chapter-id',
            name: 'Lagos Chapter',
            city: 'Lagos',
            country: 'Nigeria',
          }
        ],
        upcomingEvents: [
          {
            _id: 'test-event-id',
            title: 'Healthcare Innovation Summit',
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            location: 'Lagos, Nigeria',
            type: 'Summit',
          }
        ],
        recentBadges: [
          {
            category: 'Member',
            earnedAt: new Date(),
          }
        ],
      },
    },
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found (Test Mode)',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  
  // CORS error
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      origin: req.get('Origin'),
    });
  }
  
  // Default error
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error (Test Mode)',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 AWIBI MEDTECH API Test Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Health Check: http://localhost:${PORT}/health
📊 CORS Test: http://localhost:${PORT}/api/test-cors
🧪 Test Mode: Database not required
  `);
});

module.exports = app;

