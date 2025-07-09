const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5002;

// Enhanced CORS configuration for testing
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all origins for testing
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin'
  ],
  optionsSuccessStatus: 200
}));

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AWIBI MEDTECH API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0',
    cors: 'Enabled'
  });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working correctly',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Test authentication endpoint
app.post('/api/auth/test-login', (req, res) => {
  res.json({
    success: true,
    message: 'Test login successful',
    data: {
      user: {
        id: 'test-user-123',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@awibi-medtech.com',
        role: 'Member'
      },
      token: 'test-jwt-token-123'
    }
  });
});

// Test analytics endpoint
app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      platform: {
        totalUsers: 2847,
        activeUsers: 2634,
        totalChapters: 40,
        totalEvents: 156
      },
      growth: {
        newUsersThisMonth: 234,
        userGrowthRate: 8.9
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ===================================');
  console.log('🚀 AWIBI MEDTECH TEST SERVER STARTED');
  console.log('🚀 ===================================');
  console.log(`🌐 Server: http://0.0.0.0:${PORT}`);
  console.log(`🔗 Health Check: http://0.0.0.0:${PORT}/health`);
  console.log(`🌍 CORS: Enabled for all origins`);
  console.log('🚀 ===================================');
});
