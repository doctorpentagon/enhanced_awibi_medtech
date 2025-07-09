const express = require('express');
const Chapter = require('../models/Chapter');
const User = require('../models/User');
const { protect, authorize, chapterLeaderOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all chapters
// @route   GET /api/chapters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Filter by status (default to active for public access)
    if (req.query.status) {
      query.status = req.query.status;
    } else {
      query.status = 'Active';
    }
    
    // Filter by country
    if (req.query.country) {
      query.country = req.query.country;
    }
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Search by name or city
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { city: { $regex: req.query.search, $options: 'i' } },
        { university: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const chapters = await Chapter.find(query)
      .populate('leaders.user', 'firstName lastName avatar')
      .sort({ 'stats.totalMembers': -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Chapter.countDocuments(query);

    res.status(200).json({
      success: true,
      count: chapters.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: chapters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get chapter by ID
// @route   GET /api/chapters/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id)
      .populate('leaders.user', 'firstName lastName avatar email profession')
      .populate('approvedBy', 'firstName lastName');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Create new chapter
// @route   POST /api/chapters
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      description,
      country,
      city,
      type,
      university,
      faculty,
      email,
      website,
      socialMedia,
      focusAreas,
      meetingSchedule,
    } = req.body;

    // Check if chapter already exists in the same city
    const existingChapter = await Chapter.findOne({
      city: city,
      country: country,
      type: type,
      university: type === 'University' ? university : undefined,
    });

    if (existingChapter) {
      return res.status(400).json({
        success: false,
        message: 'A chapter already exists in this location',
      });
    }

    const chapter = await Chapter.create({
      name,
      description,
      country,
      city,
      type,
      university,
      faculty,
      email,
      website,
      socialMedia,
      focusAreas,
      meetingSchedule,
      leaders: [{
        user: req.user.id,
        role: 'Chapter Lead',
      }],
    });

    // Update user role to Leader
    await User.findByIdAndUpdate(req.user.id, {
      role: 'Leader',
      chapter: chapter._id,
    });

    const populatedChapter = await Chapter.findById(chapter._id)
      .populate('leaders.user', 'firstName lastName avatar email');

    res.status(201).json({
      success: true,
      data: populatedChapter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update chapter
// @route   PUT /api/chapters/:id
// @access  Private (Chapter Leader or Admin)
router.put('/:id', protect, chapterLeaderOrAdmin, async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      website: req.body.website,
      socialMedia: req.body.socialMedia,
      focusAreas: req.body.focusAreas,
      meetingSchedule: req.body.meetingSchedule,
      logo: req.body.logo,
      coverImage: req.body.coverImage,
    };

    // Only admins can update status and approval
    if (['Admin', 'Super Admin'].includes(req.user.role)) {
      if (req.body.status) fieldsToUpdate.status = req.body.status;
      if (req.body.status === 'Active' && !req.body.approvedBy) {
        fieldsToUpdate.approvedBy = req.user.id;
        fieldsToUpdate.approvedAt = new Date();
      }
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    ).populate('leaders.user', 'firstName lastName avatar email');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete chapter
// @route   DELETE /api/chapters/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    // Update all users in this chapter
    await User.updateMany(
      { chapter: req.params.id },
      { $unset: { chapter: 1 } }
    );

    await Chapter.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Chapter deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get chapters by country
// @route   GET /api/chapters/country/:country
// @access  Public
router.get('/country/:country', async (req, res) => {
  try {
    const chapters = await Chapter.find({
      country: req.params.country,
      status: 'Active',
    })
      .populate('leaders.user', 'firstName lastName avatar')
      .sort({ 'stats.totalMembers': -1 });

    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get pending chapters
// @route   GET /api/chapters/pending/all
// @access  Private (Admin only)
router.get('/pending/all', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const chapters = await Chapter.find({ status: 'Pending' })
      .populate('leaders.user', 'firstName lastName avatar email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Approve chapter
// @route   POST /api/chapters/:id/approve
// @access  Private (Admin only)
router.post('/:id/approve', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Active',
        approvedBy: req.user.id,
        approvedAt: new Date(),
      },
      { new: true }
    ).populate('leaders.user', 'firstName lastName avatar email');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chapter approved successfully',
      data: chapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Add leader to chapter
// @route   POST /api/chapters/:id/leaders
// @access  Private (Chapter Leader or Admin)
router.post('/:id/leaders', protect, chapterLeaderOrAdmin, async (req, res) => {
  try {
    const { userId, role = 'Organizer' } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is already a leader
    const existingLeader = chapter.leaders.find(leader => 
      leader.user.toString() === userId
    );

    if (existingLeader) {
      return res.status(400).json({
        success: false,
        message: 'User is already a leader of this chapter',
      });
    }

    // Add leader
    chapter.leaders.push({
      user: userId,
      role: role,
    });

    await chapter.save();

    // Update user role if not already a leader
    if (!['Leader', 'Ambassador', 'Admin', 'Super Admin'].includes(user.role)) {
      user.role = 'Leader';
      user.chapter = chapter._id;
      await user.save();
    }

    const updatedChapter = await Chapter.findById(req.params.id)
      .populate('leaders.user', 'firstName lastName avatar email');

    res.status(200).json({
      success: true,
      message: 'Leader added successfully',
      data: updatedChapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Remove leader from chapter
// @route   DELETE /api/chapters/:id/leaders/:userId
// @access  Private (Chapter Leader or Admin)
router.delete('/:id/leaders/:userId', protect, chapterLeaderOrAdmin, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found',
      });
    }

    // Remove leader
    chapter.leaders = chapter.leaders.filter(leader => 
      leader.user.toString() !== req.params.userId
    );

    await chapter.save();

    // Update user role if they're no longer a leader of any chapter
    const user = await User.findById(req.params.userId);
    if (user && user.role === 'Leader') {
      const otherChapters = await Chapter.find({
        'leaders.user': req.params.userId,
        _id: { $ne: req.params.id },
      });

      if (otherChapters.length === 0) {
        user.role = 'Member';
        await user.save();
      }
    }

    const updatedChapter = await Chapter.findById(req.params.id)
      .populate('leaders.user', 'firstName lastName avatar email');

    res.status(200).json({
      success: true,
      message: 'Leader removed successfully',
      data: updatedChapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get chapter statistics
// @route   GET /api/chapters/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const totalChapters = await Chapter.countDocuments({ status: 'Active' });
    const pendingChapters = await Chapter.countDocuments({ status: 'Pending' });
    const newChaptersThisMonth = await Chapter.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    });

    // Chapters by country
    const chaptersByCountry = await Chapter.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Chapters by type
    const chaptersByType = await Chapter.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalChapters,
        pendingChapters,
        newChaptersThisMonth,
        chaptersByCountry,
        chaptersByType,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;

