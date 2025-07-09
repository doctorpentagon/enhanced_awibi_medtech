const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Badge name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Badge name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Badge description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  
  // Badge Category
  category: {
    type: String,
    enum: [
      'Ambassadors',
      'Members',
      'Team',
      'Leaders',
      'Top Contributors',
      'Partner',
      'Fellow',
      'Researcher',
      'Medtech Professional',
      'Winner',
      'Hackathon',
      'Code of Health',
      'Talents',
      'Hall of Fame',
    ],
    required: [true, 'Badge category is required'],
  },
  
  // Badge Type
  type: {
    type: String,
    enum: ['Achievement', 'Participation', 'Leadership', 'Contribution', 'Special', 'Time-based'],
    required: [true, 'Badge type is required'],
  },
  
  // Badge Level/Tier
  level: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    default: 'Bronze',
  },
  
  // Visual Elements
  icon: {
    type: String,
    required: [true, 'Badge icon is required'],
  },
  color: {
    type: String,
    default: '#3B82F6', // Blue color
  },
  backgroundColor: {
    type: String,
    default: '#EFF6FF', // Light blue background
  },
  
  // Badge Criteria
  criteria: {
    description: {
      type: String,
      required: [true, 'Badge criteria description is required'],
      maxlength: [1000, 'Criteria description cannot exceed 1000 characters'],
    },
    requirements: [{
      type: {
        type: String,
        enum: [
          'Event Attendance',
          'Event Organization',
          'Community Contribution',
          'Time-based Membership',
          'Leadership Role',
          'Project Completion',
          'Skill Assessment',
          'Peer Recognition',
          'Research Publication',
          'Mentorship',
          'Hackathon Participation',
          'Course Completion',
          'Certification',
          'Special Achievement',
        ],
        required: true,
      },
      value: {
        type: mongoose.Schema.Types.Mixed, // Can be number, string, or object
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    }],
  },
  
  // Badge Status
  isActive: {
    type: Boolean,
    default: true,
  },
  isAutoAwarded: {
    type: Boolean,
    default: false,
  },
  
  // Badge Statistics
  stats: {
    totalAwarded: {
      type: Number,
      default: 0,
    },
    awardedThisMonth: {
      type: Number,
      default: 0,
    },
    lastAwarded: {
      type: Date,
    },
  },
  
  // Badge Points/Value
  points: {
    type: Number,
    default: 10,
    min: [1, 'Points must be at least 1'],
    max: [1000, 'Points cannot exceed 1000'],
  },
  
  // Rarity
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    default: 'Common',
  },
  
  // Prerequisites
  prerequisites: [{
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
    },
    description: {
      type: String,
    },
  }],
  
  // Validity Period
  validityPeriod: {
    hasExpiry: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number, // in days
      default: 365,
    },
    renewalRequired: {
      type: Boolean,
      default: false,
    },
  },
  
  // Badge Metadata
  metadata: {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    version: {
      type: String,
      default: '1.0',
    },
  },
  
  // Display Settings
  displaySettings: {
    showOnProfile: {
      type: Boolean,
      default: true,
    },
    showInLeaderboard: {
      type: Boolean,
      default: true,
    },
    order: {
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

// Virtual for badge rarity score
badgeSchema.virtual('rarityScore').get(function() {
  const rarityScores = {
    'Common': 1,
    'Uncommon': 2,
    'Rare': 3,
    'Epic': 4,
    'Legendary': 5,
  };
  return rarityScores[this.rarity] || 1;
});

// Virtual for badge difficulty
badgeSchema.virtual('difficulty').get(function() {
  const levelScores = {
    'Bronze': 1,
    'Silver': 2,
    'Gold': 3,
    'Platinum': 4,
    'Diamond': 5,
  };
  return levelScores[this.level] || 1;
});

// Indexes for better performance
badgeSchema.index({ category: 1 });
badgeSchema.index({ type: 1 });
badgeSchema.index({ level: 1 });
badgeSchema.index({ rarity: 1 });
badgeSchema.index({ isActive: 1 });
badgeSchema.index({ 'stats.totalAwarded': -1 });

// Pre-save middleware to update display order
badgeSchema.pre('save', function(next) {
  if (this.isNew && this.displaySettings.order === 0) {
    // Set order based on rarity and level
    this.displaySettings.order = (this.rarityScore * 10) + this.difficulty;
  }
  next();
});

// Static method to find badges by category
badgeSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true })
    .sort({ 'displaySettings.order': 1 });
};

// Static method to find badges by type
badgeSchema.statics.findByType = function(type) {
  return this.find({ type, isActive: true })
    .sort({ 'displaySettings.order': 1 });
};

// Static method to find auto-awarded badges
badgeSchema.statics.findAutoAwarded = function() {
  return this.find({ isAutoAwarded: true, isActive: true });
};

// Static method to find badges by rarity
badgeSchema.statics.findByRarity = function(rarity) {
  return this.find({ rarity, isActive: true })
    .sort({ 'displaySettings.order': 1 });
};

// Instance method to check if user meets criteria
badgeSchema.methods.checkUserEligibility = async function(userId) {
  const User = mongoose.model('User');
  const Event = mongoose.model('Event');
  
  const user = await User.findById(userId);
  if (!user) return false;
  
  // Check if user already has this badge
  const hasBadge = user.badges.some(badge => 
    badge.badge.toString() === this._id.toString()
  );
  if (hasBadge) return false;
  
  // Check prerequisites
  for (const prereq of this.prerequisites) {
    const hasPrereq = user.badges.some(badge => 
      badge.badge.toString() === prereq.badge.toString()
    );
    if (!hasPrereq) return false;
  }
  
  // Check each requirement
  for (const requirement of this.criteria.requirements) {
    const isEligible = await this.checkRequirement(requirement, user);
    if (!isEligible) return false;
  }
  
  return true;
};

// Instance method to check individual requirement
badgeSchema.methods.checkRequirement = async function(requirement, user) {
  const Event = mongoose.model('Event');
  
  switch (requirement.type) {
    case 'Event Attendance':
      const attendedEvents = await Event.countDocuments({
        'attendees.user': user._id,
        'attendees.attended': true,
      });
      return attendedEvents >= requirement.value;
      
    case 'Time-based Membership':
      const membershipDays = Math.floor((Date.now() - user.joinedAt) / (1000 * 60 * 60 * 24));
      return membershipDays >= requirement.value;
      
    case 'Leadership Role':
      return ['Leader', 'Ambassador', 'Admin', 'Super Admin'].includes(user.role);
      
    case 'Community Contribution':
      return user.stats.contributionScore >= requirement.value;
      
    case 'Event Organization':
      const organizedEvents = await Event.countDocuments({
        'organizers.user': user._id,
      });
      return organizedEvents >= requirement.value;
      
    default:
      return false;
  }
};

// Instance method to award badge to user
badgeSchema.methods.awardToUser = async function(userId) {
  const User = mongoose.model('User');
  
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  // Check if user already has this badge
  const hasBadge = user.badges.some(badge => 
    badge.badge.toString() === this._id.toString()
  );
  
  if (hasBadge) {
    throw new Error('User already has this badge');
  }
  
  // Add badge to user
  user.badges.push({
    badge: this._id,
    earnedAt: new Date(),
  });
  
  // Update user stats
  user.stats.badgesEarned = user.badges.length;
  user.stats.contributionScore += this.points;
  
  await user.save();
  
  // Update badge stats
  this.stats.totalAwarded += 1;
  this.stats.awardedThisMonth += 1;
  this.stats.lastAwarded = new Date();
  
  await this.save();
  
  return user;
};

module.exports = mongoose.model('Badge', badgeSchema);

