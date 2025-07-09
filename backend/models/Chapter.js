const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Chapter name is required'],
    trim: true,
    maxlength: [100, 'Chapter name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Chapter description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
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
  region: {
    type: String,
    default: '',
  },
  
  // Chapter Details
  type: {
    type: String,
    enum: ['University', 'Regional', 'Professional', 'Community'],
    required: [true, 'Chapter type is required'],
  },
  
  // University-specific fields
  university: {
    type: String,
    default: '',
  },
  faculty: {
    type: String,
    default: '',
  },
  
  // Leadership
  leaders: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['Chapter Lead', 'Co-Lead', 'Organizer', 'Coordinator'],
      default: 'Chapter Lead',
    },
    appointedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Contact Information
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  website: {
    type: String,
    default: '',
  },
  
  // Social Media
  socialMedia: {
    linkedin: {
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
    instagram: {
      type: String,
      default: '',
    },
    whatsapp: {
      type: String,
      default: '',
    },
  },
  
  // Chapter Image/Logo
  logo: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  
  // Status and Activity
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending', 'Suspended'],
    default: 'Pending',
  },
  
  // Membership Statistics
  stats: {
    totalMembers: {
      type: Number,
      default: 0,
    },
    activeMembers: {
      type: Number,
      default: 0,
    },
    newMembersThisMonth: {
      type: Number,
      default: 0,
    },
    eventsHosted: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },
  },
  
  // Chapter Goals and Focus Areas
  focusAreas: [{
    type: String,
    enum: [
      'AI in Healthcare',
      'Telemedicine',
      'Health Informatics',
      'Medical Device Innovation',
      'Digital Health',
      'Healthcare Policy',
      'Research & Development',
      'Community Outreach',
      'Education & Training',
      'Entrepreneurship',
    ],
  }],
  
  // Meeting Information
  meetingSchedule: {
    frequency: {
      type: String,
      enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'As needed'],
      default: 'Monthly',
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    time: {
      type: String, // Format: "HH:MM"
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    location: {
      type: String,
      default: 'Virtual',
    },
  },
  
  // Establishment Information
  establishedDate: {
    type: Date,
    default: Date.now,
  },
  
  // Approval Information
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: {
    type: Date,
  },
  
  // Application Information
  applicationNotes: {
    type: String,
    maxlength: [500, 'Application notes cannot exceed 500 characters'],
  },
  
  // Chapter Metrics
  metrics: {
    membershipGrowthRate: {
      type: Number,
      default: 0,
    },
    eventAttendanceRate: {
      type: Number,
      default: 0,
    },
    engagementScore: {
      type: Number,
      default: 0,
    },
  },
  
  // Tags for better searchability
  tags: [{
    type: String,
    trim: true,
  }],
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for chapter display name
chapterSchema.virtual('displayName').get(function() {
  if (this.type === 'University' && this.university) {
    return `AMT ${this.university}`;
  }
  return `AMT ${this.city}`;
});

// Virtual for leader count
chapterSchema.virtual('leaderCount').get(function() {
  return this.leaders.length;
});

// Virtual for full location
chapterSchema.virtual('fullLocation').get(function() {
  return `${this.city}, ${this.country}`;
});

// Indexes for better performance
chapterSchema.index({ country: 1, city: 1 });
chapterSchema.index({ status: 1 });
chapterSchema.index({ type: 1 });
chapterSchema.index({ university: 1 });
chapterSchema.index({ 'stats.totalMembers': -1 });

// Pre-save middleware to update stats
chapterSchema.pre('save', async function(next) {
  if (this.isModified('leaders')) {
    // Update last activity date when leaders change
    this.stats.lastActivityDate = new Date();
  }
  next();
});

// Static method to find chapters by country
chapterSchema.statics.findByCountry = function(country) {
  return this.find({ country, status: 'Active' });
};

// Static method to find university chapters
chapterSchema.statics.findUniversityChapters = function() {
  return this.find({ type: 'University', status: 'Active' });
};

// Static method to find chapters needing approval
chapterSchema.statics.findPendingApproval = function() {
  return this.find({ status: 'Pending' });
};

// Instance method to add leader
chapterSchema.methods.addLeader = function(userId, role = 'Chapter Lead') {
  const existingLeader = this.leaders.find(leader => 
    leader.user.toString() === userId.toString()
  );
  
  if (!existingLeader) {
    this.leaders.push({
      user: userId,
      role: role,
      appointedAt: new Date(),
    });
  }
  
  return this.save();
};

// Instance method to remove leader
chapterSchema.methods.removeLeader = function(userId) {
  this.leaders = this.leaders.filter(leader => 
    leader.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Instance method to update member count
chapterSchema.methods.updateMemberCount = async function() {
  const User = mongoose.model('User');
  const memberCount = await User.countDocuments({ 
    chapter: this._id, 
    isActive: true 
  });
  
  this.stats.totalMembers = memberCount;
  return this.save();
};

module.exports = mongoose.model('Chapter', chapterSchema);

