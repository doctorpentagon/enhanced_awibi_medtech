const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/User');
const auth = require('../middleware/auth');
const security = require('../middleware/security');
const { requirePermission } = require('../middleware/rbac');

// Apply security middleware
router.use(security.securityLogger);
router.use(security.mongoSanitize);
router.use(security.xssClean);

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', 
  security.authLimiter,
  security.validateEmail,
  security.validatePassword,
  async (req, res) => {
    try {
      const { firstName, lastName, email, password, country, city, chapter } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Create user
      const user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        country,
        city,
        emailVerificationToken,
        emailVerificationExpire,
        authProvider: 'local',
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Set secure cookie
      const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      };

      res.cookie('token', token, cookieOptions);

      // Remove password from response
      user.password = undefined;
      user.emailVerificationToken = undefined;

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify your email.',
        data: {
          user,
          token,
          requiresEmailVerification: true,
        },
      });

      // TODO: Send verification email
      console.log(`📧 Email verification token for ${email}: ${emailVerificationToken}`);

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login',
  security.authLimiter,
  security.accountLockout,
  security.updateLoginAttempts,
  security.validateEmail,
  async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password',
        });
      }

      // Find user and include password for comparison
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check if user has a password (not OAuth-only)
      if (!user.password) {
        return res.status(401).json({
          success: false,
          message: 'Please sign in with Google',
          authProvider: 'google',
        });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact support.',
        });
      }

      // Clear any previous login attempts
      await security.clearLoginAttempts(user._id);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const tokenExpiry = rememberMe ? '30d' : '7d';
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: tokenExpiry }
      );

      // Set secure cookie
      const cookieExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
      const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiry),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      };

      res.cookie('token', token, cookieOptions);

      // Remove sensitive data from response
      user.password = undefined;
      user.emailVerificationToken = undefined;
      user.passwordResetToken = undefined;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token,
          requiresEmailVerification: !user.isEmailVerified,
        },
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  }
);

// @route   GET /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Set secure cookie
      const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      };

      res.cookie('token', token, cookieOptions);

      // Redirect to frontend with success
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?success=true&token=${token}`);

    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?error=oauth_failed`);
    }
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth.protect, async (req, res) => {
  try {
    // Clear cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth.protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('chapters.chapter', 'name city country')
      .populate('badges.badge', 'name icon rarity');

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email',
  security.emailVerificationLimiter,
  async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required',
        });
      }

      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token',
        });
      }

      // Mark email as verified
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Email verified successfully',
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed',
      });
    }
  }
);

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Private
router.post('/resend-verification',
  auth.protect,
  security.emailVerificationLimiter,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified',
        });
      }

      // Generate new verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      user.emailVerificationToken = emailVerificationToken;
      user.emailVerificationExpire = emailVerificationExpire;
      await user.save();

      res.json({
        success: true,
        message: 'Verification email sent',
      });

      // TODO: Send verification email
      console.log(`📧 New email verification token for ${user.email}: ${emailVerificationToken}`);

    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resend verification email',
      });
    }
  }
);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password',
  security.passwordResetLimiter,
  security.validateEmail,
  async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        // Don't reveal if user exists or not
        return res.json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.',
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

      user.passwordResetToken = passwordResetToken;
      user.passwordResetExpire = passwordResetExpire;
      await user.save();

      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });

      // TODO: Send password reset email
      console.log(`🔑 Password reset token for ${email}: ${resetToken}`);

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request',
      });
    }
  }
);

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password',
  security.authLimiter,
  security.validatePassword,
  async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: 'Token and password are required',
        });
      }

      // Hash the token to compare with stored hash
      const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        passwordResetToken,
        passwordResetExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token',
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
      user.password = await bcrypt.hash(password, salt);
      user.passwordResetToken = undefined;
      user.passwordResetExpire = undefined;
      user.passwordChangedAt = new Date();

      // Clear any login attempts
      user.loginAttempts = undefined;
      user.lockUntil = undefined;

      await user.save();

      res.json({
        success: true,
        message: 'Password reset successfully',
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset failed',
      });
    }
  }
);

// @route   POST /api/auth/change-password
// @desc    Change password (authenticated user)
// @access  Private
router.post('/change-password',
  auth.protect,
  security.authLimiter,
  security.validatePassword,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required',
        });
      }

      const user = await User.findById(req.user.id).select('+password');

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
      user.password = await bcrypt.hash(newPassword, salt);
      user.passwordChangedAt = new Date();

      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully',
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Password change failed',
      });
    }
  }
);

// @route   POST /api/auth/test-login
// @desc    Test login endpoint for development
// @access  Public (Development only)
router.post('/test-login', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({
      success: false,
      message: 'Endpoint not available in production',
    });
  }

  try {
    // Create or find test user
    let testUser = await User.findOne({ email: 'test@awibi-medtech.com' });

    if (!testUser) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('testpassword123', salt);

      testUser = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@awibi-medtech.com',
        password: hashedPassword,
        country: 'Nigeria',
        city: 'Lagos',
        isEmailVerified: true,
        role: 'Member',
        authProvider: 'local',
      });

      await testUser.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove sensitive data
    testUser.password = undefined;

    res.json({
      success: true,
      message: 'Test login successful',
      data: {
        user: testUser,
        token,
      },
    });

  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({
      success: false,
      message: 'Test login failed',
    });
  }
});

// @route   GET /api/auth/csrf-token
// @desc    Get CSRF token
// @access  Public
router.get('/csrf-token',
  security.generateCSRFToken,
  (req, res) => {
    res.json({
      success: true,
      csrfToken: req.session.csrfToken,
    });
  }
);

module.exports = router;

