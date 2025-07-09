const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Auth rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Database connection with retry logic
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } else {
      console.log('⚠️  MongoDB URI not provided, running in demo mode');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Enhanced User Schema with comprehensive fields
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 50 },
  lastName: { type: String, required: true, trim: true, maxlength: 50 },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { type: String, minlength: 6 },
  googleId: { type: String, sparse: true },
  avatar: { type: String },
  role: { 
    type: String, 
    enum: ['member', 'leader', 'admin', 'superadmin'], 
    default: 'member' 
  },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  badges: [{ 
    badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    earnedAt: { type: Date, default: Date.now },
    awardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  profile: {
    bio: { type: String, maxlength: 500 },
    location: { type: String, maxlength: 100 },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    phoneNumber: { type: String },
    skills: [{ type: String, maxlength: 50 }],
    interests: [{ type: String, maxlength: 50 }],
    education: [{
      institution: { type: String, maxlength: 100 },
      degree: { type: String, maxlength: 100 },
      fieldOfStudy: { type: String, maxlength: 100 },
      startYear: { type: Number },
      endYear: { type: Number },
      current: { type: Boolean, default: false }
    }],
    experience: [{
      company: { type: String, maxlength: 100 },
      position: { type: String, maxlength: 100 },
      startDate: { type: Date },
      endDate: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String, maxlength: 500 }
    }],
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      github: { type: String },
      website: { type: String }
    }
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: true },
    eventReminders: { type: Boolean, default: true }
  },
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'chapters': 1 });
userSchema.index({ lastActive: -1 });

// Enhanced Chapter Schema
const chapterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, unique: true, lowercase: true },
  city: { type: String, required: true, trim: true, maxlength: 50 },
  country: { type: String, required: true, trim: true, maxlength: 50 },
  region: { type: String, maxlength: 50 },
  type: { 
    type: String, 
    enum: ['Regional', 'University', 'Corporate', 'Special Interest'], 
    default: 'Regional' 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Pending', 'Suspended'], 
    default: 'Pending' 
  },
  description: { type: String, maxlength: 1000 },
  mission: { type: String, maxlength: 500 },
  vision: { type: String, maxlength: 500 },
  leaders: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['Lead', 'Co-Lead', 'Organizer'], default: 'Lead' },
    appointedAt: { type: Date, default: Date.now },
    appointedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  members: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  establishedDate: { type: Date, default: Date.now },
  contactInfo: {
    email: { type: String },
    phone: { type: String },
    address: { type: String, maxlength: 200 }
  },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    website: { type: String }
  },
  meetingInfo: {
    schedule: { type: String, maxlength: 200 },
    location: { type: String, maxlength: 200 },
    virtualLink: { type: String }
  },
  location: {
    address: { type: String, maxlength: 200 },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    timezone: { type: String }
  },
  settings: {
    isPublic: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    maxMembers: { type: Number },
    allowEvents: { type: Boolean, default: true }
  },
  stats: {
    totalEvents: { type: Number, default: 0 },
    totalMembers: { type: Number, default: 0 },
    monthlyActiveMembers: { type: Number, default: 0 }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for member count
chapterSchema.virtual('memberCount').get(function() {
  return this.members ? this.members.length : 0;
});

// Pre-save middleware to generate slug
chapterSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Index for better performance
chapterSchema.index({ slug: 1 });
chapterSchema.index({ country: 1, city: 1 });
chapterSchema.index({ type: 1 });
chapterSchema.index({ status: 1 });

// Enhanced Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, maxlength: 2000 },
  shortDescription: { type: String, maxlength: 300 },
  type: { 
    type: String, 
    enum: ['Summit', 'Workshop', 'Hackathon', 'Mixer', 'Showcase', 'Webinar', 'Conference', 'Meetup', 'Training'], 
    required: true 
  },
  category: {
    type: String,
    enum: ['Health Tech', 'AI/ML', 'Data Science', 'Digital Health', 'Innovation', 'Leadership', 'Networking'],
    required: true
  },
  date: { type: Date, required: true },
  endDate: { type: Date },
  location: { type: String, required: true, maxlength: 200 },
  venue: {
    name: { type: String, maxlength: 100 },
    address: { type: String, maxlength: 200 },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  isVirtual: { type: Boolean, default: false },
  virtualInfo: {
    platform: { type: String, maxlength: 50 },
    link: { type: String },
    meetingId: { type: String },
    passcode: { type: String }
  },
  capacity: {
    maxAttendees: { type: Number },
    currentAttendees: { type: Number, default: 0 },
    waitlistEnabled: { type: Boolean, default: false }
  },
  attendees: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registeredAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Registered', 'Attended', 'No-show', 'Cancelled'], default: 'Registered' },
    checkInTime: { type: Date }
  }],
  waitlist: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coOrganizers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Registration Open', 'Registration Closed', 'Ongoing', 'Completed', 'Cancelled'], 
    default: 'Draft' 
  },
  visibility: {
    type: String,
    enum: ['Public', 'Chapter Only', 'Invite Only'],
    default: 'Public'
  },
  tags: [{ type: String, maxlength: 30 }],
  images: {
    banner: { type: String },
    thumbnail: { type: String },
    gallery: [{ type: String }]
  },
  registration: {
    deadline: { type: Date },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    requiresApproval: { type: Boolean, default: false },
    customFields: [{
      name: { type: String, maxlength: 50 },
      type: { type: String, enum: ['text', 'email', 'number', 'select', 'checkbox'] },
      required: { type: Boolean, default: false },
      options: [{ type: String }]
    }]
  },
  requirements: [{ type: String, maxlength: 200 }],
  agenda: [{ 
    startTime: { type: String, required: true },
    endTime: { type: String },
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 300 },
    speaker: {
      name: { type: String, maxlength: 100 },
      title: { type: String, maxlength: 100 },
      bio: { type: String, maxlength: 500 },
      avatar: { type: String }
    },
    type: { type: String, enum: ['Presentation', 'Workshop', 'Panel', 'Break', 'Networking'] }
  }],
  resources: [{
    name: { type: String, maxlength: 100 },
    type: { type: String, enum: ['Document', 'Video', 'Link', 'Presentation'] },
    url: { type: String },
    description: { type: String, maxlength: 200 }
  }],
  feedback: {
    enabled: { type: Boolean, default: true },
    questions: [{ type: String }],
    responses: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, maxlength: 500 },
      submittedAt: { type: Date, default: Date.now }
    }]
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for attendance rate
eventSchema.virtual('attendanceRate').get(function() {
  if (!this.attendees || this.attendees.length === 0) return 0;
  const attended = this.attendees.filter(a => a.status === 'Attended').length;
  return Math.round((attended / this.attendees.length) * 100);
});

// Pre-save middleware to generate slug
eventSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    const date = new Date(this.date);
    const dateStr = date.toISOString().split('T')[0];
    this.slug = `${this.title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')}-${dateStr}`;
  }
  next();
});

// Index for better performance
eventSchema.index({ slug: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ chapter: 1 });
eventSchema.index({ organizer: 1 });

// Enhanced Badge Schema
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, maxlength: 500 },
  icon: { type: String },
  image: { type: String },
  category: { 
    type: String, 
    enum: ['Achievement', 'Participation', 'Leadership', 'Innovation', 'Community', 'Learning', 'Contribution'], 
    required: true 
  },
  subcategory: { type: String, maxlength: 50 },
  criteria: { type: String, maxlength: 1000 },
  points: { type: Number, default: 0, min: 0 },
  level: { type: Number, default: 1, min: 1, max: 5 },
  isActive: { type: Boolean, default: true },
  rarity: { 
    type: String, 
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'], 
    default: 'Common' 
  },
  requirements: {
    minEvents: { type: Number, default: 0 },
    minChapters: { type: Number, default: 0 },
    minPoints: { type: Number, default: 0 },
    specificActions: [{ type: String }],
    timeframe: { type: String } // e.g., "30 days", "1 year"
  },
  rewards: {
    points: { type: Number, default: 0 },
    privileges: [{ type: String }],
    discounts: [{
      type: { type: String },
      value: { type: Number },
      description: { type: String }
    }]
  },
  stats: {
    totalAwarded: { type: Number, default: 0 },
    uniqueRecipients: { type: Number, default: 0 }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to generate slug
badgeSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Index for better performance
badgeSchema.index({ slug: 1 });
badgeSchema.index({ category: 1 });
badgeSchema.index({ rarity: 1 });
badgeSchema.index({ isActive: 1 });

// Create models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
const Badge = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);

// Connect to database
connectDB();

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'awibi-medtech-super-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  store: process.env.MONGODB_URI ? MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600,
    ttl: 7 * 24 * 60 * 60 // 7 days
  }) : undefined,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Enhanced CORS configuration for production deployment
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel domains (including preview deployments)
    if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow Netlify domains
    if (origin.includes('.netlify.app') || origin.includes('netlify.app')) {
      return callback(null, true);
    }
    
    // Allow localhost for development (any port)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow specific production domains from environment variable
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : [];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow custom domains
    const customDomains = process.env.CUSTOM_DOMAINS ? 
      process.env.CUSTOM_DOMAINS.split(',').map(domain => domain.trim()) : [];
    
    if (customDomains.some(domain => origin.includes(domain))) {
      return callback(null, true);
    }
    
    // Default allow all in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Log blocked origins in production for debugging
    console.warn(`🚫 CORS blocked origin: ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Handle preflight requests
app.options('*', cors());

// Passport configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'demo-client-id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo-client-secret',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      user.lastActive = new Date();
      await user.save();
      return done(null, user);
    }
    
    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
      user.googleId = profile.id;
      user.avatar = profile.photos[0].value;
      user.lastActive = new Date();
      user.isEmailVerified = true;
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = new User({
      googleId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value,
      isEmailVerified: true,
      lastActive: new Date()
    });
    
    await user.save();
    done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
      .populate('chapters.user', 'name city country')
      .populate('badges.badge', 'name category icon');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// Enhanced JWT middleware with better error handling
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'awibi-medtech-jwt-secret-2025');
    const user = await User.findById(decoded.userId)
      .populate('chapters.user', 'name city country')
      .populate('badges.badge', 'name category icon');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    // Update last active
    user.lastActive = new Date();
    await user.save();
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// Health check endpoint with comprehensive status
app.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const dbStats = mongoose.connection.readyState === 1 ? 
      await mongoose.connection.db.stats() : null;
    
    res.status(200).json({
      status: 'OK',
      message: 'AWIBI MEDTECH API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '3.0.0',
      database: {
        status: dbStatus,
        collections: dbStats ? dbStats.collections : 0,
        dataSize: dbStats ? `${Math.round(dbStats.dataSize / 1024 / 1024)}MB` : 'N/A'
      },
      features: {
        authentication: 'JWT + Google OAuth',
        cors: 'Enhanced for Vercel/Render',
        rateLimit: 'Enabled',
        security: 'Helmet + Compression',
        database: 'MongoDB with Mongoose'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AWIBI MEDTECH API v3.0',
    description: 'Advanced Health Tech Community Platform',
    version: '3.0.0',
    documentation: {
      health: '/health',
      endpoints: {
        auth: '/api/auth/*',
        users: '/api/users/*',
        chapters: '/api/chapters/*',
        events: '/api/events/*',
        badges: '/api/badges/*',
        dashboard: '/api/dashboard/*'
      }
    },
    features: [
      'JWT Authentication',
      'Google OAuth Integration',
      'Role-Based Access Control',
      'Chapter Management',
      'Event Management',
      'Badge System',
      'User Profiles',
      'Dashboard Analytics'
    ],
    cors: {
      enabled: true,
      supports: ['Vercel', 'Netlify', 'Custom Domains', 'Localhost'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
    }
  });
});

// CORS test endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working correctly',
    origin: req.headers.origin || 'No origin header',
    timestamp: new Date().toISOString(),
    headers: {
      'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials')
    }
  });
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, chapter } = req.body;
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        code: 'MISSING_FIELDS',
        required: ['firstName', 'lastName', 'email', 'password']
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
        code: 'PASSWORD_TOO_SHORT'
      });
    }
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable',
        code: 'DATABASE_UNAVAILABLE'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
        code: 'USER_EXISTS'
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    
    // Create user
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });
    
    await user.save();
    
    // Add to chapter if specified
    if (chapter) {
      const chapterDoc = await Chapter.findById(chapter);
      if (chapterDoc) {
        chapterDoc.members.push({ user: user._id });
        await chapterDoc.save();
        user.chapters.push(chapter);
        await user.save();
      }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'awibi-medtech-jwt-secret-2025',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationToken;
    delete userResponse.passwordResetToken;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
        code: 'DUPLICATE_EMAIL'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable',
        code: 'DATABASE_UNAVAILABLE'
      });
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
      .populate('chapters.user', 'name city country')
      .populate('badges.badge', 'name category icon');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts',
        code: 'ACCOUNT_LOCKED',
        lockUntil: user.lockUntil
      });
    }
    
    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      
      await user.save();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
        attemptsRemaining: Math.max(0, 5 - user.loginAttempts)
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastActive = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'awibi-medtech-jwt-secret-2025',
      { expiresIn: '7d' }
    );
    
    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationToken;
    delete userResponse.passwordResetToken;
    delete userResponse.loginAttempts;
    delete userResponse.lockUntil;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationToken;
    delete userResponse.passwordResetToken;
    delete userResponse.loginAttempts;
    delete userResponse.lockUntil;
    
    res.json({
      success: true,
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information',
      code: 'GET_USER_ERROR'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed',
        code: 'LOGOUT_ERROR'
      });
    }
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
});

// Google OAuth routes
app.get('/api/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: req.user._id, 
          email: req.user.email,
          role: req.user.role 
        },
        process.env.JWT_SECRET || 'awibi-medtech-jwt-secret-2025',
        { expiresIn: '7d' }
      );
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&success=true`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }
);

// Users Routes with enhanced functionality
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      role, 
      chapter,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.bio': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Filter by chapter
    if (chapter) {
      query.chapters = chapter;
    }
    
    // Only show active users by default
    query.isActive = true;
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const users = await User.find(query)
      .select('-password -emailVerificationToken -passwordResetToken -loginAttempts -lockUntil')
      .populate('chapters.user', 'name city country')
      .populate('badges.badge', 'name category icon')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      code: 'GET_USERS_ERROR'
    });
  }
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -emailVerificationToken -passwordResetToken -loginAttempts -lockUntil')
      .populate('chapters.user', 'name city country type')
      .populate('badges.badge', 'name category icon description');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      code: 'GET_USER_ERROR'
    });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      profile,
      preferences 
    } = req.body;
    
    // Users can only update their own profile unless they're admin/superadmin
    if (req.user._id.toString() !== req.params.id && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        code: 'ACCESS_DENIED'
      });
    }
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (profile) updateData.profile = { ...updateData.profile, ...profile };
    if (preferences) updateData.preferences = { ...updateData.preferences, ...preferences };
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .select('-password -emailVerificationToken -passwordResetToken -loginAttempts -lockUntil')
      .populate('chapters.user', 'name city country')
      .populate('badges.badge', 'name category icon');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      code: 'UPDATE_USER_ERROR'
    });
  }
});

// Enhanced Chapters Routes
app.get('/api/chapters', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      country, 
      type, 
      status = 'Active',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filters
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const chapters = await Chapter.find(query)
      .populate('leaders.user', 'firstName lastName email avatar')
      .populate('members.user', 'firstName lastName avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);
    
    // Add computed fields
    const chaptersWithStats = chapters.map(chapter => {
      const chapterObj = chapter.toObject();
      chapterObj.memberCount = chapter.members ? chapter.members.length : 0;
      chapterObj.leaderCount = chapter.leaders ? chapter.leaders.length : 0;
      chapterObj.activeMembers = chapter.members ? 
        chapter.members.filter(m => m.status === 'Active').length : 0;
      return chapterObj;
    });
    
    const total = await Chapter.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        chapters: chaptersWithStats,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chapters',
      code: 'GET_CHAPTERS_ERROR'
    });
  }
});

app.get('/api/chapters/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id)
      .populate('leaders.user', 'firstName lastName email avatar role profile.bio')
      .populate('members.user', 'firstName lastName email avatar profile.bio joinedAt')
      .populate('events', 'title date type status attendees location');
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
        code: 'CHAPTER_NOT_FOUND'
      });
    }
    
    // Add computed statistics
    const chapterData = chapter.toObject();
    chapterData.stats = {
      totalMembers: chapter.members ? chapter.members.length : 0,
      activeMembers: chapter.members ? 
        chapter.members.filter(m => m.status === 'Active').length : 0,
      totalEvents: chapter.events ? chapter.events.length : 0,
      upcomingEvents: chapter.events ? 
        chapter.events.filter(e => new Date(e.date) > new Date()).length : 0
    };
    
    res.json({
      success: true,
      data: { chapter: chapterData }
    });
  } catch (error) {
    console.error('Get chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chapter',
      code: 'GET_CHAPTER_ERROR'
    });
  }
});

app.post('/api/chapters/:id/join', authenticateToken, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
        code: 'CHAPTER_NOT_FOUND'
      });
    }
    
    if (chapter.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'Chapter is not accepting new members',
        code: 'CHAPTER_INACTIVE'
      });
    }
    
    // Check if user is already a member
    const existingMember = chapter.members.find(
      member => member.user.toString() === req.user._id.toString()
    );
    
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this chapter',
        code: 'ALREADY_MEMBER'
      });
    }
    
    // Check capacity if set
    if (chapter.settings.maxMembers && 
        chapter.members.length >= chapter.settings.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Chapter has reached maximum capacity',
        code: 'CHAPTER_FULL'
      });
    }
    
    // Add user to chapter
    chapter.members.push({ 
      user: req.user._id,
      joinedAt: new Date(),
      status: chapter.settings.requireApproval ? 'Pending' : 'Active'
    });
    
    // Update stats
    chapter.stats.totalMembers = chapter.members.length;
    await chapter.save();
    
    // Add chapter to user
    req.user.chapters.push(chapter._id);
    await req.user.save();
    
    res.json({
      success: true,
      message: chapter.settings.requireApproval ? 
        'Join request submitted for approval' : 
        'Successfully joined the chapter',
      data: {
        status: chapter.settings.requireApproval ? 'Pending' : 'Active'
      }
    });
  } catch (error) {
    console.error('Join chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join chapter',
      code: 'JOIN_CHAPTER_ERROR'
    });
  }
});

// Enhanced Events Routes
app.get('/api/events', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      type, 
      category,
      status, 
      upcoming,
      chapter,
      organizer,
      sortBy = 'date',
      sortOrder = 'asc'
    } = req.query;
    
    const query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filters
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (chapter) {
      query.chapter = chapter;
    }
    
    if (organizer) {
      query.organizer = organizer;
    }
    
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const events = await Event.find(query)
      .populate('organizer', 'firstName lastName email avatar')
      .populate('chapter', 'name city country')
      .populate('attendees.user', 'firstName lastName avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);
    
    // Add computed fields
    const eventsWithStats = events.map(event => {
      const eventObj = event.toObject();
      eventObj.attendeeCount = event.attendees ? event.attendees.length : 0;
      eventObj.spotsRemaining = event.capacity.maxAttendees ? 
        event.capacity.maxAttendees - eventObj.attendeeCount : null;
      eventObj.isUpcoming = new Date(event.date) > new Date();
      eventObj.isPast = new Date(event.date) < new Date();
      return eventObj;
    });
    
    const total = await Event.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        events: eventsWithStats,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get events',
      code: 'GET_EVENTS_ERROR'
    });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName email avatar profile.bio')
      .populate('coOrganizers', 'firstName lastName email avatar')
      .populate('chapter', 'name city country description')
      .populate('attendees.user', 'firstName lastName email avatar profile.bio');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        code: 'EVENT_NOT_FOUND'
      });
    }
    
    // Add computed statistics
    const eventData = event.toObject();
    eventData.stats = {
      totalAttendees: event.attendees ? event.attendees.length : 0,
      confirmedAttendees: event.attendees ? 
        event.attendees.filter(a => a.status === 'Registered').length : 0,
      actualAttendees: event.attendees ? 
        event.attendees.filter(a => a.status === 'Attended').length : 0,
      spotsRemaining: event.capacity.maxAttendees ? 
        event.capacity.maxAttendees - event.attendees.length : null,
      waitlistCount: event.waitlist ? event.waitlist.length : 0
    };
    
    res.json({
      success: true,
      data: { event: eventData }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get event',
      code: 'GET_EVENT_ERROR'
    });
  }
});

app.post('/api/events/:id/register', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        code: 'EVENT_NOT_FOUND'
      });
    }
    
    // Check if registration is open
    if (!['Published', 'Registration Open'].includes(event.status)) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not open for this event',
        code: 'REGISTRATION_CLOSED'
      });
    }
    
    // Check registration deadline
    if (event.registration.deadline && new Date() > event.registration.deadline) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed',
        code: 'REGISTRATION_DEADLINE_PASSED'
      });
    }
    
    // Check if user is already registered
    const existingAttendee = event.attendees.find(
      attendee => attendee.user.toString() === req.user._id.toString()
    );
    
    if (existingAttendee) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
        code: 'ALREADY_REGISTERED'
      });
    }
    
    // Check capacity
    if (event.capacity.maxAttendees && 
        event.attendees.length >= event.capacity.maxAttendees) {
      
      // Add to waitlist if enabled
      if (event.capacity.waitlistEnabled) {
        const existingWaitlist = event.waitlist.find(
          w => w.user.toString() === req.user._id.toString()
        );
        
        if (existingWaitlist) {
          return res.status(400).json({
            success: false,
            message: 'You are already on the waitlist',
            code: 'ALREADY_WAITLISTED'
          });
        }
        
        event.waitlist.push({ user: req.user._id });
        await event.save();
        
        return res.json({
          success: true,
          message: 'Added to waitlist successfully',
          data: { status: 'Waitlisted' }
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Event is full',
        code: 'EVENT_FULL'
      });
    }
    
    // Register user for event
    event.attendees.push({ 
      user: req.user._id,
      registeredAt: new Date(),
      status: 'Registered'
    });
    
    event.capacity.currentAttendees = event.attendees.length;
    await event.save();
    
    res.json({
      success: true,
      message: 'Successfully registered for the event',
      data: { status: 'Registered' }
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event',
      code: 'REGISTER_EVENT_ERROR'
    });
  }
});

// Enhanced Badges Routes
app.get('/api/badges', async (req, res) => {
  try {
    const { 
      category, 
      rarity, 
      level,
      active = 'true',
      sortBy = 'category',
      sortOrder = 'asc'
    } = req.query;
    
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (rarity) {
      query.rarity = rarity;
    }
    
    if (level) {
      query.level = parseInt(level);
    }
    
    if (active !== 'all') {
      query.isActive = active === 'true';
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const badges = await Badge.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort(sortOptions);
    
    // Group badges by category for better organization
    const badgesByCategory = badges.reduce((acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = [];
      }
      acc[badge.category].push(badge);
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        badges,
        badgesByCategory,
        stats: {
          total: badges.length,
          categories: Object.keys(badgesByCategory).length,
          byRarity: badges.reduce((acc, badge) => {
            acc[badge.rarity] = (acc[badge.rarity] || 0) + 1;
            return acc;
          }, {})
        }
      }
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get badges',
      code: 'GET_BADGES_ERROR'
    });
  }
});

// Enhanced Dashboard endpoint with comprehensive analytics
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    // Base dashboard data for all users
    const dashboardData = {
      user: req.user,
      stats: {},
      recentActivity: [],
      upcomingEvents: [],
      chapters: [],
      badges: []
    };
    
    // Get user's chapters with detailed information
    const userChapters = await Chapter.find({ 
      'members.user': userId 
    })
      .populate('leaders.user', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName')
      .select('name city country type status stats');
    
    dashboardData.chapters = userChapters;
    
    // Get user's upcoming events
    const upcomingEvents = await Event.find({
      'attendees.user': userId,
      date: { $gte: new Date() }
    })
      .populate('chapter', 'name city')
      .populate('organizer', 'firstName lastName')
      .sort({ date: 1 })
      .limit(5);
    
    dashboardData.upcomingEvents = upcomingEvents;
    
    // Get user's badges
    const userBadges = req.user.badges || [];
    dashboardData.badges = userBadges;
    
    // Calculate user stats
    dashboardData.stats = {
      chaptersJoined: userChapters.length,
      eventsRegistered: upcomingEvents.length,
      badgesEarned: userBadges.length,
      totalPoints: userBadges.reduce((sum, badge) => sum + (badge.badge?.points || 0), 0)
    };
    
    // Role-specific dashboard data
    if (['leader', 'admin', 'superadmin'].includes(userRole)) {
      // Get chapters where user is a leader
      const ledChapters = await Chapter.find({ 
        'leaders.user': userId 
      })
        .populate('members.user', 'firstName lastName email avatar')
        .populate('events', 'title date status attendees');
      
      dashboardData.ledChapters = ledChapters;
      
      // Get events organized by user
      const organizedEvents = await Event.find({ 
        organizer: userId 
      })
        .populate('chapter', 'name')
        .populate('attendees.user', 'firstName lastName')
        .sort({ date: -1 })
        .limit(10);
      
      dashboardData.organizedEvents = organizedEvents;
      
      // Leadership stats
      dashboardData.leadershipStats = {
        chaptersLed: ledChapters.length,
        totalMembersLed: ledChapters.reduce((sum, chapter) => sum + chapter.members.length, 0),
        eventsOrganized: organizedEvents.length,
        totalEventAttendees: organizedEvents.reduce((sum, event) => sum + event.attendees.length, 0)
      };
    }
    
    // Admin/Superadmin specific data
    if (['admin', 'superadmin'].includes(userRole)) {
      // Platform-wide statistics
      const [totalUsers, totalChapters, totalEvents, totalBadges] = await Promise.all([
        User.countDocuments({ isActive: true }),
        Chapter.countDocuments({ status: 'Active' }),
        Event.countDocuments(),
        Badge.countDocuments({ isActive: true })
      ]);
      
      // Recent activity across platform
      const recentUsers = await User.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email createdAt');
      
      const recentChapters = await Chapter.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name city country createdAt');
      
      dashboardData.platformStats = {
        totalUsers,
        totalChapters,
        totalEvents,
        totalBadges,
        recentUsers,
        recentChapters
      };
      
      // Growth metrics (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const [newUsers, newChapters, newEvents] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        Chapter.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        Event.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
      ]);
      
      dashboardData.growthMetrics = {
        newUsers,
        newChapters,
        newEvents,
        period: '30 days'
      };
    }
    
    // Recent activity simulation (in a real app, this would come from an activity log)
    dashboardData.recentActivity = [
      {
        type: 'welcome',
        message: `Welcome to AWIBI MEDTECH, ${req.user.firstName}!`,
        date: req.user.createdAt,
        icon: 'welcome'
      }
    ];
    
    // Add chapter join activities
    userChapters.forEach(chapter => {
      dashboardData.recentActivity.push({
        type: 'chapter_joined',
        message: `Joined ${chapter.name} chapter`,
        date: chapter.createdAt,
        icon: 'chapter',
        link: `/chapters/${chapter._id}`
      });
    });
    
    // Sort recent activity by date
    dashboardData.recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
    dashboardData.recentActivity = dashboardData.recentActivity.slice(0, 10);
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard',
      code: 'DASHBOARD_ERROR'
    });
  }
});

// Admin routes for user management
app.put('/api/admin/users/:id/role', authenticateToken, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['member', 'leader', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
        code: 'INVALID_ROLE'
      });
    }
    
    // Only superadmin can assign admin role
    if (role === 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only superadmin can assign admin role',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password -emailVerificationToken -passwordResetToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: { user }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      code: 'UPDATE_ROLE_ERROR'
    });
  }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    code: 'ENDPOINT_NOT_FOUND',
    availableEndpoints: {
      auth: '/api/auth/*',
      users: '/api/users/*',
      chapters: '/api/chapters/*',
      events: '/api/events/*',
      badges: '/api/badges/*',
      dashboard: '/api/dashboard'
    }
  });
});

// Global 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND',
    suggestion: 'Check the API documentation at /'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Global Error:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
      details: Object.values(error.errors).map(e => e.message)
    });
  }
  
  // Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      code: 'INVALID_ID'
    });
  }
  
  // MongoDB duplicate key error
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      code: 'DUPLICATE_ENTRY'
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }
  
  // Default error response
  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 
      'Internal server error' : error.message,
    code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB connection closed');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ===================================');
  console.log('🚀 AWIBI MEDTECH API v3.0 STARTED');
  console.log('🚀 ===================================');
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server: http://0.0.0.0:${PORT}`);
  console.log(`🔗 Health Check: http://0.0.0.0:${PORT}/health`);
  console.log(`📚 API Docs: http://0.0.0.0:${PORT}/`);
  console.log(`🌍 CORS: Enhanced for Vercel/Render deployment`);
  console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '⚠️  Using default'}`);
  console.log(`🔑 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '⚠️  Using demo'}`);
  console.log(`🛡️  Security: Helmet + Rate Limiting enabled`);
  console.log(`📊 Compression: Enabled`);
  console.log('🚀 ===================================');
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  switch (error.code) {
    case 'EACCES':
      console.error(`❌ Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`❌ Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

module.exports = app;

