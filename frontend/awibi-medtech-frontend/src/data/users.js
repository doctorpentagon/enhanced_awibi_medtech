// Demo users data for AWIBI MedTech platform
export const demoUsers = [
  {
    id: 1,
    firstName: 'Adaora',
    lastName: 'Okafor',
    email: 'adaora.okafor@example.com',
    role: 'leader',
    avatar: '/src/assets/users/adaora.jpg',
    joinedAt: '2023-08-15',
    lastActive: '2025-01-09',
    isActive: true,
    chapters: [
      { id: 7, name: 'AMT ABUJA', role: 'Lead', joinedAt: '2023-08-15' },
      { id: 1, name: 'AMT ABEOKUTA', role: 'Member', joinedAt: '2024-01-20' }
    ],
    badges: [
      { id: 1, name: 'Community Pioneer', earnedAt: '2023-08-20' },
      { id: 7, name: 'Chapter Leader', earnedAt: '2023-09-01' },
      { id: 8, name: 'Mentor Master', earnedAt: '2024-02-15' }
    ],
    profile: {
      bio: 'Passionate healthcare innovator with 8+ years of experience in medical device development. Leading the charge in making healthcare technology accessible across Africa.',
      location: 'Abuja, Nigeria',
      skills: ['Medical Device Design', 'Healthcare Innovation', 'Team Leadership', 'Project Management'],
      interests: ['Digital Health', 'AI in Healthcare', 'Community Building'],
      education: [
        {
          institution: 'University of Nigeria, Nsukka',
          degree: 'PhD',
          fieldOfStudy: 'Biomedical Engineering',
          startYear: 2015,
          endYear: 2019
        }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/adaora-okafor',
        twitter: 'https://twitter.com/adaora_medtech'
      }
    },
    stats: {
      eventsAttended: 15,
      eventsOrganized: 8,
      chaptersJoined: 2,
      totalPoints: 1850,
      badgesEarned: 3,
      mentorshipSessions: 12
    }
  },
  {
    id: 2,
    firstName: 'Kwame',
    lastName: 'Asante',
    email: 'kwame.asante@example.com',
    role: 'member',
    avatar: '/src/assets/users/kwame.jpg',
    joinedAt: '2024-01-10',
    lastActive: '2025-01-08',
    isActive: true,
    chapters: [
      { id: 11, name: 'AMT ACCRA', role: 'Member', joinedAt: '2024-01-10' }
    ],
    badges: [
      { id: 4, name: 'Event Enthusiast', earnedAt: '2024-06-15' },
      { id: 10, name: 'Knowledge Seeker', earnedAt: '2024-04-20' }
    ],
    profile: {
      bio: 'Software engineer passionate about leveraging technology to solve healthcare challenges in Ghana and across West Africa.',
      location: 'Accra, Ghana',
      skills: ['Software Development', 'Mobile App Development', 'Data Analysis', 'UI/UX Design'],
      interests: ['Health Tech', 'Mobile Health', 'Data Science'],
      education: [
        {
          institution: 'University of Ghana',
          degree: 'BSc',
          fieldOfStudy: 'Computer Science',
          startYear: 2018,
          endYear: 2022
        }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/kwame-asante',
        github: 'https://github.com/kwame-dev'
      }
    },
    stats: {
      eventsAttended: 7,
      eventsOrganized: 1,
      chaptersJoined: 1,
      totalPoints: 450,
      badgesEarned: 2,
      mentorshipSessions: 3
    }
  },
  {
    id: 3,
    firstName: 'Fatima',
    lastName: 'Al-Rashid',
    email: 'fatima.alrashid@example.com',
    role: 'admin',
    avatar: '/src/assets/users/fatima.jpg',
    joinedAt: '2023-09-01',
    lastActive: '2025-01-09',
    isActive: true,
    chapters: [
      { id: 21, name: 'AMT CAIRO', role: 'Lead', joinedAt: '2023-09-01' },
      { id: 22, name: 'AMT ALEXANDRIA', role: 'Member', joinedAt: '2024-03-10' }
    ],
    badges: [
      { id: 1, name: 'Community Pioneer', earnedAt: '2023-09-10' },
      { id: 2, name: 'Innovation Champion', earnedAt: '2024-05-20' },
      { id: 7, name: 'Chapter Leader', earnedAt: '2023-10-01' },
      { id: 3, name: 'Research Excellence', earnedAt: '2024-08-15' }
    ],
    profile: {
      bio: 'Medical researcher and entrepreneur focused on developing innovative diagnostic solutions for resource-limited settings.',
      location: 'Cairo, Egypt',
      skills: ['Medical Research', 'Diagnostic Development', 'Entrepreneurship', 'Strategic Planning'],
      interests: ['Point-of-Care Diagnostics', 'Global Health', 'Innovation Management'],
      education: [
        {
          institution: 'Cairo University',
          degree: 'MD',
          fieldOfStudy: 'Medicine',
          startYear: 2010,
          endYear: 2016
        },
        {
          institution: 'American University in Cairo',
          degree: 'MBA',
          fieldOfStudy: 'Healthcare Management',
          startYear: 2017,
          endYear: 2019
        }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/fatima-alrashid',
        website: 'https://fatima-research.com'
      }
    },
    stats: {
      eventsAttended: 22,
      eventsOrganized: 12,
      chaptersJoined: 2,
      totalPoints: 2650,
      badgesEarned: 4,
      mentorshipSessions: 18
    }
  },
  {
    id: 4,
    firstName: 'Thabo',
    lastName: 'Mthembu',
    email: 'thabo.mthembu@example.com',
    role: 'member',
    avatar: '/src/assets/users/thabo.jpg',
    joinedAt: '2024-02-15',
    lastActive: '2025-01-07',
    isActive: true,
    chapters: [
      { id: 17, name: 'AMT CAPE TOWN', role: 'Member', joinedAt: '2024-02-15' }
    ],
    badges: [
      { id: 6, name: 'Hackathon Hero', earnedAt: '2024-07-10' },
      { id: 15, name: 'Open Source Hero', earnedAt: '2024-09-25' }
    ],
    profile: {
      bio: 'Biomedical engineer and open-source advocate working on affordable medical devices for rural communities.',
      location: 'Cape Town, South Africa',
      skills: ['Biomedical Engineering', 'Open Source Development', '3D Printing', 'Electronics'],
      interests: ['Affordable Medical Devices', 'Rural Healthcare', 'Open Source Hardware'],
      education: [
        {
          institution: 'University of Cape Town',
          degree: 'MEng',
          fieldOfStudy: 'Biomedical Engineering',
          startYear: 2020,
          endYear: 2022
        }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/thabo-mthembu',
        github: 'https://github.com/thabo-biomed'
      }
    },
    stats: {
      eventsAttended: 9,
      eventsOrganized: 2,
      chaptersJoined: 1,
      totalPoints: 720,
      badgesEarned: 2,
      mentorshipSessions: 5
    }
  },
  {
    id: 5,
    firstName: 'Amina',
    lastName: 'Hassan',
    email: 'amina.hassan@example.com',
    role: 'leader',
    avatar: '/src/assets/users/amina.jpg',
    joinedAt: '2023-10-20',
    lastActive: '2025-01-09',
    isActive: true,
    chapters: [
      { id: 14, name: 'AMT NAIROBI', role: 'Co-Lead', joinedAt: '2023-10-20' },
      { id: 25, name: 'AMT ADDIS ABABA', role: 'Member', joinedAt: '2024-05-15' }
    ],
    badges: [
      { id: 1, name: 'Community Pioneer', earnedAt: '2023-11-01' },
      { id: 7, name: 'Chapter Leader', earnedAt: '2024-01-15' },
      { id: 12, name: 'Community Builder', earnedAt: '2024-06-20' },
      { id: 13, name: 'Global Connector', earnedAt: '2024-11-10' }
    ],
    profile: {
      bio: 'Public health specialist and digital health advocate working to improve healthcare access through technology solutions.',
      location: 'Nairobi, Kenya',
      skills: ['Public Health', 'Digital Health', 'Program Management', 'Community Engagement'],
      interests: ['Digital Health Solutions', 'Health Equity', 'Community Health'],
      education: [
        {
          institution: 'University of Nairobi',
          degree: 'MPH',
          fieldOfStudy: 'Public Health',
          startYear: 2018,
          endYear: 2020
        }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/amina-hassan',
        twitter: 'https://twitter.com/amina_digitalhealth'
      }
    },
    stats: {
      eventsAttended: 18,
      eventsOrganized: 10,
      chaptersJoined: 2,
      totalPoints: 1950,
      badgesEarned: 4,
      mentorshipSessions: 15
    }
  },
  {
    id: 6,
    firstName: 'David',
    lastName: 'Osei',
    email: 'david.osei@example.com',
    role: 'member',
    avatar: '/src/assets/users/david.jpg',
    joinedAt: '2024-03-05',
    lastActive: '2025-01-06',
    isActive: true,
    chapters: [
      { id: 4, name: 'AMT UNIVERSITY OF ILORIN', role: 'Member', joinedAt: '2024-03-05' }
    ],
    badges: [
      { id: 10, name: 'Knowledge Seeker', earnedAt: '2024-08-15' },
      { id: 11, name: 'Certification Master', earnedAt: '2024-12-01' }
    ],
    profile: {
      bio: 'Medical student passionate about integrating technology into clinical practice and medical education.',
      location: 'Ilorin, Nigeria',
      skills: ['Clinical Research', 'Medical Education', 'Health Informatics', 'Data Analysis'],
      interests: ['Medical Education Technology', 'Clinical Decision Support', 'Health Informatics'],
      education: [
        {
          institution: 'University of Ilorin',
          degree: 'MBBS',
          fieldOfStudy: 'Medicine and Surgery',
          startYear: 2020,
          endYear: 2026,
          current: true
        }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/david-osei'
      }
    },
    stats: {
      eventsAttended: 6,
      eventsOrganized: 0,
      chaptersJoined: 1,
      totalPoints: 380,
      badgesEarned: 2,
      mentorshipSessions: 2
    }
  }
];

// Function to search users
export const searchUsers = (searchTerm) => {
  if (!searchTerm) return demoUsers;
  
  const term = searchTerm.toLowerCase();
  return demoUsers.filter(user =>
    user.firstName.toLowerCase().includes(term) ||
    user.lastName.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.profile.bio.toLowerCase().includes(term) ||
    user.profile.location.toLowerCase().includes(term) ||
    user.profile.skills.some(skill => skill.toLowerCase().includes(term)) ||
    user.profile.interests.some(interest => interest.toLowerCase().includes(term))
  );
};

// Function to get users by role
export const getUsersByRole = (role) => {
  return demoUsers.filter(user => user.role === role);
};

// Function to get users by chapter
export const getUsersByChapter = (chapterId) => {
  return demoUsers.filter(user => 
    user.chapters.some(chapter => chapter.id === chapterId)
  );
};

// Function to get users by location
export const getUsersByLocation = (location) => {
  return demoUsers.filter(user => 
    user.profile.location.toLowerCase().includes(location.toLowerCase())
  );
};

// Function to get top users by points
export const getTopUsersByPoints = (limit = 10) => {
  return [...demoUsers]
    .sort((a, b) => b.stats.totalPoints - a.stats.totalPoints)
    .slice(0, limit);
};

// Function to get users by badge
export const getUsersByBadge = (badgeId) => {
  return demoUsers.filter(user => 
    user.badges.some(badge => badge.id === badgeId)
  );
};

// Function to get all skills
export const getAllSkills = () => {
  const skills = new Set();
  demoUsers.forEach(user => {
    user.profile.skills.forEach(skill => skills.add(skill));
  });
  return Array.from(skills).sort();
};

// Function to get all interests
export const getAllInterests = () => {
  const interests = new Set();
  demoUsers.forEach(user => {
    user.profile.interests.forEach(interest => interests.add(interest));
  });
  return Array.from(interests).sort();
};

// Function to get user statistics
export const getUserStatistics = () => {
  const stats = {
    total: demoUsers.length,
    active: demoUsers.filter(u => u.isActive).length,
    byRole: {},
    totalPoints: demoUsers.reduce((sum, user) => sum + user.stats.totalPoints, 0),
    totalEvents: demoUsers.reduce((sum, user) => sum + user.stats.eventsAttended, 0),
    totalBadges: demoUsers.reduce((sum, user) => sum + user.stats.badgesEarned, 0),
    averagePointsPerUser: 0,
    averageEventsPerUser: 0,
    averageBadgesPerUser: 0
  };

  // Calculate averages
  if (stats.total > 0) {
    stats.averagePointsPerUser = Math.round(stats.totalPoints / stats.total);
    stats.averageEventsPerUser = Math.round(stats.totalEvents / stats.total);
    stats.averageBadgesPerUser = Math.round(stats.totalBadges / stats.total);
  }

  // Group by role
  demoUsers.forEach(user => {
    stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
  });

  return stats;
};

// Function to get recommended connections for a user
export const getRecommendedConnections = (userId, limit = 5) => {
  const user = demoUsers.find(u => u.id === userId);
  if (!user) return [];

  const userSkills = user.profile.skills;
  const userInterests = user.profile.interests;
  const userChapters = user.chapters.map(c => c.id);

  return demoUsers
    .filter(u => u.id !== userId && u.isActive)
    .map(u => {
      let score = 0;
      
      // Score based on shared skills
      const sharedSkills = u.profile.skills.filter(skill => 
        userSkills.includes(skill)
      ).length;
      score += sharedSkills * 3;
      
      // Score based on shared interests
      const sharedInterests = u.profile.interests.filter(interest => 
        userInterests.includes(interest)
      ).length;
      score += sharedInterests * 2;
      
      // Score based on shared chapters
      const sharedChapters = u.chapters.filter(chapter => 
        userChapters.includes(chapter.id)
      ).length;
      score += sharedChapters * 5;
      
      // Bonus for leaders and admins
      if (['leader', 'admin'].includes(u.role)) {
        score += 2;
      }
      
      return { ...u, connectionScore: score };
    })
    .filter(u => u.connectionScore > 0)
    .sort((a, b) => b.connectionScore - a.connectionScore)
    .slice(0, limit);
};

// Function to get user activity timeline
export const getUserActivityTimeline = (userId) => {
  const user = demoUsers.find(u => u.id === userId);
  if (!user) return [];

  const timeline = [];

  // Add join date
  timeline.push({
    type: 'joined',
    date: user.joinedAt,
    title: 'Joined AWIBI MedTech',
    description: 'Welcome to the community!'
  });

  // Add chapter joins
  user.chapters.forEach(chapter => {
    timeline.push({
      type: 'chapter_joined',
      date: chapter.joinedAt,
      title: `Joined ${chapter.name}`,
      description: `Became a ${chapter.role.toLowerCase()} of the chapter`
    });
  });

  // Add badge earnings
  user.badges.forEach(badge => {
    timeline.push({
      type: 'badge_earned',
      date: badge.earnedAt,
      title: `Earned ${badge.name} Badge`,
      description: 'Achievement unlocked!'
    });
  });

  // Sort by date (newest first)
  return timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export default demoUsers;

