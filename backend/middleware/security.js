const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const validator = require('validator');
const crypto = require('crypto');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
  });
};

// General rate limiting
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

// Strict rate limiting for authentication endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later.',
  true // skip successful requests
);

// Password reset rate limiting
const passwordResetLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // limit each IP to 3 password reset requests per hour
  'Too many password reset attempts, please try again later.'
);

// Email verification rate limiting
const emailVerificationLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  5, // limit each IP to 5 email verification requests per hour
  'Too many email verification attempts, please try again later.'
);

// API rate limiting for authenticated users
const apiLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  1000, // limit each IP to 1000 API requests per windowMs
  'API rate limit exceeded, please try again later.'
);

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.awibi-medtech.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for development
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Input validation middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.body = value;
    next();
  };
};

// Email validation middleware
const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  // Normalize email
  if (email) {
    req.body.email = validator.normalizeEmail(email);
  }

  next();
};

// Password strength validation
const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next();
  }

  const minLength = parseInt(process.env.PASSWORD_MIN_LENGTH) || 8;
  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Password does not meet security requirements',
      errors,
    });
  }

  next();
};

// File upload security
const validateFileUpload = (allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }

    const files = req.files || [req.file];

    for (const file of files) {
      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File size exceeds limit of ${maxSize / (1024 * 1024)}MB`,
        });
      }

      // Check file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `File type ${file.mimetype} is not allowed`,
          allowedTypes,
        });
      }

      // Validate file name
      if (!/^[a-zA-Z0-9._-]+$/.test(file.originalname)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file name. Only alphanumeric characters, dots, hyphens, and underscores are allowed',
        });
      }
    }

    next();
  };
};

// CSRF protection for state-changing operations
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for API requests with valid JWT
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token',
    });
  }

  next();
};

// Generate CSRF token
const generateCSRFToken = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  next();
};

// IP whitelist middleware (for admin endpoints)
const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    if (allowedIPs.length === 0) {
      return next();
    }

    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!allowedIPs.includes(clientIP)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied from this IP address',
      });
    }

    next();
  };
};

// Request logging for security monitoring
const securityLogger = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    sessionId: req.sessionID,
  };

  // Log suspicious activities
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /javascript:/i,  // JavaScript injection
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(req.originalUrl) || 
    pattern.test(JSON.stringify(req.body))
  );

  if (isSuspicious) {
    console.warn('🚨 Suspicious request detected:', logData);
  }

  // Log failed authentication attempts
  res.on('finish', () => {
    if (req.originalUrl.includes('/auth/') && res.statusCode === 401) {
      console.warn('🔐 Failed authentication attempt:', logData);
    }
  });

  next();
};

// Account lockout protection
const accountLockout = async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next();
  }

  try {
    const User = require('../models/User');
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return next();
    }

    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
    const lockTime = parseInt(process.env.ACCOUNT_LOCK_TIME) || 15 * 60 * 1000; // 15 minutes

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        success: false,
        message: `Account is locked. Try again in ${remainingTime} minutes.`,
        lockUntil: user.lockUntil,
      });
    }

    // Reset attempts if lock time has expired
    if (user.lockUntil && user.lockUntil <= Date.now()) {
      await User.findByIdAndUpdate(user._id, {
        $unset: { loginAttempts: 1, lockUntil: 1 }
      });
    }

    req.userForLockout = user;
    next();
  } catch (error) {
    console.error('Account lockout check error:', error);
    next();
  }
};

// Update login attempts after failed authentication
const updateLoginAttempts = async (req, res, next) => {
  const originalSend = res.send;

  res.send = function(data) {
    // Check if this was a failed login attempt
    if (res.statusCode === 401 && req.userForLockout) {
      updateFailedAttempts(req.userForLockout);
    }

    originalSend.call(this, data);
  };

  next();
};

const updateFailedAttempts = async (user) => {
  try {
    const User = require('../models/User');
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
    const lockTime = parseInt(process.env.ACCOUNT_LOCK_TIME) || 15 * 60 * 1000;

    const attempts = (user.loginAttempts || 0) + 1;

    if (attempts >= maxAttempts) {
      await User.findByIdAndUpdate(user._id, {
        loginAttempts: attempts,
        lockUntil: Date.now() + lockTime,
      });
    } else {
      await User.findByIdAndUpdate(user._id, {
        loginAttempts: attempts,
      });
    }
  } catch (error) {
    console.error('Update login attempts error:', error);
  }
};

// Clear login attempts on successful authentication
const clearLoginAttempts = async (userId) => {
  try {
    const User = require('../models/User');
    await User.findByIdAndUpdate(userId, {
      $unset: { loginAttempts: 1, lockUntil: 1 }
    });
  } catch (error) {
    console.error('Clear login attempts error:', error);
  }
};

module.exports = {
  // Rate limiters
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
  apiLimiter,
  
  // Security middleware
  securityHeaders,
  mongoSanitize: mongoSanitize(),
  xssClean: xss(),
  hpp: hpp(),
  
  // Validation middleware
  validateInput,
  validateEmail,
  validatePassword,
  validateFileUpload,
  
  // CSRF protection
  csrfProtection,
  generateCSRFToken,
  
  // Access control
  ipWhitelist,
  
  // Security monitoring
  securityLogger,
  accountLockout,
  updateLoginAttempts,
  clearLoginAttempts,
};

