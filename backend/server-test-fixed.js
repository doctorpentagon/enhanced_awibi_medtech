const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration for Vercel and Render deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Define allowed origins
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
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AWIBI MEDTECH API Test Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// CORS test endpoint
app.get('/api/test-cors', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CORS is working correctly',
    origin: req.headers.origin || 'No origin header',
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
        email: 'test@awibi.com',
        role: 'Member',
        avatar: null,
        bio: 'Test user for AWIBI MEDTECH platform',
        location: 'Test Location',
        joinedAt: new Date().toISOString(),
      },
    },
  });
});

// Test dashboard endpoints
app.get('/api/dashboard/test-overview', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dashboard overview retrieved successfully (Test Mode)',
    data: {
      stats: {
        totalMembers: 1250,
        totalChapters: 45,
        totalEvents: 128,
        totalBadges: 25,
      },
      recentActivity: [
        {
          id: 1,
          type: 'event',
          title: 'New event: AI in Healthcare Summit',
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          type: 'member',
          title: 'New member joined: John Doe',
          timestamp: new Date().toISOString(),
        },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'AI in Healthcare Summit',
          date: '2025-08-15',
          location: 'Lagos, Nigeria',
        },
        {
          id: 2,
          title: 'MedTech Innovation Workshop',
          date: '2025-08-22',
          location: 'Nairobi, Kenya',
        },
      ],
    },
  });
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      origin: req.headers.origin || 'unknown',
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error (Test Mode)',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found (Test Mode)`,
    path: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AWIBI MEDTECH API Test Server is running!`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 CORS Test: http://localhost:${PORT}/api/test-cors`);
  console.log(`🧪 Test Mode: Database not required`);
  console.log('');
});

module.exports = app;

