const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No user found with this token',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user owns resource or is admin
exports.ownerOrAdmin = (resourceUserField = 'user') => {
  return (req, res, next) => {
    // Allow if user is admin or super admin
    if (['Admin', 'Super Admin'].includes(req.user.role)) {
      return next();
    }

    // Check if user owns the resource
    if (req.resource && req.resource[resourceUserField]) {
      if (req.resource[resourceUserField].toString() === req.user.id) {
        return next();
      }
    }

    // Check if user ID in params matches current user
    if (req.params.userId && req.params.userId === req.user.id) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  };
};

// Check if user is chapter leader or admin
exports.chapterLeaderOrAdmin = async (req, res, next) => {
  try {
    // Allow if user is admin or super admin
    if (['Admin', 'Super Admin'].includes(req.user.role)) {
      return next();
    }

    // Check if user is a leader of any chapter
    if (req.user.role === 'Leader' || req.user.role === 'Ambassador') {
      return next();
    }

    // Check if user is leader of specific chapter
    if (req.params.chapterId) {
      const Chapter = require('../models/Chapter');
      const chapter = await Chapter.findById(req.params.chapterId);
      
      if (chapter && chapter.leaders.some(leader => 
        leader.user.toString() === req.user.id
      )) {
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized - chapter leadership required',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in authorization',
    });
  }
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      console.log('Invalid token in optional auth:', error.message);
    }
  }

  next();
};

// Rate limiting for sensitive operations
exports.rateLimitSensitive = (req, res, next) => {
  // This would typically use Redis or similar for production
  // For now, we'll just add a simple in-memory rate limiting
  
  const key = `${req.ip}-${req.route.path}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (!req.app.locals.rateLimitStore) {
    req.app.locals.rateLimitStore = new Map();
  }

  const store = req.app.locals.rateLimitStore;
  const userAttempts = store.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > userAttempts.resetTime) {
    userAttempts.count = 0;
    userAttempts.resetTime = now + windowMs;
  }

  if (userAttempts.count >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many attempts, please try again later',
      retryAfter: Math.ceil((userAttempts.resetTime - now) / 1000),
    });
  }

  userAttempts.count++;
  store.set(key, userAttempts);

  next();
};

// Middleware to check email verification
exports.requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED',
    });
  }
  next();
};

// Middleware to check if user has completed profile
exports.requireCompleteProfile = (req, res, next) => {
  const requiredFields = ['firstName', 'lastName', 'country', 'city'];
  const missingFields = requiredFields.filter(field => !req.user[field]);

  if (missingFields.length > 0) {
    return res.status(403).json({
      success: false,
      message: 'Complete profile required',
      code: 'INCOMPLETE_PROFILE',
      missingFields,
    });
  }
  next();
};

