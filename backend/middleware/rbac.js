const User = require('../models/User');

// Role hierarchy for permission checking
const ROLE_HIERARCHY = {
  'Member': 0,
  'Coordinator': 1,
  'Leader': 2,
  'Ambassador': 3,
  'Admin': 4,
  'Superadmin': 5,
};

// Permission definitions
const PERMISSIONS = {
  // Member permissions
  'view_profile': ['Member', 'Coordinator', 'Leader', 'Ambassador', 'Admin', 'Superadmin'],
  'edit_own_profile': ['Member', 'Coordinator', 'Leader', 'Ambassador', 'Admin', 'Superadmin'],
  'view_chapters': ['Member', 'Coordinator', 'Leader', 'Ambassador', 'Admin', 'Superadmin'],
  'join_chapter': ['Member', 'Coordinator', 'Leader', 'Ambassador', 'Admin', 'Superadmin'],
  
  // Coordinator permissions
  'view_chapter_members': ['Coordinator', 'Leader', 'Ambassador', 'Admin', 'Superadmin'],
  
  // Leader permissions
  'manage_chapter_members': ['Leader', 'Ambassador', 'Admin', 'Superadmin'],
  'create_events': ['Leader', 'Ambassador', 'Admin', 'Superadmin'],
  'edit_events': ['Leader', 'Ambassador', 'Admin', 'Superadmin'],
  'delete_events': ['Leader', 'Ambassador', 'Admin', 'Superadmin'],
  'send_bulk_emails': ['Leader', 'Ambassador', 'Admin', 'Superadmin'],
  'award_badges': ['Leader', 'Ambassador', 'Admin', 'Superadmin'],
  'view_chapter_analytics': ['Leader', 'Ambassador', 'Admin', 'Superadmin'],
  
  // Ambassador permissions (same as Leader but across multiple chapters)
  'manage_multiple_chapters': ['Ambassador', 'Admin', 'Superadmin'],
  
  // Admin permissions
  'view_all_members': ['Admin', 'Superadmin'],
  'manage_all_members': ['Admin', 'Superadmin'],
  'manage_chapters': ['Admin', 'Superadmin'],
  'create_chapters': ['Admin', 'Superadmin'],
  'delete_chapters': ['Admin', 'Superadmin'],
  'manage_badges': ['Admin', 'Superadmin'],
  'view_system_analytics': ['Admin', 'Superadmin'],
  
  // Superadmin permissions
  'manage_roles': ['Superadmin'],
  'manage_admins': ['Superadmin'],
  'system_settings': ['Superadmin'],
  'approve_role_applications': ['Superadmin'],
  'manage_permissions': ['Superadmin'],
};

/**
 * Check if user has required permission
 * @param {string} permission - Permission to check
 * @returns {Function} Express middleware function
 */
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const userRole = req.user.role;
      const allowedRoles = PERMISSIONS[permission];

      if (!allowedRoles) {
        return res.status(500).json({
          success: false,
          message: 'Invalid permission specified',
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          required: permission,
          userRole: userRole,
        });
      }

      next();
    } catch (error) {
      console.error('RBAC Error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission check failed',
      });
    }
  };
};

/**
 * Check if user has any of the required roles
 * @param {Array} roles - Array of roles to check
 * @returns {Function} Express middleware function
 */
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const userRole = req.user.role;

      if (!roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient role permissions',
          required: roles,
          userRole: userRole,
        });
      }

      next();
    } catch (error) {
      console.error('Role Check Error:', error);
      res.status(500).json({
        success: false,
        message: 'Role check failed',
      });
    }
  };
};

/**
 * Check if user has minimum role level
 * @param {string} minRole - Minimum role required
 * @returns {Function} Express middleware function
 */
const requireMinRole = (minRole) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const userRoleLevel = ROLE_HIERARCHY[req.user.role];
      const minRoleLevel = ROLE_HIERARCHY[minRole];

      if (userRoleLevel < minRoleLevel) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient role level',
          required: minRole,
          userRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      console.error('Min Role Check Error:', error);
      res.status(500).json({
        success: false,
        message: 'Role level check failed',
      });
    }
  };
};

/**
 * Check if user can manage specific chapter
 * @param {string} chapterIdParam - Parameter name containing chapter ID
 * @returns {Function} Express middleware function
 */
const canManageChapter = (chapterIdParam = 'chapterId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const chapterId = req.params[chapterIdParam];
      const userRole = req.user.role;

      // Superadmin and Admin can manage any chapter
      if (['Superadmin', 'Admin'].includes(userRole)) {
        return next();
      }

      // Leaders and Ambassadors can only manage their assigned chapters
      if (['Leader', 'Ambassador'].includes(userRole)) {
        const user = await User.findById(req.user.id).populate('leadershipInfo.managedChapters');
        
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found',
          });
        }

        const managedChapterIds = user.leadershipInfo.managedChapters.map(chapter => chapter._id.toString());
        
        if (!managedChapterIds.includes(chapterId)) {
          return res.status(403).json({
            success: false,
            message: 'You can only manage chapters you are assigned to',
          });
        }

        return next();
      }

      // Other roles cannot manage chapters
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to manage chapters',
      });

    } catch (error) {
      console.error('Chapter Management Check Error:', error);
      res.status(500).json({
        success: false,
        message: 'Chapter management check failed',
      });
    }
  };
};

/**
 * Check if user can access their own resource or has admin privileges
 * @param {string} userIdParam - Parameter name containing user ID
 * @returns {Function} Express middleware function
 */
const canAccessUserResource = (userIdParam = 'userId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const targetUserId = req.params[userIdParam];
      const currentUserId = req.user.id;
      const userRole = req.user.role;

      // Users can access their own resources
      if (targetUserId === currentUserId) {
        return next();
      }

      // Admins and Superadmins can access any user resource
      if (['Admin', 'Superadmin'].includes(userRole)) {
        return next();
      }

      // Leaders can access resources of their chapter members
      if (['Leader', 'Ambassador'].includes(userRole)) {
        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId).populate('leadershipInfo.managedChapters');

        if (!targetUser || !currentUser) {
          return res.status(404).json({
            success: false,
            message: 'User not found',
          });
        }

        const managedChapterIds = currentUser.leadershipInfo.managedChapters.map(chapter => chapter._id.toString());
        const targetUserChapterIds = targetUser.chapters.map(chapter => chapter.chapter.toString());

        const hasCommonChapter = managedChapterIds.some(chapterId => 
          targetUserChapterIds.includes(chapterId)
        );

        if (hasCommonChapter) {
          return next();
        }
      }

      return res.status(403).json({
        success: false,
        message: 'You can only access your own resources',
      });

    } catch (error) {
      console.error('User Resource Access Check Error:', error);
      res.status(500).json({
        success: false,
        message: 'Resource access check failed',
      });
    }
  };
};

/**
 * Get user permissions based on role
 * @param {string} role - User role
 * @returns {Array} Array of permissions
 */
const getUserPermissions = (role) => {
  const userPermissions = [];
  
  for (const [permission, allowedRoles] of Object.entries(PERMISSIONS)) {
    if (allowedRoles.includes(role)) {
      userPermissions.push(permission);
    }
  }
  
  return userPermissions;
};

/**
 * Check if role can be assigned by current user
 * @param {string} currentUserRole - Current user's role
 * @param {string} targetRole - Role to be assigned
 * @returns {boolean} Whether the role can be assigned
 */
const canAssignRole = (currentUserRole, targetRole) => {
  const currentLevel = ROLE_HIERARCHY[currentUserRole];
  const targetLevel = ROLE_HIERARCHY[targetRole];
  
  // Superadmin can assign any role
  if (currentUserRole === 'Superadmin') {
    return true;
  }
  
  // Admin can assign roles below Admin level
  if (currentUserRole === 'Admin' && targetLevel < ROLE_HIERARCHY['Admin']) {
    return true;
  }
  
  // Leaders can only promote to Coordinator
  if (currentUserRole === 'Leader' && targetRole === 'Coordinator') {
    return true;
  }
  
  return false;
};

module.exports = {
  requirePermission,
  requireRole,
  requireMinRole,
  canManageChapter,
  canAccessUserResource,
  getUserPermissions,
  canAssignRole,
  PERMISSIONS,
  ROLE_HIERARCHY,
};

