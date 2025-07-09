const express = require('express');
const User = require('../models/User');
const Chapter = require('../models/Chapter');
const { protect, authorize, ownerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    // Filter by chapter
    if (req.query.chapter) {
      query.chapter = req.query.chapter;
    }
    
    // Filter by country
    if (req.query.country) {
      query.country = req.query.country;
    }
    
    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .populate('chapter', 'name city country')
      .populate('badges.badge', 'name icon category')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('chapter', 'name city country')
      .populate('badges.badge', 'name icon category level');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Owner or Admin)
router.put('/:id', protect, ownerOrAdmin(), async (req, res) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      country: req.body.country,
      city: req.body.city,
      profession: req.body.profession,
      institution: req.body.institution,
      specialization: req.body.specialization,
      linkedIn: req.body.linkedIn,
      twitter: req.body.twitter,
    };

    // Only admins can update role and chapter
    if (['Admin', 'Super Admin'].includes(req.user.role)) {
      if (req.body.role) fieldsToUpdate.role = req.body.role;
      if (req.body.chapter) fieldsToUpdate.chapter = req.body.chapter;
      if (req.body.isActive !== undefined) fieldsToUpdate.isActive = req.body.isActive;
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    ).populate('chapter', 'name city country');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Soft delete - deactivate user instead of removing
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get users by chapter
// @route   GET /api/users/chapter/:chapterId
// @access  Private
router.get('/chapter/:chapterId', protect, async (req, res) => {
  try {
    const users = await User.find({ 
      chapter: req.params.chapterId,
      isActive: true 
    })
      .populate('badges.badge', 'name icon category')
      .sort({ role: 1, joinedAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get leaders
// @route   GET /api/users/leaders
// @access  Public
router.get('/leaders/all', async (req, res) => {
  try {
    const leaders = await User.find({
      role: { $in: ['Leader', 'Ambassador', 'Admin', 'Super Admin'] },
      isActive: true,
    })
      .populate('chapter', 'name city country')
      .populate('badges.badge', 'name icon category')
      .sort({ role: 1, 'stats.contributionScore': -1 });

    res.status(200).json({
      success: true,
      count: leaders.length,
      data: leaders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin only)
router.get('/stats/overview', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalLeaders = await User.countDocuments({ 
      role: { $in: ['Leader', 'Ambassador'] },
      isActive: true 
    });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      isActive: true,
    });

    // Users by country
    const usersByCountry = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Users by role
    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalLeaders,
        newUsersThisMonth,
        usersByCountry,
        usersByRole,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Join chapter
// @route   POST /api/users/:id/join-chapter
// @access  Private (Owner or Admin)
router.post('/:id/join-chapter', protect, ownerOrAdmin(), async (req, res) => {
  try {
    const { chapterId } = req.body;

    if (!chapterId) {
      return res.status(400).json({
        success: false,
        message: 'Chapter ID is required',
      });
    }

    // Check if chapter exists
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    // Update user's chapter
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { chapter: chapterId },
      { new: true }
    ).populate('chapter', 'name city country');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update chapter member count
    await chapter.updateMemberCount();

    res.status(200).json({
      success: true,
      message: 'Successfully joined chapter',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Leave chapter
// @route   POST /api/users/:id/leave-chapter
// @access  Private (Owner or Admin)
router.post('/:id/leave-chapter', protect, ownerOrAdmin(), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const oldChapterId = user.chapter;

    // Remove user from chapter
    user.chapter = undefined;
    await user.save();

    // Update old chapter member count
    if (oldChapterId) {
      const oldChapter = await Chapter.findById(oldChapterId);
      if (oldChapter) {
        await oldChapter.updateMemberCount();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Successfully left chapter',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;

