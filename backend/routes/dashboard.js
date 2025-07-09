const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Chapter = require('../models/Chapter');
const Event = require('../models/Event');
const Badge = require('../models/Badge');
const { protect } = require('../middleware/auth');
const { requireRole, requirePermission, canManageChapter } = require('../middleware/rbac');

// @desc    Get dashboard overview data
// @route   GET /api/dashboard/overview
// @access  Private
router.get('/overview', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let dashboardData = {};
    
    // Common data for all users
    const user = await User.findById(userId)
      .populate('chapters.chapter')
      .populate('badges.badge')
      .populate('primaryChapter');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Base dashboard data
    dashboardData = {
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        primaryChapter: user.primaryChapter,
        badgeCount: user.badgeCount,
        chapterCount: user.chapterCount,
        unreadNotifications: user.unreadNotificationsCount,
      },
      stats: user.stats,
      recentNotifications: user.notifications.slice(0, 5),
    };
    
    // Role-specific dashboard data
    if (['Superadmin', 'Admin'].includes(userRole)) {
      // Superadmin/Admin dashboard
      const totalMembers = await User.countDocuments({ isActive: true });
      const totalLeaders = await User.countDocuments({ 
        role: { $in: ['Leader', 'Ambassador', 'Admin', 'Superadmin'] },
        isActive: true 
      });
      const totalChapters = await Chapter.countDocuments({ isActive: true });
      const totalBadges = await Badge.countDocuments();
      
      // Get new members this month
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const newMembersThisMonth = await User.countDocuments({
        isActive: true,
        createdAt: { $gte: startOfMonth }
      });
      
      // Get pending role applications
      const pendingApplications = await User.countDocuments({
        'roleApplication.status': 'Pending'
      });
      
      // Get membership growth data (last 7 days)
      const membershipGrowth = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        
        const count = await User.countDocuments({
          createdAt: { $gte: startOfDay, $lt: endOfDay },
          isActive: true
        });
        
        membershipGrowth.push({
          date: startOfDay.toISOString().split('T')[0],
          count
        });
      }
      
      // Get top chapters
      const topChapters = await Chapter.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'chapters.chapter',
            as: 'members'
          }
        },
        {
          $project: {
            name: 1,
            city: 1,
            country: 1,
            memberCount: { $size: '$members' }
          }
        },
        { $sort: { memberCount: -1 } },
        { $limit: 6 }
      ]);
      
      // Get recent leaders
      const recentLeaders = await User.find({
        role: { $in: ['Leader', 'Ambassador'] },
        isActive: true
      })
      .populate('primaryChapter')
      .sort({ 'leadershipInfo.leadershipStartDate': -1 })
      .limit(7)
      .select('firstName lastName email role primaryChapter avatar');
      
      dashboardData.adminStats = {
        totalMembers,
        totalLeaders,
        totalChapters,
        totalBadges,
        newMembersThisMonth,
        pendingApplications,
        membershipGrowth,
        topChapters,
        recentLeaders,
      };
      
    } else if (['Leader', 'Ambassador'].includes(userRole)) {
      // Leader dashboard
      const managedChapters = await Chapter.find({
        _id: { $in: user.leadershipInfo.managedChapters }
      });
      
      let totalManagedMembers = 0;
      let chapterStats = [];
      
      for (const chapter of managedChapters) {
        const memberCount = await User.countDocuments({
          'chapters.chapter': chapter._id,
          isActive: true
        });
        
        const newMembersThisMonth = await User.countDocuments({
          'chapters.chapter': chapter._id,
          isActive: true,
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        });
        
        const upcomingEvents = await Event.countDocuments({
          chapter: chapter._id,
          startDate: { $gte: new Date() },
          status: 'Published'
        });
        
        totalManagedMembers += memberCount;
        
        chapterStats.push({
          chapter: {
            id: chapter._id,
            name: chapter.name,
            city: chapter.city,
            country: chapter.country,
          },
          memberCount,
          newMembersThisMonth,
          upcomingEvents,
        });
      }
      
      // Get recent members from managed chapters
      const recentMembers = await User.find({
        'chapters.chapter': { $in: user.leadershipInfo.managedChapters },
        isActive: true
      })
      .populate('chapters.chapter')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email chapters avatar createdAt');
      
      // Get upcoming events from managed chapters
      const upcomingEvents = await Event.find({
        chapter: { $in: user.leadershipInfo.managedChapters },
        startDate: { $gte: new Date() },
        status: 'Published'
      })
      .populate('chapter')
      .sort({ startDate: 1 })
      .limit(5)
      .select('title startDate chapter location type');
      
      dashboardData.leaderStats = {
        managedChapters: managedChapters.length,
        totalManagedMembers,
        chapterStats,
        recentMembers,
        upcomingEvents,
      };
      
    } else {
      // Member dashboard
      const userChapters = await Chapter.find({
        _id: { $in: user.chapters.map(ch => ch.chapter) }
      });
      
      // Get upcoming events from user's chapters
      const upcomingEvents = await Event.find({
        chapter: { $in: user.chapters.map(ch => ch.chapter) },
        startDate: { $gte: new Date() },
        status: 'Published'
      })
      .populate('chapter')
      .sort({ startDate: 1 })
      .limit(5)
      .select('title startDate chapter location type');
      
      // Get recent badges
      const recentBadges = user.badges
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, 5);
      
      dashboardData.memberStats = {
        joinedChapters: userChapters,
        upcomingEvents,
        recentBadges,
      };
    }
    
    res.status(200).json({
      success: true,
      data: dashboardData,
    });
    
  } catch (error) {
    console.error('Dashboard Overview Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
    });
  }
});

// @desc    Get chapter members (for leaders)
// @route   GET /api/dashboard/chapters/:chapterId/members
// @access  Private (Leader+)
router.get('/chapters/:chapterId/members', 
  protect, 
  requirePermission('view_chapter_members'),
  canManageChapter('chapterId'),
  async (req, res) => {
    try {
      const { chapterId } = req.params;
      const { page = 1, limit = 10, search = '', role = '' } = req.query;
      
      // Build search query
      let searchQuery = {
        'chapters.chapter': chapterId,
        isActive: true,
      };
      
      if (search) {
        searchQuery.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      
      if (role) {
        searchQuery.role = role;
      }
      
      const members = await User.find(searchQuery)
        .populate('chapters.chapter')
        .populate('badges.badge')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('firstName lastName email role avatar chapters badges createdAt');
      
      const total = await User.countDocuments(searchQuery);
      
      res.status(200).json({
        success: true,
        data: {
          members,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
          },
        },
      });
      
    } catch (error) {
      console.error('Get Chapter Members Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch chapter members',
      });
    }
  }
);

// @desc    Get all members (for admin)
// @route   GET /api/dashboard/members
// @access  Private (Admin+)
router.get('/members', 
  protect, 
  requirePermission('view_all_members'),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', role = '', chapter = '', badge = '' } = req.query;
      
      // Build search query
      let searchQuery = { isActive: true };
      
      if (search) {
        searchQuery.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      
      if (role) {
        searchQuery.role = role;
      }
      
      if (chapter) {
        searchQuery['chapters.chapter'] = chapter;
      }
      
      if (badge) {
        searchQuery['badges.category'] = badge;
      }
      
      const members = await User.find(searchQuery)
        .populate('chapters.chapter')
        .populate('badges.badge')
        .populate('primaryChapter')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('firstName lastName email role avatar chapters badges primaryChapter createdAt');
      
      const total = await User.countDocuments(searchQuery);
      
      // Get filter options
      const roles = await User.distinct('role', { isActive: true });
      const chapters = await Chapter.find({ isActive: true }).select('name city country');
      const badgeCategories = await User.distinct('badges.category');
      
      res.status(200).json({
        success: true,
        data: {
          members,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
          },
          filters: {
            roles,
            chapters,
            badgeCategories,
          },
        },
      });
      
    } catch (error) {
      console.error('Get All Members Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch members',
      });
    }
  }
);

// @desc    Get badge statistics
// @route   GET /api/dashboard/badges/stats
// @access  Private
router.get('/badges/stats', protect, async (req, res) => {
  try {
    const badgeStats = await User.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$badges' },
      {
        $group: {
          _id: '$badges.category',
          count: { $sum: 1 },
          thisMonth: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$badges.earnedAt',
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          thisMonth: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: badgeStats,
    });
    
  } catch (error) {
    console.error('Badge Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badge statistics',
    });
  }
});

// @desc    Get role applications (for superadmin)
// @route   GET /api/dashboard/role-applications
// @access  Private (Superadmin)
router.get('/role-applications', 
  protect, 
  requireRole(['Superadmin']),
  async (req, res) => {
    try {
      const { status = 'Pending' } = req.query;
      
      const applications = await User.find({
        'roleApplication.status': status,
        'roleApplication.appliedFor': { $exists: true }
      })
      .populate('roleApplication.reviewedBy', 'firstName lastName')
      .sort({ 'roleApplication.applicationDate': -1 })
      .select('firstName lastName email role roleApplication avatar');
      
      res.status(200).json({
        success: true,
        data: applications,
      });
      
    } catch (error) {
      console.error('Role Applications Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch role applications',
      });
    }
  }
);

// @desc    Update role application status
// @route   PATCH /api/dashboard/role-applications/:userId
// @access  Private (Superadmin)
router.patch('/role-applications/:userId', 
  protect, 
  requireRole(['Superadmin']),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { status, notes } = req.body;
      
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      
      if (!user.roleApplication.appliedFor) {
        return res.status(400).json({
          success: false,
          message: 'No role application found for this user',
        });
      }
      
      // Update application status
      user.roleApplication.status = status;
      user.roleApplication.reviewedBy = req.user.id;
      user.roleApplication.reviewDate = new Date();
      user.roleApplication.notes = notes || '';
      
      // If approved, update user role
      if (status === 'Approved') {
        user.role = user.roleApplication.appliedFor;
        
        // Add notification
        await user.addNotification(
          'Leadership Role Request',
          'Role Application Approved',
          `Your application for ${user.roleApplication.appliedFor} role has been approved!`
        );
      } else if (status === 'Rejected') {
        // Add notification
        await user.addNotification(
          'Leadership Role Request',
          'Role Application Rejected',
          `Your application for ${user.roleApplication.appliedFor} role has been rejected. ${notes || ''}`
        );
      }
      
      await user.save();
      
      res.status(200).json({
        success: true,
        message: `Role application ${status.toLowerCase()} successfully`,
        data: user.roleApplication,
      });
      
    } catch (error) {
      console.error('Update Role Application Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update role application',
      });
    }
  }
);

module.exports = router;

