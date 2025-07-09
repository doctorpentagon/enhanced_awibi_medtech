// Comprehensive AWIBI MedTech badges system
export const badges = [
  // Achievement Badges
  {
    id: 1,
    name: 'Community Pioneer',
    slug: 'community-pioneer',
    description: 'Awarded to founding members who helped establish their local chapter',
    category: 'Achievement',
    subcategory: 'Leadership',
    icon: '🏆',
    image: '/src/assets/badges/community-pioneer.png',
    rarity: 'Epic',
    level: 5,
    points: 500,
    isActive: true,
    criteria: 'Be among the first 10 members to join a newly established chapter',
    requirements: {
      minEvents: 0,
      minChapters: 1,
      minPoints: 0,
      specificActions: ['Join chapter within first month of establishment'],
      timeframe: '30 days'
    },
    rewards: {
      points: 500,
      privileges: ['Early access to events', 'Special recognition'],
      discounts: [
        { type: 'Event Registration', value: 25, description: '25% off all event registrations' }
      ]
    },
    stats: {
      totalAwarded: 45,
      uniqueRecipients: 45
    }
  },
  {
    id: 2,
    name: 'Innovation Champion',
    slug: 'innovation-champion',
    description: 'Recognizes outstanding contributions to healthcare innovation',
    category: 'Achievement',
    subcategory: 'Innovation',
    icon: '💡',
    image: '/src/assets/badges/innovation-champion.png',
    rarity: 'Legendary',
    level: 5,
    points: 1000,
    isActive: true,
    criteria: 'Successfully develop and present an innovative healthcare solution',
    requirements: {
      minEvents: 3,
      minChapters: 1,
      minPoints: 200,
      specificActions: ['Present at innovation showcase', 'Receive community votes'],
      timeframe: '6 months'
    },
    rewards: {
      points: 1000,
      privileges: ['Mentorship opportunities', 'Speaking engagements'],
      discounts: [
        { type: 'Summit Registration', value: 50, description: '50% off summit registrations' }
      ]
    },
    stats: {
      totalAwarded: 12,
      uniqueRecipients: 12
    }
  },
  {
    id: 3,
    name: 'Research Excellence',
    slug: 'research-excellence',
    description: 'Awarded for outstanding research contributions in medical technology',
    category: 'Achievement',
    subcategory: 'Research',
    icon: '🔬',
    image: '/src/assets/badges/research-excellence.png',
    rarity: 'Epic',
    level: 4,
    points: 750,
    isActive: true,
    criteria: 'Publish peer-reviewed research or present at major conference',
    requirements: {
      minEvents: 2,
      minChapters: 1,
      minPoints: 150,
      specificActions: ['Submit research paper', 'Present findings'],
      timeframe: '12 months'
    },
    rewards: {
      points: 750,
      privileges: ['Research collaboration opportunities'],
      discounts: [
        { type: 'Conference Registration', value: 40, description: '40% off conference registrations' }
      ]
    },
    stats: {
      totalAwarded: 28,
      uniqueRecipients: 28
    }
  },

  // Participation Badges
  {
    id: 4,
    name: 'Event Enthusiast',
    slug: 'event-enthusiast',
    description: 'Active participant in community events',
    category: 'Participation',
    subcategory: 'Engagement',
    icon: '🎯',
    image: '/src/assets/badges/event-enthusiast.png',
    rarity: 'Common',
    level: 2,
    points: 100,
    isActive: true,
    criteria: 'Attend 5 or more events within a year',
    requirements: {
      minEvents: 5,
      minChapters: 1,
      minPoints: 0,
      specificActions: ['Attend events regularly'],
      timeframe: '12 months'
    },
    rewards: {
      points: 100,
      privileges: ['Priority event notifications'],
      discounts: [
        { type: 'Event Registration', value: 10, description: '10% off future event registrations' }
      ]
    },
    stats: {
      totalAwarded: 234,
      uniqueRecipients: 234
    }
  },
  {
    id: 5,
    name: 'Networking Pro',
    slug: 'networking-pro',
    description: 'Exceptional networking and community building skills',
    category: 'Participation',
    subcategory: 'Networking',
    icon: '🤝',
    image: '/src/assets/badges/networking-pro.png',
    rarity: 'Uncommon',
    level: 3,
    points: 200,
    isActive: true,
    criteria: 'Connect with 25+ community members and attend networking events',
    requirements: {
      minEvents: 3,
      minChapters: 1,
      minPoints: 50,
      specificActions: ['Attend networking events', 'Make meaningful connections'],
      timeframe: '6 months'
    },
    rewards: {
      points: 200,
      privileges: ['Access to exclusive networking events'],
      discounts: [
        { type: 'Mixer Events', value: 20, description: '20% off mixer event registrations' }
      ]
    },
    stats: {
      totalAwarded: 156,
      uniqueRecipients: 156
    }
  },
  {
    id: 6,
    name: 'Hackathon Hero',
    slug: 'hackathon-hero',
    description: 'Outstanding performance in hackathon competitions',
    category: 'Participation',
    subcategory: 'Competition',
    icon: '⚡',
    image: '/src/assets/badges/hackathon-hero.png',
    rarity: 'Rare',
    level: 4,
    points: 400,
    isActive: true,
    criteria: 'Win or place in top 3 of a hackathon competition',
    requirements: {
      minEvents: 1,
      minChapters: 1,
      minPoints: 0,
      specificActions: ['Participate in hackathon', 'Achieve top 3 placement'],
      timeframe: 'Per competition'
    },
    rewards: {
      points: 400,
      privileges: ['Hackathon judge opportunities', 'Mentorship access'],
      discounts: [
        { type: 'Hackathon Registration', value: 30, description: '30% off future hackathon registrations' }
      ]
    },
    stats: {
      totalAwarded: 67,
      uniqueRecipients: 67
    }
  },

  // Leadership Badges
  {
    id: 7,
    name: 'Chapter Leader',
    slug: 'chapter-leader',
    description: 'Recognized leader of a local AWIBI chapter',
    category: 'Leadership',
    subcategory: 'Management',
    icon: '👑',
    image: '/src/assets/badges/chapter-leader.png',
    rarity: 'Epic',
    level: 5,
    points: 800,
    isActive: true,
    criteria: 'Appointed as official chapter leader',
    requirements: {
      minEvents: 5,
      minChapters: 1,
      minPoints: 300,
      specificActions: ['Demonstrate leadership skills', 'Community nomination'],
      timeframe: 'Ongoing'
    },
    rewards: {
      points: 800,
      privileges: ['Chapter management access', 'Leadership training'],
      discounts: [
        { type: 'Leadership Events', value: 50, description: '50% off leadership development events' }
      ]
    },
    stats: {
      totalAwarded: 42,
      uniqueRecipients: 42
    }
  },
  {
    id: 8,
    name: 'Mentor Master',
    slug: 'mentor-master',
    description: 'Dedicated mentor helping others in their journey',
    category: 'Leadership',
    subcategory: 'Mentorship',
    icon: '🎓',
    image: '/src/assets/badges/mentor-master.png',
    rarity: 'Rare',
    level: 4,
    points: 600,
    isActive: true,
    criteria: 'Successfully mentor 5+ community members',
    requirements: {
      minEvents: 3,
      minChapters: 1,
      minPoints: 200,
      specificActions: ['Complete mentor training', 'Mentor community members'],
      timeframe: '12 months'
    },
    rewards: {
      points: 600,
      privileges: ['Advanced mentorship programs', 'Mentor recognition'],
      discounts: [
        { type: 'Training Programs', value: 35, description: '35% off professional training programs' }
      ]
    },
    stats: {
      totalAwarded: 89,
      uniqueRecipients: 89
    }
  },
  {
    id: 9,
    name: 'Event Organizer',
    slug: 'event-organizer',
    description: 'Successfully organized community events',
    category: 'Leadership',
    subcategory: 'Organization',
    icon: '📅',
    image: '/src/assets/badges/event-organizer.png',
    rarity: 'Uncommon',
    level: 3,
    points: 300,
    isActive: true,
    criteria: 'Organize and execute successful community events',
    requirements: {
      minEvents: 2,
      minChapters: 1,
      minPoints: 100,
      specificActions: ['Plan and execute events', 'Receive positive feedback'],
      timeframe: '6 months'
    },
    rewards: {
      points: 300,
      privileges: ['Event planning resources', 'Organizer network access'],
      discounts: [
        { type: 'Event Supplies', value: 25, description: '25% off event planning supplies' }
      ]
    },
    stats: {
      totalAwarded: 123,
      uniqueRecipients: 123
    }
  },

  // Learning Badges
  {
    id: 10,
    name: 'Knowledge Seeker',
    slug: 'knowledge-seeker',
    description: 'Committed to continuous learning and development',
    category: 'Learning',
    subcategory: 'Education',
    icon: '📚',
    image: '/src/assets/badges/knowledge-seeker.png',
    rarity: 'Common',
    level: 2,
    points: 150,
    isActive: true,
    criteria: 'Complete educational workshops and training sessions',
    requirements: {
      minEvents: 3,
      minChapters: 1,
      minPoints: 0,
      specificActions: ['Attend workshops', 'Complete training modules'],
      timeframe: '6 months'
    },
    rewards: {
      points: 150,
      privileges: ['Access to advanced courses'],
      discounts: [
        { type: 'Educational Content', value: 15, description: '15% off educational materials' }
      ]
    },
    stats: {
      totalAwarded: 345,
      uniqueRecipients: 345
    }
  },
  {
    id: 11,
    name: 'Certification Master',
    slug: 'certification-master',
    description: 'Achieved multiple professional certifications',
    category: 'Learning',
    subcategory: 'Certification',
    icon: '🏅',
    image: '/src/assets/badges/certification-master.png',
    rarity: 'Rare',
    level: 4,
    points: 500,
    isActive: true,
    criteria: 'Earn 3 or more professional certifications',
    requirements: {
      minEvents: 2,
      minChapters: 1,
      minPoints: 200,
      specificActions: ['Complete certification programs', 'Pass examinations'],
      timeframe: '18 months'
    },
    rewards: {
      points: 500,
      privileges: ['Certification pathway guidance'],
      discounts: [
        { type: 'Certification Exams', value: 30, description: '30% off certification exam fees' }
      ]
    },
    stats: {
      totalAwarded: 78,
      uniqueRecipients: 78
    }
  },

  // Community Badges
  {
    id: 12,
    name: 'Community Builder',
    slug: 'community-builder',
    description: 'Actively contributes to community growth and engagement',
    category: 'Community',
    subcategory: 'Growth',
    icon: '🏗️',
    image: '/src/assets/badges/community-builder.png',
    rarity: 'Uncommon',
    level: 3,
    points: 250,
    isActive: true,
    criteria: 'Recruit new members and foster community engagement',
    requirements: {
      minEvents: 2,
      minChapters: 1,
      minPoints: 100,
      specificActions: ['Recruit new members', 'Organize community activities'],
      timeframe: '6 months'
    },
    rewards: {
      points: 250,
      privileges: ['Community recognition', 'Growth metrics access'],
      discounts: [
        { type: 'Community Events', value: 20, description: '20% off community event registrations' }
      ]
    },
    stats: {
      totalAwarded: 167,
      uniqueRecipients: 167
    }
  },
  {
    id: 13,
    name: 'Global Connector',
    slug: 'global-connector',
    description: 'Bridges connections across multiple chapters and regions',
    category: 'Community',
    subcategory: 'Global',
    icon: '🌍',
    image: '/src/assets/badges/global-connector.png',
    rarity: 'Epic',
    level: 5,
    points: 700,
    isActive: true,
    criteria: 'Active in multiple chapters across different regions',
    requirements: {
      minEvents: 5,
      minChapters: 3,
      minPoints: 300,
      specificActions: ['Join multiple chapters', 'Facilitate cross-chapter collaboration'],
      timeframe: '12 months'
    },
    rewards: {
      points: 700,
      privileges: ['Global network access', 'International event invitations'],
      discounts: [
        { type: 'International Events', value: 40, description: '40% off international event registrations' }
      ]
    },
    stats: {
      totalAwarded: 23,
      uniqueRecipients: 23
    }
  },

  // Contribution Badges
  {
    id: 14,
    name: 'Content Creator',
    slug: 'content-creator',
    description: 'Creates valuable content for the community',
    category: 'Contribution',
    subcategory: 'Content',
    icon: '✍️',
    image: '/src/assets/badges/content-creator.png',
    rarity: 'Uncommon',
    level: 3,
    points: 300,
    isActive: true,
    criteria: 'Publish articles, tutorials, or educational content',
    requirements: {
      minEvents: 1,
      minChapters: 1,
      minPoints: 50,
      specificActions: ['Create and publish content', 'Receive community engagement'],
      timeframe: '6 months'
    },
    rewards: {
      points: 300,
      privileges: ['Content platform access', 'Creator recognition'],
      discounts: [
        { type: 'Publishing Tools', value: 25, description: '25% off content creation tools' }
      ]
    },
    stats: {
      totalAwarded: 134,
      uniqueRecipients: 134
    }
  },
  {
    id: 15,
    name: 'Open Source Hero',
    slug: 'open-source-hero',
    description: 'Contributes to open source healthcare projects',
    category: 'Contribution',
    subcategory: 'Development',
    icon: '💻',
    image: '/src/assets/badges/open-source-hero.png',
    rarity: 'Rare',
    level: 4,
    points: 450,
    isActive: true,
    criteria: 'Make significant contributions to open source projects',
    requirements: {
      minEvents: 1,
      minChapters: 1,
      minPoints: 100,
      specificActions: ['Contribute code', 'Maintain projects', 'Help others'],
      timeframe: '12 months'
    },
    rewards: {
      points: 450,
      privileges: ['Developer community access', 'Project collaboration'],
      discounts: [
        { type: 'Developer Tools', value: 35, description: '35% off development tools and resources' }
      ]
    },
    stats: {
      totalAwarded: 56,
      uniqueRecipients: 56
    }
  }
];

// Function to search badges
export const searchBadges = (searchTerm) => {
  if (!searchTerm) return badges;
  
  const term = searchTerm.toLowerCase();
  return badges.filter(badge =>
    badge.name.toLowerCase().includes(term) ||
    badge.description.toLowerCase().includes(term) ||
    badge.category.toLowerCase().includes(term) ||
    badge.subcategory.toLowerCase().includes(term) ||
    badge.criteria.toLowerCase().includes(term)
  );
};

// Function to get badges by category
export const getBadgesByCategory = (category) => {
  return badges.filter(badge => badge.category === category);
};

// Function to get badges by rarity
export const getBadgesByRarity = (rarity) => {
  return badges.filter(badge => badge.rarity === rarity);
};

// Function to get badges by level
export const getBadgesByLevel = (level) => {
  return badges.filter(badge => badge.level === level);
};

// Function to get active badges
export const getActiveBadges = () => {
  return badges.filter(badge => badge.isActive);
};

// Function to get all categories
export const getAllBadgeCategories = () => {
  return [...new Set(badges.map(badge => badge.category))].sort();
};

// Function to get all rarities
export const getAllBadgeRarities = () => {
  return [...new Set(badges.map(badge => badge.rarity))].sort();
};

// Function to get all subcategories
export const getAllBadgeSubcategories = () => {
  return [...new Set(badges.map(badge => badge.subcategory))].sort();
};

// Function to calculate user badge progress
export const calculateBadgeProgress = (userStats, badge) => {
  const progress = {
    eligible: true,
    completed: 0,
    total: 0,
    percentage: 0,
    missing: []
  };

  // Check event requirements
  if (badge.requirements.minEvents > 0) {
    progress.total++;
    if (userStats.eventsAttended >= badge.requirements.minEvents) {
      progress.completed++;
    } else {
      progress.eligible = false;
      progress.missing.push(`Attend ${badge.requirements.minEvents - userStats.eventsAttended} more events`);
    }
  }

  // Check chapter requirements
  if (badge.requirements.minChapters > 0) {
    progress.total++;
    if (userStats.chaptersJoined >= badge.requirements.minChapters) {
      progress.completed++;
    } else {
      progress.eligible = false;
      progress.missing.push(`Join ${badge.requirements.minChapters - userStats.chaptersJoined} more chapters`);
    }
  }

  // Check points requirements
  if (badge.requirements.minPoints > 0) {
    progress.total++;
    if (userStats.totalPoints >= badge.requirements.minPoints) {
      progress.completed++;
    } else {
      progress.eligible = false;
      progress.missing.push(`Earn ${badge.requirements.minPoints - userStats.totalPoints} more points`);
    }
  }

  // Check specific actions
  if (badge.requirements.specificActions && badge.requirements.specificActions.length > 0) {
    progress.total += badge.requirements.specificActions.length;
    // This would need to be checked against user's actual actions
    // For now, we'll assume they need to complete all specific actions
    progress.missing.push(...badge.requirements.specificActions.map(action => `Complete: ${action}`));
  }

  progress.percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return progress;
};

// Function to get recommended badges for user
export const getRecommendedBadges = (userStats, userBadges = []) => {
  const earnedBadgeIds = userBadges.map(badge => badge.id);
  const availableBadges = badges.filter(badge => 
    badge.isActive && !earnedBadgeIds.includes(badge.id)
  );

  return availableBadges
    .map(badge => ({
      ...badge,
      progress: calculateBadgeProgress(userStats, badge)
    }))
    .sort((a, b) => b.progress.percentage - a.progress.percentage)
    .slice(0, 5); // Return top 5 recommendations
};

// Function to get badge statistics
export const getBadgeStatistics = () => {
  const stats = {
    total: badges.length,
    active: badges.filter(b => b.isActive).length,
    byCategory: {},
    byRarity: {},
    byLevel: {},
    totalAwarded: badges.reduce((sum, badge) => sum + badge.stats.totalAwarded, 0),
    uniqueRecipients: badges.reduce((sum, badge) => sum + badge.stats.uniqueRecipients, 0)
  };

  // Group by category
  badges.forEach(badge => {
    stats.byCategory[badge.category] = (stats.byCategory[badge.category] || 0) + 1;
  });

  // Group by rarity
  badges.forEach(badge => {
    stats.byRarity[badge.rarity] = (stats.byRarity[badge.rarity] || 0) + 1;
  });

  // Group by level
  badges.forEach(badge => {
    stats.byLevel[badge.level] = (stats.byLevel[badge.level] || 0) + 1;
  });

  return stats;
};

export default badges;

