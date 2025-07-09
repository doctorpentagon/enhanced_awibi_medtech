const express = require('express');
const cors = require('cors');

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - Allow all origins for deployment
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AWIBI MEDTECH API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AWIBI MEDTECH API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
  });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }
  
  res.status(400).json({
    success: false,
    message: 'Database not connected. Please configure MongoDB connection.',
  });
});

app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }
  
  res.status(400).json({
    success: false,
    message: 'Database not connected. Please configure MongoDB connection.',
  });
});

app.get('/api/auth/me', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Not authenticated',
  });
});

// Google OAuth routes
app.get('/api/auth/google', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Google OAuth not configured yet',
  });
});

// Users endpoints
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Users endpoint working',
  });
});

// Chapters endpoints
app.get('/api/chapters', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        name: 'AMT Lagos',
        city: 'Lagos',
        country: 'Nigeria',
        members: 120,
        type: 'Regional',
        status: 'Active',
      },
      {
        id: 2,
        name: 'AMT Abuja',
        city: 'Abuja',
        country: 'Nigeria',
        members: 85,
        type: 'Regional',
        status: 'Active',
      },
    ],
    message: 'Chapters endpoint working',
  });
});

// Events endpoints
app.get('/api/events', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        title: 'AI in Healthcare Summit 2024',
        date: '2024-02-15',
        location: 'Virtual',
        attendees: 250,
        type: 'Summit',
        status: 'Registration Open',
      },
      {
        id: 2,
        title: 'Telemedicine Workshop',
        date: '2024-02-20',
        location: 'Lagos, Nigeria',
        attendees: 80,
        type: 'Workshop',
        status: 'Registration Open',
      },
    ],
    message: 'Events endpoint working',
  });
});

// Badges endpoints
app.get('/api/badges', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Badges endpoint working',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  res.status(error.status || 500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for all origins`);
});

module.exports = app;

