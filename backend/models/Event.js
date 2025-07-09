const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters'],
  },
  
  // Event Type and Category
  type: {
    type: String,
    enum: [
      'Workshop',
      'Webinar',
      'Conference',
      'Summit',
      'Hackathon',
      'Meetup',
      'Training',
      'Seminar',
      'Panel Discussion',
      'Networking',
      'Competition',
      'Outreach',
    ],
    required: [true, 'Event type is required'],
  },
  category: {
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
      'Regulatory Compliance',
      'Innovation',
      'Leadership',
    ],
    required: [true, 'Event category is required'],
  },
  
  // Date and Time
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  
  // Location Information
  format: {
    type: String,
    enum: ['Virtual', 'In-Person', 'Hybrid'],
    required: [true, 'Event format is required'],
  },
  venue: {
    name: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  virtualLink: {
    type: String,
    default: '',
  },
  
  // Organizers and Speakers
  organizers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['Lead Organizer', 'Co-Organizer', 'Volunteer'],
      default: 'Organizer',
    },
  }],
  
  speakers: [{
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    organization: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Speaker bio cannot exceed 500 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    topic: {
      type: String,
      default: '',
    },
  }],
  
  // Chapter Association
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  },
  
  // Registration and Capacity
  registrationRequired: {
    type: Boolean,
    default: true,
  },
  maxCapacity: {
    type: Number,
    default: 100,
  },
  registrationDeadline: {
    type: Date,
  },
  registrationLink: {
    type: String,
    default: '',
  },
  
  // Event Status
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Registration Open', 'Registration Closed', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Draft',
  },
  
  // Attendees
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    attended: {
      type: Boolean,
      default: false,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        maxlength: [500, 'Feedback comment cannot exceed 500 characters'],
      },
      submittedAt: {
        type: Date,
      },
    },
  }],
  
  // Event Media
  images: [{
    url: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  }],
  
  // Event Materials
  materials: [{
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Presentation', 'Document', 'Video', 'Audio', 'Link', 'Other'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  }],
  
  // Event Requirements
  requirements: [{
    type: String,
    trim: true,
  }],
  
  // Agenda/Schedule
  agenda: [{
    time: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    speaker: {
      type: String,
      default: '',
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
  }],
  
  // Event Statistics
  stats: {
    totalRegistrations: {
      type: Number,
      default: 0,
    },
    totalAttendees: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    feedbackCount: {
      type: Number,
      default: 0,
    },
  },
  
  // Tags for better searchability
  tags: [{
    type: String,
    trim: true,
  }],
  
  // SEO and Social Media
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  
  // Pricing (if applicable)
  pricing: {
    isFree: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
  },
  
  // Follow-up Information
  followUp: {
    certificateAvailable: {
      type: Boolean,
      default: false,
    },
    recordingAvailable: {
      type: Boolean,
      default: false,
    },
    recordingLink: {
      type: String,
      default: '',
    },
    surveyLink: {
      type: String,
      default: '',
    },
  },
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for event duration
eventSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60)); // in hours
  }
  return 0;
});

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function() {
  const now = new Date();
  
  if (this.status === 'Cancelled') return 'Cancelled';
  if (this.status === 'Completed') return 'Completed';
  if (this.endDate < now) return 'Past';
  if (this.startDate <= now && this.endDate >= now) return 'Ongoing';
  if (this.registrationDeadline && this.registrationDeadline < now) return 'Registration Closed';
  if (this.stats.totalRegistrations >= this.maxCapacity) return 'Full';
  
  return 'Open';
});

// Virtual for primary image
eventSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : '');
});

// Indexes for better performance
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ chapter: 1 });
eventSchema.index({ type: 1, category: 1 });
eventSchema.index({ 'venue.city': 1, 'venue.country': 1 });
eventSchema.index({ slug: 1 });

// Pre-save middleware to generate slug
eventSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Pre-save middleware to update stats
eventSchema.pre('save', function(next) {
  this.stats.totalRegistrations = this.attendees.length;
  this.stats.totalAttendees = this.attendees.filter(a => a.attended).length;
  
  // Calculate average rating
  const ratingsWithFeedback = this.attendees.filter(a => a.feedback && a.feedback.rating);
  if (ratingsWithFeedback.length > 0) {
    const totalRating = ratingsWithFeedback.reduce((sum, a) => sum + a.feedback.rating, 0);
    this.stats.averageRating = totalRating / ratingsWithFeedback.length;
    this.stats.feedbackCount = ratingsWithFeedback.length;
  }
  
  next();
});

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function(limit = 10) {
  return this.find({
    startDate: { $gte: new Date() },
    status: { $in: ['Published', 'Registration Open'] }
  })
  .sort({ startDate: 1 })
  .limit(limit);
};

// Static method to find events by chapter
eventSchema.statics.findByChapter = function(chapterId) {
  return this.find({ chapter: chapterId })
    .sort({ startDate: -1 });
};

// Static method to find events by date range
eventSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    $or: [
      { startDate: { $gte: startDate, $lte: endDate } },
      { endDate: { $gte: startDate, $lte: endDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
    ]
  });
};

// Instance method to register user
eventSchema.methods.registerUser = function(userId) {
  const existingAttendee = this.attendees.find(a => 
    a.user.toString() === userId.toString()
  );
  
  if (!existingAttendee && this.stats.totalRegistrations < this.maxCapacity) {
    this.attendees.push({
      user: userId,
      registeredAt: new Date(),
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Instance method to mark attendance
eventSchema.methods.markAttendance = function(userId, attended = true) {
  const attendee = this.attendees.find(a => 
    a.user.toString() === userId.toString()
  );
  
  if (attendee) {
    attendee.attended = attended;
    return this.save();
  }
  
  return Promise.resolve(this);
};

module.exports = mongoose.model('Event', eventSchema);

