const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, authorize, chapterLeaderOrAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Filter by status (default to published for public access)
    if (req.query.status) {
      query.status = req.query.status;
    } else {
      query.status = { $in: ['Published', 'Registration Open', 'Ongoing'] };
    }
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by format
    if (req.query.format) {
      query.format = req.query.format;
    }
    
    // Filter by chapter
    if (req.query.chapter) {
      query.chapter = req.query.chapter;
    }
    
    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.startDate = {};
      if (req.query.startDate) {
        query.startDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.startDate.$lte = new Date(req.query.endDate);
      }
    }
    
    // Filter upcoming events
    if (req.query.upcoming === 'true') {
      query.startDate = { $gte: new Date() };
    }
    
    // Search by title or description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('chapter', 'name city country')
      .populate('organizers.user', 'firstName lastName avatar')
      .sort({ startDate: 1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('chapter', 'name city country')
      .populate('organizers.user', 'firstName lastName avatar email profession')
      .populate('attendees.user', 'firstName lastName avatar');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if current user is registered (if authenticated)
    let isRegistered = false;
    if (req.user) {
      isRegistered = event.attendees.some(attendee => 
        attendee.user._id.toString() === req.user.id
      );
    }

    res.status(200).json({
      success: true,
      data: {
        ...event.toObject(),
        isRegistered,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Leader or Admin)
router.post('/', protect, authorize('Leader', 'Ambassador', 'Admin', 'Super Admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      type,
      category,
      startDate,
      endDate,
      timezone,
      format,
      venue,
      virtualLink,
      speakers,
      chapter,
      registrationRequired,
      maxCapacity,
      registrationDeadline,
      registrationLink,
      agenda,
      requirements,
      tags,
      pricing,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      shortDescription,
      type,
      category,
      startDate,
      endDate,
      timezone,
      format,
      venue,
      virtualLink,
      speakers,
      chapter,
      registrationRequired,
      maxCapacity,
      registrationDeadline,
      registrationLink,
      agenda,
      requirements,
      tags,
      pricing,
      organizers: [{
        user: req.user.id,
        role: 'Lead Organizer',
      }],
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('chapter', 'name city country')
      .populate('organizers.user', 'firstName lastName avatar email');

    res.status(201).json({
      success: true,
      data: populatedEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer or Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is organizer or admin
    const isOrganizer = event.organizers.some(org => 
      org.user.toString() === req.user.id
    );
    const isAdmin = ['Admin', 'Super Admin'].includes(req.user.role);

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    const fieldsToUpdate = {
      title: req.body.title,
      description: req.body.description,
      shortDescription: req.body.shortDescription,
      type: req.body.type,
      category: req.body.category,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      timezone: req.body.timezone,
      format: req.body.format,
      venue: req.body.venue,
      virtualLink: req.body.virtualLink,
      speakers: req.body.speakers,
      registrationRequired: req.body.registrationRequired,
      maxCapacity: req.body.maxCapacity,
      registrationDeadline: req.body.registrationDeadline,
      registrationLink: req.body.registrationLink,
      agenda: req.body.agenda,
      requirements: req.body.requirements,
      tags: req.body.tags,
      pricing: req.body.pricing,
      images: req.body.images,
      materials: req.body.materials,
    };

    // Only admins can update status
    if (isAdmin && req.body.status) {
      fieldsToUpdate.status = req.body.status;
    }

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('chapter', 'name city country')
      .populate('organizers.user', 'firstName lastName avatar email');

    res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is organizer or admin
    const isOrganizer = event.organizers.some(org => 
      org.user.toString() === req.user.id
    );
    const isAdmin = ['Admin', 'Super Admin'].includes(req.user.role);

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if registration is required
    if (!event.registrationRequired) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not required for this event',
      });
    }

    // Check if registration is still open
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed',
      });
    }

    // Check if event is full
    if (event.stats.totalRegistrations >= event.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }

    // Check if user is already registered
    const isAlreadyRegistered = event.attendees.some(attendee => 
      attendee.user.toString() === req.user.id
    );

    if (isAlreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Register user
    await event.registerUser(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Unregister from event
// @route   DELETE /api/events/:id/register
// @access  Private
router.delete('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(attendee => 
      attendee.user.toString() !== req.user.id
    );

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from event',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Mark attendance
// @route   POST /api/events/:id/attendance
// @access  Private (Organizer or Admin)
router.post('/:id/attendance', protect, async (req, res) => {
  try {
    const { userId, attended = true } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is organizer or admin
    const isOrganizer = event.organizers.some(org => 
      org.user.toString() === req.user.id
    );
    const isAdmin = ['Admin', 'Super Admin'].includes(req.user.role);

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark attendance',
      });
    }

    await event.markAttendance(userId, attended);

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Submit event feedback
// @route   POST /api/events/:id/feedback
// @access  Private
router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Find attendee
    const attendee = event.attendees.find(a => 
      a.user.toString() === req.user.id
    );

    if (!attendee) {
      return res.status(400).json({
        success: false,
        message: 'You must be registered for this event to provide feedback',
      });
    }

    // Update feedback
    attendee.feedback = {
      rating,
      comment,
      submittedAt: new Date(),
    };

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get upcoming events
// @route   GET /api/events/upcoming/all
// @access  Public
router.get('/upcoming/all', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const events = await Event.findUpcoming(limit)
      .populate('chapter', 'name city country')
      .populate('organizers.user', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get events by chapter
// @route   GET /api/events/chapter/:chapterId
// @access  Public
router.get('/chapter/:chapterId', async (req, res) => {
  try {
    const events = await Event.findByChapter(req.params.chapterId)
      .populate('organizers.user', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @desc    Get event statistics
// @route   GET /api/events/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, authorize('Admin', 'Super Admin'), async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({
      startDate: { $gte: new Date() },
      status: { $in: ['Published', 'Registration Open'] },
    });
    const eventsThisMonth = await Event.countDocuments({
      startDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    });

    // Events by type
    const eventsByType = await Event.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Events by format
    const eventsByFormat = await Event.aggregate([
      { $group: { _id: '$format', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        eventsThisMonth,
        eventsByType,
        eventsByFormat,
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

