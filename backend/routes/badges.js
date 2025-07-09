const express = require('express');
const Badge = require('../models/Badge');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all badges
// @route   GET /api/badges
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = { isActive: true };
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by level
    if (req.query.level) {
      query.level = req.query.level;
    }
    
    // Filter by rarity
    if (req.query.rarity) {
      query.rarity = req.query.rarity;
    }
    
    // Search by name or description
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const badges = await Badge.find(query)
      .populate('prerequisites.badge', 'name icon')
      .sort({ 'displaySettings.order': 1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Badge.countDocuments(query);

    res.status(200).json({
      success: true,
      count: badges.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: badges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get badge by ID
// @route   GET /api/badges/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id)
      .populate('prerequisites.badge', 'name icon category')
      .populate('metadata.createdBy', 'firstName lastName')
      .populate('metadata.approvedBy', 'firstName lastName');

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found',
      });
    }

    res.status(200).json({
      success: true,
      data: badge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Create new badge
// @route   POST /api/badges
// @access  Private (Admin only)
router.post('/', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      type,
      level,
      icon,
      color,
      backgroundColor,
      criteria,
      points,
      rarity,
      prerequisites,
      validityPeriod,
      displaySettings,
      tags,
      isAutoAwarded,
    } = req.body;

    const badge = await Badge.create({
      name,
      description,
      category,
      type,
      level,
      icon,
      color,
      backgroundColor,
      criteria,
      points,
      rarity,
      prerequisites,
      validityPeriod,
      displaySettings,
      tags,
      isAutoAwarded,
      metadata: {
        createdBy: req.user.id,
        approvedBy: req.user.id,
        approvedAt: new Date(),
      },
    });

    const populatedBadge = await Badge.findById(badge._id)
      .populate('prerequisites.badge', 'name icon')
      .populate('metadata.createdBy', 'firstName lastName')
      .populate('metadata.approvedBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: populatedBadge,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update badge
// @route   PUT /api/badges/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      level: req.body.level,
      icon: req.body.icon,
      color: req.body.color,
      backgroundColor: req.body.backgroundColor,
      criteria: req.body.criteria,
      points: req.body.points,
      rarity: req.body.rarity,
      prerequisites: req.body.prerequisites,
      validityPeriod: req.body.validityPeriod,
      displaySettings: req.body.displaySettings,
      tags: req.body.tags,
      isActive: req.body.isActive,
      isAutoAwarded: req.body.isAutoAwarded,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const badge = await Badge.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('prerequisites.badge', 'name icon')
      .populate('metadata.createdBy', 'firstName lastName')
      .populate('metadata.approvedBy', 'firstName lastName');

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found',
      });
    }

    res.status(200).json({
      success: true,
      data: badge,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete badge
// @route   DELETE /api/badges/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found',
      });
    }

    // Soft delete - deactivate badge instead of removing
    badge.isActive = false;
    await badge.save();

    res.status(200).json({
      success: true,
      message: 'Badge deactivated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get badges by category
// @route   GET /api/badges/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const badges = await Badge.findByCategory(req.params.category);

    res.status(200).json({
      success: true,
      count: badges.length,
      data: badges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Award badge to user
// @route   POST /api/badges/:id/award
// @access  Private (Admin only)
router.post('/:id/award', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user already has this badge
    const hasBadge = user.badges.some(userBadge => 
      userBadge.badge.toString() === req.params.id
    );

    if (hasBadge) {
      return res.status(400).json({
        success: false,
        message: 'User already has this badge',
      });
    }

    await badge.awardToUser(userId);

    res.status(200).json({
      success: true,
      message: 'Badge awarded successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Check user eligibility for badge
// @route   GET /api/badges/:id/eligibility/:userId
// @access  Private (Admin only)
router.get('/:id/eligibility/:userId', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found',
      });
    }

    const isEligible = await badge.checkUserEligibility(req.params.userId);

    res.status(200).json({
      success: true,
      data: {
        isEligible,
        badge: badge.name,
        user: req.params.userId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get user badges
// @route   GET /api/badges/user/:userId
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    // Check if user can view this profile
    if (req.params.userId !== req.user.id && !['Admin', 'Super Admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user\'s badges',
      });
    }

    const user = await User.findById(req.params.userId)
      .populate('badges.badge', 'name description icon category level rarity points');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      count: user.badges.length,
      data: user.badges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Auto-award badges
// @route   POST /api/badges/auto-award
// @access  Private (Admin only)
router.post('/auto-award', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const autoAwardedBadges = await Badge.findAutoAwarded();
    const users = await User.find({ isActive: true });
    
    let awardedCount = 0;
    const results = [];

    for (const badge of autoAwardedBadges) {
      for (const user of users) {
        try {
          const isEligible = await badge.checkUserEligibility(user._id);
          if (isEligible) {
            await badge.awardToUser(user._id);
            awardedCount++;
            results.push({
              badge: badge.name,
              user: `${user.firstName} ${user.lastName}`,
              awarded: true,
            });
          }
        } catch (error) {
          // User already has badge or other error
          continue;
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Auto-awarded ${awardedCount} badges`,
      data: {
        totalAwarded: awardedCount,
        results: results.slice(0, 10), // Return first 10 results
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get badge statistics
// @route   GET /api/badges/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const totalBadges = await Badge.countDocuments({ isActive: true });
    const autoAwardedBadges = await Badge.countDocuments({ isAutoAwarded: true, isActive: true });
    
    // Total badges awarded
    const totalAwarded = await Badge.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$stats.totalAwarded' } } },
    ]);

    // Badges by category
    const badgesByCategory = await Badge.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Badges by rarity
    const badgesByRarity = await Badge.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$rarity', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Most awarded badges
    const mostAwarded = await Badge.find({ isActive: true })
      .sort({ 'stats.totalAwarded': -1 })
      .limit(5)
      .select('name stats.totalAwarded');

    res.status(200).json({
      success: true,
      data: {
        totalBadges,
        autoAwardedBadges,
        totalAwarded: totalAwarded[0]?.total || 0,
        badgesByCategory,
        badgesByRarity,
        mostAwarded,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get badge leaderboard
// @route   GET /api/badges/leaderboard
// @access  Public
router.get('/leaderboard/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const topUsers = await User.find({ isActive: true })
      .populate('badges.badge', 'name icon category level points')
      .sort({ 'stats.badgesEarned': -1, 'stats.contributionScore': -1 })
      .limit(limit)
      .select('firstName lastName avatar stats chapter')
      .populate('chapter', 'name city country');

    res.status(200).json({
      success: true,
      count: topUsers.length,
      data: topUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;

