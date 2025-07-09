const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['user_growth', 'event_attendance', 'chapter_activity', 'badge_distribution', 'engagement']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  region: {
    type: String,
    enum: ['West Africa', 'East Africa', 'Southern Africa', 'North Africa', 'International', 'Global']
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    source: String,
    version: String,
    processed: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
analyticsSchema.index({ type: 1, date: -1 });
analyticsSchema.index({ region: 1, date: -1 });
analyticsSchema.index({ chapter: 1, date: -1 });
analyticsSchema.index({ 'metadata.processed': 1 });

// Virtual for formatted date
analyticsSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Static method to get platform metrics
analyticsSchema.statics.getPlatformMetrics = async function() {
  const User = mongoose.model('User');
  const Chapter = mongoose.model('Chapter');
  const Event = mongoose.model('Event');
  const Badge = mongoose.model('Badge');

  const [
    totalUsers,
    activeUsers,
    totalChapters,
    activeChapters,
    totalEvents,
    upcomingEvents,
    totalBadges
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Chapter.countDocuments(),
    Chapter.countDocuments({ status: 'Active' }),
    Event.countDocuments(),
    Event.countDocuments({ date: { $gte: new Date() } }),
    Badge.countDocuments()
  ]);

  return {
    platform: {
      totalUsers,
      activeUsers,
      totalChapters,
      activeChapters,
      totalEvents,
      upcomingEvents,
      totalBadges
    }
  };
};

// Static method to get growth metrics
analyticsSchema.statics.getGrowthMetrics = async function(timeframe = 30) {
  const User = mongoose.model('User');
  const Chapter = mongoose.model('Chapter');
  const Event = mongoose.model('Event');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeframe);

  const [
    newUsers,
    newChapters,
    newEvents,
    previousUsers,
    previousChapters,
    previousEvents
  ] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: startDate } }),
    Chapter.countDocuments({ createdAt: { $gte: startDate } }),
    Event.countDocuments({ createdAt: { $gte: startDate } }),
    User.countDocuments({ createdAt: { $lt: startDate } }),
    Chapter.countDocuments({ createdAt: { $lt: startDate } }),
    Event.countDocuments({ createdAt: { $lt: startDate } })
  ]);

  const userGrowthRate = previousUsers > 0 ? ((newUsers / previousUsers) * 100) : 0;
  const chapterGrowthRate = previousChapters > 0 ? ((newChapters / previousChapters) * 100) : 0;
  const eventGrowthRate = previousEvents > 0 ? ((newEvents / previousEvents) * 100) : 0;

  return {
    growth: {
      newUsersThisMonth: newUsers,
      newChaptersThisMonth: newChapters,
      newEventsThisMonth: newEvents,
      userGrowthRate: Math.round(userGrowthRate * 100) / 100,
      chapterGrowthRate: Math.round(chapterGrowthRate * 100) / 100,
      eventGrowthRate: Math.round(eventGrowthRate * 100) / 100
    }
  };
};

// Static method to get regional metrics
analyticsSchema.statics.getRegionalMetrics = async function() {
  const User = mongoose.model('User');
  const Chapter = mongoose.model('Chapter');
  const Event = mongoose.model('Event');

  const regions = ['West Africa', 'East Africa', 'Southern Africa', 'North Africa', 'International'];
  const regionalData = {};

  for (const region of regions) {
    const [users, chapters, events] = await Promise.all([
      User.countDocuments({ 'profile.region': region }),
      Chapter.countDocuments({ region: region }),
      Event.countDocuments({ region: region })
    ]);

    regionalData[region] = {
      users,
      chapters,
      events,
      growth: Math.random() * 20 // Placeholder for actual growth calculation
    };
  }

  return { regional: regionalData };
};

// Instance method to process analytics data
analyticsSchema.methods.process = function() {
  this.metadata.processed = true;
  this.metadata.version = '1.0';
  return this.save();
};

module.exports = mongoose.model('Analytics', analyticsSchema);

