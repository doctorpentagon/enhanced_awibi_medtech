const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    default: '',
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  
  // Location Information
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  
  // Professional Information
  profession: {
    type: String,
    maxlength: [100, 'Profession cannot exceed 100 characters'],
  },
  institution: {
    type: String,
    maxlength: [100, 'Institution cannot exceed 100 characters'],
  },
  specialization: {
    type: String,
    maxlength: [100, 'Specialization cannot exceed 100 characters'],
  },
  skills: [{
    type: String,
    trim: true,
  }],
  
  // Social Links
  linkedIn: {
    type: String,
    default: '',
  },
  twitter: {
    type: String,
    default: '',
  },
  facebook: {
    type: String,
    default: '',
  },
  
  // Role and Permissions - Enhanced for dashboard functionality
  role: {
    type: String,
    enum: ['Member', 'Coordinator', 'Leader', 'Ambassador', 'Admin', 'Superadmin'],
    default: 'Member',
  },
  
  // Chapter Association - Enhanced for multiple chapters
  chapters: [{
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
    role: {
      type: String,
      enum: ['Member', 'Coordinator', 'Leader'],
      default: 'Member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Primary chapter (for leaders)
  primaryChapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  },
  
  // Badges and Achievements - Enhanced with categories
  badges: [{
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
    },
    category: {
      type: String,
      enum: [
        'Ambassador', 'Member', 'Team', 'Talents', 'Top Contributor',
        'Hackathon', 'Code of health', 'Partner', 'Fellow', 'Researcher',
        'Medtech Professional', 'Winner', 'Hall of Fame', 'Leader'
      ],
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    awardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  
  // Leadership Information (for Leaders and above)
  leadershipInfo: {
    isLeader: {
      type: Boolean,
      default: false,
    },
    leadershipStartDate: {
      type: Date,
    },
    leadershipType: {
      type: String,
      enum: ['Regional', 'University', 'Corporate', 'Community'],
    },
    managedChapters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    }],
    canCreateEvents: {
      type: Boolean,
      default: false,
    },
    canManageMembers: {
      type: Boolean,
      default: false,
    },
    canSendBulkEmails: {
      type: Boolean,
      default: false,
    },
    canAwardBadges: {
      type: Boolean,
      default: false,
    },
  },
  
  // Activity Tracking
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  
  // Authentication
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  googleId: {
    type: String,
    sparse: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
  
  // Password Reset
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Role Application (for becoming a leader)
  roleApplication: {
    appliedFor: {
      type: String,
      enum: ['Leader', 'Ambassador', 'Admin'],
    },
    applicationDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  
  // Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    desktopNotifications: {
      type: Boolean,
      default: true,
    },
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: 'English',
    },
  },
  
  // Statistics - Enhanced for dashboard
  stats: {
    eventsAttended: {
      type: Number,
      default: 0,
    },
    eventsCreated: {
      type: Number,
      default: 0,
    },
    badgesEarned: {
      type: Number,
      default: 0,
    },
    contributionScore: {
      type: Number,
      default: 0,
    },
    membersManaged: {
      type: Number,
      default: 0,
    },
    chaptersLed: {
      type: Number,
      default: 0,
    },
  },
  
  // Notifications
  notifications: [{
    type: {
      type: String,
      enum: ['Leadership Role Request', 'Badge Awarded', 'Event Invitation', 'Chapter Update', 'System'],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for badge count
userSchema.virtual('badgeCount').get(function() {
  return this.badges.length;
});

// Virtual for chapter count
userSchema.virtual('chapterCount').get(function() {
  return this.chapters.length;
});

// Virtual for unread notifications count
userSchema.virtual('unreadNotificationsCount').get(function() {
  return this.notifications.filter(notification => !notification.isRead).length;
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'chapters.chapter': 1 });
userSchema.index({ role: 1 });
userSchema.index({ country: 1, city: 1 });
userSchema.index({ 'leadershipInfo.isLeader': 1 });
userSchema.index({ googleId: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and exists
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update statistics
userSchema.pre('save', function(next) {
  this.stats.badgesEarned = this.badges.length;
  this.stats.chaptersLed = this.leadershipInfo.managedChapters.length;
  
  // Update leadership info based on role
  if (['Leader', 'Ambassador', 'Admin', 'Superadmin'].includes(this.role)) {
    this.leadershipInfo.isLeader = true;
    if (!this.leadershipInfo.leadershipStartDate) {
      this.leadershipInfo.leadershipStartDate = new Date();
    }
    
    // Set permissions based on role
    if (this.role === 'Leader' || this.role === 'Ambassador') {
      this.leadershipInfo.canCreateEvents = true;
      this.leadershipInfo.canManageMembers = true;
      this.leadershipInfo.canSendBulkEmails = true;
      this.leadershipInfo.canAwardBadges = true;
    }
  } else {
    this.leadershipInfo.isLeader = false;
  }
  
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if user has permission
userSchema.methods.hasPermission = function(permission) {
  const rolePermissions = {
    'Member': [],
    'Coordinator': ['view_chapter_members'],
    'Leader': ['view_chapter_members', 'manage_chapter_members', 'create_events', 'send_bulk_emails', 'award_badges'],
    'Ambassador': ['view_chapter_members', 'manage_chapter_members', 'create_events', 'send_bulk_emails', 'award_badges'],
    'Admin': ['view_all_members', 'manage_all_members', 'create_events', 'send_bulk_emails', 'award_badges', 'manage_chapters'],
    'Superadmin': ['*'], // All permissions
  };
  
  const userPermissions = rolePermissions[this.role] || [];
  return userPermissions.includes('*') || userPermissions.includes(permission);
};

// Instance method to add notification
userSchema.methods.addNotification = function(type, title, message, relatedId = null) {
  this.notifications.unshift({
    type,
    title,
    message,
    relatedId,
    createdAt: new Date(),
  });
  
  // Keep only last 50 notifications
  if (this.notifications.length > 50) {
    this.notifications = this.notifications.slice(0, 50);
  }
  
  return this.save();
};

// Instance method to generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  
  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Instance method to generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = require('crypto').randomBytes(32).toString('hex');
  
  this.emailVerificationToken = require('crypto')
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Static method to find users by chapter
userSchema.statics.findByChapter = function(chapterId) {
  return this.find({ 
    'chapters.chapter': chapterId, 
    isActive: true 
  }).populate('chapters.chapter');
};

// Static method to find leaders
userSchema.statics.findLeaders = function() {
  return this.find({ 
    role: { $in: ['Leader', 'Ambassador', 'Admin', 'Superadmin'] },
    isActive: true 
  }).populate('primaryChapter');
};

// Static method to find members by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Static method to get dashboard statistics
userSchema.statics.getDashboardStats = async function() {
  const totalMembers = await this.countDocuments({ isActive: true });
  const totalLeaders = await this.countDocuments({ 
    role: { $in: ['Leader', 'Ambassador', 'Admin', 'Superadmin'] },
    isActive: true 
  });
  const newMembersThisMonth = await this.countDocuments({
    isActive: true,
    createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
  });
  const pendingRoleApplications = await this.countDocuments({
    'roleApplication.status': 'Pending'
  });
  
  return {
    totalMembers,
    totalLeaders,
    newMembersThisMonth,
    pendingRoleApplications,
  };
};

module.exports = mongoose.model('User', userSchema);

