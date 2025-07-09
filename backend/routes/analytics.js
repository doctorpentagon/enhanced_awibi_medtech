const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Chapter = require('../models/Chapter');
const Event = require('../models/Event');
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard metrics
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { timeframe = '30d', region } = req.query;
    
    // Get platform metrics
    const platformMetrics = await Analytics.getPlatformMetrics();
    
    // Get growth metrics
    const growthMetrics = await Analytics.getGrowthMetrics(
      timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : 30
    );
    
    // Get regional metrics
    const regionalMetrics = await Analytics.getRegionalMetrics();
    
    // Get engagement metrics
    const engagementMetrics = await getEngagementMetrics();
    
    const dashboardData = {
      ...platformMetrics,
      ...growthMetrics,
      ...regionalMetrics,
      engagement: engagementMetrics,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/user-growth
// @desc    Get user growth analytics
// @access  Private (Admin/SuperAdmin)
router.get('/user-growth', auth, rbac(['admin', 'superadmin']), async (req, res) => {
  try {
    const { timeframe = '6m' } = req.query;
    
    const months = timeframe === '1y' ? 12 : 6;
    const userGrowthData = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1); // First day of month
      
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const userCount = await User.countDocuments({
        createdAt: { $lt: nextMonth }
      });
      
      userGrowthData.push({
        date: date.toISOString().split('T')[0],
        users: userCount,
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }

    res.json({
      success: true,
      data: userGrowthData
    });
  } catch (error) {
    console.error('User growth analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user growth analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/event-attendance
// @desc    Get event attendance analytics
// @access  Private
router.get('/event-attendance', auth, async (req, res) => {
  try {
    const { timeframe = '6m' } = req.query;
    
    const months = timeframe === '1y' ? 12 : 6;
    const attendanceData = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const events = await Event.find({
        date: { $gte: date, $lt: nextMonth }
      });
      
      const totalAttendance = events.reduce((sum, event) => sum + (event.attendees || 0), 0);
      
      attendanceData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        attendance: totalAttendance,
        events: events.length
      });
    }

    res.json({
      success: true,
      data: attendanceData
    });
  } catch (error) {
    console.error('Event attendance analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event attendance analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/chapter-activity
// @desc    Get chapter activity analytics
// @access  Private
router.get('/chapter-activity', auth, async (req, res) => {
  try {
    const regions = ['West Africa', 'East Africa', 'Southern Africa', 'North Africa', 'International'];
    const activityData = [];
    
    for (const region of regions) {
      const chapters = await Chapter.find({ region });
      const events = await Event.find({ region });
      const users = await User.find({ 'profile.region': region });
      
      // Calculate activity score based on events, users, and recent activity
      const activityScore = Math.min(100, 
        (events.length * 5) + 
        (users.length * 0.1) + 
        (chapters.length * 10)
      );
      
      activityData.push({
        region,
        activity: Math.round(activityScore),
        chapters: chapters.length,
        events: events.length,
        users: users.length
      });
    }

    res.json({
      success: true,
      data: activityData
    });
  } catch (error) {
    console.error('Chapter activity analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chapter activity analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/badge-distribution
// @desc    Get badge distribution analytics
// @access  Private
router.get('/badge-distribution', auth, async (req, res) => {
  try {
    const badges = await Badge.find();
    const distribution = {};
    
    badges.forEach(badge => {
      const category = badge.category || 'Other';
      if (!distribution[category]) {
        distribution[category] = 0;
      }
      distribution[category] += badge.stats?.totalAwarded || 0;
    });
    
    const distributionData = Object.entries(distribution).map(([category, count]) => ({
      category,
      count
    }));

    res.json({
      success: true,
      data: distributionData
    });
  } catch (error) {
    console.error('Badge distribution analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badge distribution analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/analytics/recent-activities
// @desc    Get recent platform activities
// @access  Private
router.get('/recent-activities', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('firstName lastName createdAt');
    
    // Get recent events
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title location createdAt');
    
    // Get recent chapters
    const recentChapters = await Chapter.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select('name city members createdAt');
    
    const activities = [];
    
    // Add user activities
    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user._id}`,
        type: 'user_joined',
        title: 'New Member Joined',
        description: `${user.firstName} ${user.lastName} joined the community`,
        timestamp: user.createdAt,
        icon: '👋',
        user: {
          name: `${user.firstName} ${user.lastName}`,
          avatar: '/src/assets/users/default.jpg'
        }
      });
    });
    
    // Add event activities
    recentEvents.forEach(event => {
      activities.push({
        id: `event_${event._id}`,
        type: 'event_created',
        title: 'New Event Created',
        description: `${event.title} scheduled for ${event.location}`,
        timestamp: event.createdAt,
        icon: '📅',
        event: event.title,
        location: event.location
      });
    });
    
    // Add chapter activities
    recentChapters.forEach(chapter => {
      activities.push({
        id: `chapter_${chapter._id}`,
        type: 'chapter_milestone',
        title: 'Chapter Milestone',
        description: `${chapter.name} reached ${chapter.members} members`,
        timestamp: chapter.createdAt,
        icon: '🎯',
        chapter: chapter.name,
        milestone: `${chapter.members} members`
      });
    });
    
    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedActivities = activities.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: limitedActivities
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/analytics/track
// @desc    Track custom analytics event
// @access  Private
router.post('/track', auth, async (req, res) => {
  try {
    const { type, metrics, region, chapter } = req.body;
    
    const analytics = new Analytics({
      type,
      metrics,
      region,
      chapter,
      user: req.user.id,
      metadata: {
        source: 'user_action',
        version: '1.0'
      }
    });
    
    await analytics.save();

    res.json({
      success: true,
      message: 'Analytics event tracked successfully',
      data: analytics
    });
  } catch (error) {
    console.error('Track analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track analytics event',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Helper function to get engagement metrics
async function getEngagementMetrics() {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Calculate average events per user
    const users = await User.find().select('stats.eventsAttended');
    const totalEventsAttended = users.reduce((sum, user) => 
      sum + (user.stats?.eventsAttended || 0), 0
    );
    const averageEventsPerUser = totalUsers > 0 ? 
      Math.round((totalEventsAttended / totalUsers) * 10) / 10 : 0;
    
    // Calculate average badges per user
    const totalBadgesEarned = users.reduce((sum, user) => 
      sum + (user.stats?.badgesEarned || 0), 0
    );
    const averageBadgesPerUser = totalUsers > 0 ? 
      Math.round((totalBadgesEarned / totalUsers) * 10) / 10 : 0;
    
    // Calculate average chapters per user
    const totalChaptersJoined = users.reduce((sum, user) => 
      sum + (user.stats?.chaptersJoined || 1), 0
    );
    const averageChaptersPerUser = totalUsers > 0 ? 
      Math.round((totalChaptersJoined / totalUsers) * 10) / 10 : 0;
    
    // Calculate active user metrics (placeholder values for demo)
    const monthlyActiveUsers = Math.round(activeUsers * 0.75);
    const weeklyActiveUsers = Math.round(activeUsers * 0.5);
    const dailyActiveUsers = Math.round(activeUsers * 0.2);
    
    return {
      averageEventsPerUser,
      averageBadgesPerUser,
      averageChaptersPerUser,
      monthlyActiveUsers,
      weeklyActiveUsers,
      dailyActiveUsers
    };
  } catch (error) {
    console.error('Engagement metrics error:', error);
    return {
      averageEventsPerUser: 0,
      averageBadgesPerUser: 0,
      averageChaptersPerUser: 0,
      monthlyActiveUsers: 0,
      weeklyActiveUsers: 0,
      dailyActiveUsers: 0
    };
  }
}

module.exports = router;

