// Dashboard data and utilities for AWIBI MedTech platform
import { demoUsers } from './users.js';
import { events } from './events.js';
import { chapters } from './chapters.js';
import { badges } from './badges.js';

// Dashboard metrics and analytics
export const dashboardMetrics = {
  platform: {
    totalUsers: 2847,
    activeUsers: 2634,
    totalChapters: 40,
    activeChapters: 38,
    totalEvents: 156,
    upcomingEvents: 23,
    totalBadges: 15,
    badgesAwarded: 1247
  },
  growth: {
    newUsersThisMonth: 234,
    newChaptersThisMonth: 3,
    newEventsThisMonth: 12,
    userGrowthRate: 8.9, // percentage
    chapterGrowthRate: 8.1,
    eventGrowthRate: 15.2
  },
  engagement: {
    averageEventsPerUser: 5.4,
    averageBadgesPerUser: 2.1,
    averageChaptersPerUser: 1.3,
    monthlyActiveUsers: 1876,
    weeklyActiveUsers: 1234,
    dailyActiveUsers: 456
  },
  regional: {
    'West Africa': {
      users: 1456,
      chapters: 18,
      events: 67,
      growth: 12.3
    },
    'East Africa': {
      users: 678,
      chapters: 8,
      events: 34,
      growth: 15.7
    },
    'Southern Africa': {
      users: 423,
      chapters: 6,
      events: 28,
      growth: 9.8
    },
    'North Africa': {
      users: 234,
      chapters: 4,
      events: 18,
      growth: 11.2
    },
    'International': {
      users: 156,
      chapters: 4,
      events: 9,
      growth: 7.4
    }
  }
};

// Recent activities for dashboard
export const recentActivities = [
  {
    id: 1,
    type: 'user_joined',
    title: 'New Member Joined',
    description: 'Kemi Adebayo joined AMT Lagos chapter',
    timestamp: '2025-01-09T10:30:00Z',
    icon: '👋',
    user: { name: 'Kemi Adebayo', avatar: '/src/assets/users/kemi.jpg' },
    chapter: 'AMT Lagos'
  },
  {
    id: 2,
    type: 'event_created',
    title: 'New Event Created',
    description: 'AI in Healthcare Symposium scheduled for Cape Town',
    timestamp: '2025-01-09T09:15:00Z',
    icon: '📅',
    event: 'AI in Healthcare Symposium',
    location: 'Cape Town'
  },
  {
    id: 3,
    type: 'badge_awarded',
    title: 'Badge Awarded',
    description: 'Innovation Champion badge awarded to 3 members',
    timestamp: '2025-01-09T08:45:00Z',
    icon: '🏆',
    badge: 'Innovation Champion',
    count: 3
  },
  {
    id: 4,
    type: 'chapter_milestone',
    title: 'Chapter Milestone',
    description: 'AMT Nairobi reached 150 members',
    timestamp: '2025-01-08T16:20:00Z',
    icon: '🎯',
    chapter: 'AMT Nairobi',
    milestone: '150 members'
  },
  {
    id: 5,
    type: 'event_completed',
    title: 'Event Completed',
    description: 'MedTech Hackathon Series concluded successfully',
    timestamp: '2025-01-08T14:30:00Z',
    icon: '✅',
    event: 'MedTech Hackathon Series',
    attendees: 120
  }
];

// Notifications for dashboard
export const notifications = [
  {
    id: 1,
    type: 'event_reminder',
    title: 'Event Reminder',
    message: 'African MedTech Innovation Summit starts in 2 days',
    timestamp: '2025-01-09T12:00:00Z',
    read: false,
    priority: 'high',
    actionUrl: '/events/5'
  },
  {
    id: 2,
    type: 'badge_available',
    title: 'Badge Available',
    message: 'You\'re eligible for the Event Enthusiast badge',
    timestamp: '2025-01-09T10:30:00Z',
    read: false,
    priority: 'medium',
    actionUrl: '/badges/4'
  },
  {
    id: 3,
    type: 'chapter_invitation',
    title: 'Chapter Invitation',
    message: 'You\'ve been invited to join AMT Kumasi',
    timestamp: '2025-01-08T18:45:00Z',
    read: true,
    priority: 'medium',
    actionUrl: '/chapters/12'
  },
  {
    id: 4,
    type: 'mentorship_request',
    title: 'Mentorship Request',
    message: 'David Osei has requested mentorship',
    timestamp: '2025-01-08T15:20:00Z',
    read: true,
    priority: 'low',
    actionUrl: '/mentorship/requests'
  },
  {
    id: 5,
    type: 'system_update',
    title: 'System Update',
    message: 'New features added to the platform',
    timestamp: '2025-01-07T09:00:00Z',
    read: true,
    priority: 'low',
    actionUrl: '/updates'
  }
];

// Quick stats for different user roles
export const getQuickStats = (userRole, userId) => {
  const baseStats = {
    member: {
      eventsAttended: 0,
      chaptersJoined: 0,
      badgesEarned: 0,
      totalPoints: 0,
      upcomingEvents: 0,
      connections: 0
    },
    leader: {
      eventsOrganized: 0,
      chaptersLed: 0,
      membersManaged: 0,
      totalPoints: 0,
      upcomingEvents: 0,
      mentoringSessions: 0
    },
    admin: {
      totalUsers: dashboardMetrics.platform.totalUsers,
      totalChapters: dashboardMetrics.platform.totalChapters,
      totalEvents: dashboardMetrics.platform.totalEvents,
      pendingApprovals: 12,
      systemHealth: 98.5,
      monthlyGrowth: dashboardMetrics.growth.userGrowthRate
    },
    superadmin: {
      platformUsers: dashboardMetrics.platform.totalUsers,
      globalChapters: dashboardMetrics.platform.totalChapters,
      systemMetrics: 'Healthy',
      revenue: '$45,230',
      serverUptime: '99.9%',
      dataBackups: 'Current'
    }
  };

  return baseStats[userRole] || baseStats.member;
};

// Dashboard widgets configuration
export const dashboardWidgets = {
  member: [
    { id: 'quick-stats', title: 'Quick Stats', type: 'stats', size: 'large' },
    { id: 'upcoming-events', title: 'Upcoming Events', type: 'events', size: 'medium' },
    { id: 'my-chapters', title: 'My Chapters', type: 'chapters', size: 'medium' },
    { id: 'recent-badges', title: 'Recent Badges', type: 'badges', size: 'small' },
    { id: 'activity-feed', title: 'Activity Feed', type: 'activity', size: 'large' },
    { id: 'recommended-events', title: 'Recommended Events', type: 'recommendations', size: 'medium' }
  ],
  leader: [
    { id: 'leadership-stats', title: 'Leadership Stats', type: 'stats', size: 'large' },
    { id: 'chapter-management', title: 'Chapter Management', type: 'management', size: 'large' },
    { id: 'event-organization', title: 'Event Organization', type: 'events', size: 'medium' },
    { id: 'member-activity', title: 'Member Activity', type: 'analytics', size: 'medium' },
    { id: 'mentorship-queue', title: 'Mentorship Queue', type: 'mentorship', size: 'small' },
    { id: 'chapter-growth', title: 'Chapter Growth', type: 'growth', size: 'medium' }
  ],
  admin: [
    { id: 'platform-overview', title: 'Platform Overview', type: 'overview', size: 'large' },
    { id: 'user-management', title: 'User Management', type: 'users', size: 'large' },
    { id: 'chapter-oversight', title: 'Chapter Oversight', type: 'chapters', size: 'medium' },
    { id: 'event-approval', title: 'Event Approval', type: 'approvals', size: 'medium' },
    { id: 'system-health', title: 'System Health', type: 'health', size: 'small' },
    { id: 'analytics-dashboard', title: 'Analytics Dashboard', type: 'analytics', size: 'large' }
  ],
  superadmin: [
    { id: 'global-metrics', title: 'Global Metrics', type: 'metrics', size: 'large' },
    { id: 'system-administration', title: 'System Administration', type: 'system', size: 'large' },
    { id: 'financial-overview', title: 'Financial Overview', type: 'financial', size: 'medium' },
    { id: 'security-monitoring', title: 'Security Monitoring', type: 'security', size: 'medium' },
    { id: 'backup-status', title: 'Backup Status', type: 'backup', size: 'small' },
    { id: 'global-analytics', title: 'Global Analytics', type: 'analytics', size: 'large' }
  ]
};

// Function to get personalized dashboard data
export const getPersonalizedDashboard = (userId, userRole) => {
  const user = demoUsers.find(u => u.id === userId);
  if (!user) return null;

  const dashboard = {
    user: user,
    quickStats: getQuickStats(userRole, userId),
    widgets: dashboardWidgets[userRole] || dashboardWidgets.member,
    recentActivities: recentActivities.slice(0, 5),
    notifications: notifications.filter(n => !n.read).slice(0, 3),
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).slice(0, 3),
    recommendedBadges: [],
    chapterUpdates: [],
    mentorshipOpportunities: []
  };

  // Add role-specific data
  switch (userRole) {
    case 'leader':
      dashboard.chaptersLed = user.chapters.filter(c => ['Lead', 'Co-Lead'].includes(c.role));
      dashboard.memberStats = {
        totalMembers: 156,
        newMembers: 12,
        activeMembers: 134
      };
      break;
    
    case 'admin':
      dashboard.pendingApprovals = [
        { type: 'chapter', name: 'AMT Douala', status: 'pending' },
        { type: 'event', name: 'Health Innovation Workshop', status: 'pending' },
        { type: 'user', name: 'John Smith', status: 'pending' }
      ];
      dashboard.systemAlerts = [
        { type: 'info', message: 'System maintenance scheduled for this weekend' },
        { type: 'warning', message: 'High server load detected' }
      ];
      break;
    
    case 'superadmin':
      dashboard.globalMetrics = dashboardMetrics;
      dashboard.systemStatus = {
        servers: 'Healthy',
        database: 'Optimal',
        cdn: 'Operational',
        backups: 'Current'
      };
      break;
  }

  return dashboard;
};

// Function to get dashboard analytics
export const getDashboardAnalytics = (timeframe = '30d') => {
  const analytics = {
    userGrowth: [
      { date: '2024-12-01', users: 2456 },
      { date: '2024-12-08', users: 2523 },
      { date: '2024-12-15', users: 2634 },
      { date: '2024-12-22', users: 2712 },
      { date: '2024-12-29', users: 2789 },
      { date: '2025-01-05', users: 2847 }
    ],
    eventAttendance: [
      { month: 'Sep', attendance: 1234 },
      { month: 'Oct', attendance: 1456 },
      { month: 'Nov', attendance: 1678 },
      { month: 'Dec', attendance: 1834 },
      { month: 'Jan', attendance: 1923 }
    ],
    chapterActivity: [
      { region: 'West Africa', activity: 85 },
      { region: 'East Africa', activity: 78 },
      { region: 'Southern Africa', activity: 72 },
      { region: 'North Africa', activity: 68 },
      { region: 'International', activity: 65 }
    ],
    badgeDistribution: [
      { category: 'Achievement', count: 456 },
      { category: 'Participation', count: 389 },
      { category: 'Leadership', count: 234 },
      { category: 'Learning', count: 168 }
    ]
  };

  return analytics;
};

// Function to search dashboard content
export const searchDashboardContent = (query, userRole) => {
  const results = {
    users: [],
    chapters: [],
    events: [],
    badges: [],
    activities: []
  };

  if (!query) return results;

  const searchTerm = query.toLowerCase();

  // Search users (admin/superadmin only)
  if (['admin', 'superadmin'].includes(userRole)) {
    results.users = demoUsers.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    ).slice(0, 5);
  }

  // Search chapters
  results.chapters = chapters.filter(chapter =>
    chapter.name.toLowerCase().includes(searchTerm) ||
    chapter.city.toLowerCase().includes(searchTerm) ||
    chapter.country.toLowerCase().includes(searchTerm)
  ).slice(0, 5);

  // Search events
  results.events = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm) ||
    event.description.toLowerCase().includes(searchTerm) ||
    event.location.toLowerCase().includes(searchTerm)
  ).slice(0, 5);

  // Search badges
  results.badges = badges.filter(badge =>
    badge.name.toLowerCase().includes(searchTerm) ||
    badge.description.toLowerCase().includes(searchTerm) ||
    badge.category.toLowerCase().includes(searchTerm)
  ).slice(0, 5);

  // Search activities
  results.activities = recentActivities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm) ||
    activity.description.toLowerCase().includes(searchTerm)
  ).slice(0, 5);

  return results;
};

// Function to get dashboard filters
export const getDashboardFilters = (userRole) => {
  const baseFilters = {
    timeframe: ['7d', '30d', '90d', '1y', 'all'],
    status: ['active', 'inactive', 'pending'],
    region: ['West Africa', 'East Africa', 'Southern Africa', 'North Africa', 'International']
  };

  const roleSpecificFilters = {
    member: {
      ...baseFilters,
      eventType: ['Summit', 'Workshop', 'Hackathon', 'Mixer', 'Showcase'],
      badgeCategory: ['Achievement', 'Participation', 'Learning', 'Community']
    },
    leader: {
      ...baseFilters,
      chapterType: ['Regional', 'University', 'Corporate'],
      memberRole: ['Member', 'Organizer', 'Lead']
    },
    admin: {
      ...baseFilters,
      userRole: ['member', 'leader', 'admin'],
      approvalStatus: ['pending', 'approved', 'rejected'],
      priority: ['high', 'medium', 'low']
    },
    superadmin: {
      ...baseFilters,
      systemComponent: ['servers', 'database', 'cdn', 'backups'],
      alertLevel: ['info', 'warning', 'error', 'critical']
    }
  };

  return roleSpecificFilters[userRole] || baseFilters;
};

// Function to export dashboard data
export const exportDashboardData = (dataType, format = 'json') => {
  const exportData = {
    users: demoUsers,
    chapters: chapters,
    events: events,
    badges: badges,
    metrics: dashboardMetrics,
    activities: recentActivities
  };

  const data = exportData[dataType] || exportData;

  if (format === 'csv') {
    // Convert to CSV format
    return convertToCSV(data);
  }

  return JSON.stringify(data, null, 2);
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (!Array.isArray(data) || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
};

export default {
  dashboardMetrics,
  recentActivities,
  notifications,
  getQuickStats,
  dashboardWidgets,
  getPersonalizedDashboard,
  getDashboardAnalytics,
  searchDashboardContent,
  getDashboardFilters,
  exportDashboardData
};

