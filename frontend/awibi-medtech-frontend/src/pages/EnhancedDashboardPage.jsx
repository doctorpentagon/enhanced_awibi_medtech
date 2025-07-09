import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  QuickStatsWidget,
  RecentActivitiesWidget,
  NotificationsWidget,
  AnalyticsChartWidget,
  UpcomingEventsWidget,
  MyChaptersWidget,
  BadgesProgressWidget,
  SystemHealthWidget
} from '../components/DashboardWidgets';
import { 
  Users, 
  Calendar, 
  Award, 
  MapPin, 
  Search, 
  Bell, 
  Settings, 
  User, 
  ChevronRight,
  TrendingUp,
  Activity,
  BookOpen,
  Globe,
  BarChart3,
  PieChart,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { api } from '../lib/api';

const EnhancedDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadDashboardData();
  }, [isAuthenticated, navigate, user?.role]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard data based on user role
      const [
        analyticsResponse,
        activitiesResponse,
        eventsResponse,
        chaptersResponse,
        badgesResponse
      ] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/recent-activities'),
        api.get('/events/upcoming'),
        user?.role !== 'member' ? api.get('/chapters') : Promise.resolve({ data: { data: [] } }),
        api.get('/badges')
      ]);

      setDashboardData({
        analytics: analyticsResponse.data.data,
        activities: activitiesResponse.data.data,
        events: eventsResponse.data.data,
        chapters: chaptersResponse.data.data,
        badges: badgesResponse.data.data,
        notifications: [
          {
            id: 1,
            type: 'event_reminder',
            title: 'Event Reminder',
            message: 'African MedTech Innovation Summit starts in 2 days',
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'high'
          },
          {
            id: 2,
            type: 'badge_available',
            title: 'Badge Available',
            message: 'You\'re eligible for the Event Enthusiast badge',
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Use fallback data
      setDashboardData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = () => ({
    analytics: {
      platform: {
        totalUsers: 2847,
        activeUsers: 2634,
        totalChapters: 40,
        activeChapters: 38,
        totalEvents: 156,
        upcomingEvents: 23,
        totalBadges: 15
      },
      growth: {
        newUsersThisMonth: 234,
        userGrowthRate: 8.9,
        chapterGrowthRate: 8.1,
        eventGrowthRate: 15.2
      },
      engagement: {
        averageEventsPerUser: 5.4,
        averageBadgesPerUser: 2.1,
        monthlyActiveUsers: 1876
      }
    },
    activities: [
      {
        id: 1,
        type: 'user_joined',
        title: 'New Member Joined',
        description: 'Kemi Adebayo joined AMT Lagos chapter',
        timestamp: new Date().toISOString()
      }
    ],
    events: [
      {
        id: 1,
        title: 'AI in Healthcare Workshop',
        date: '2025-07-15',
        time: '10:00 AM',
        location: 'Abuja, Nigeria',
        attendees: 45,
        type: 'Workshop'
      }
    ],
    chapters: [],
    badges: [],
    notifications: []
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getQuickStatsData = () => {
    if (!dashboardData?.analytics) return {};
    
    const { platform, engagement } = dashboardData.analytics;
    
    switch (user?.role) {
      case 'admin':
      case 'superadmin':
        return {
          totalUsers: platform.totalUsers,
          totalChapters: platform.totalChapters,
          totalEvents: platform.totalEvents,
          systemHealth: 98.5
        };
      case 'leader':
        return {
          eventsOrganized: 8,
          chaptersLed: 2,
          membersManaged: 156,
          mentoringSessions: 12
        };
      default:
        return {
          eventsAttended: 7,
          chaptersJoined: 2,
          badgesEarned: 3,
          totalPoints: 850
        };
    }
  };

  const getAnalyticsChartData = () => {
    return [
      { name: 'Jan', value: 2400 },
      { name: 'Feb', value: 2600 },
      { name: 'Mar', value: 2800 },
      { name: 'Apr', value: 2700 },
      { name: 'May', value: 2900 },
      { name: 'Jun', value: 3100 }
    ];
  };

  const getRoleBasedActions = () => {
    const actions = {
      member: [
        { label: 'Browse Events', icon: Calendar, action: () => navigate('/events') },
        { label: 'Find Chapters', icon: MapPin, action: () => navigate('/chapters') },
        { label: 'View Certifications', icon: Award, action: () => navigate('/certification') },
        { label: 'Community', icon: Globe, action: () => navigate('/community') }
      ],
      leader: [
        { label: 'Create Event', icon: Plus, action: () => navigate('/events/create') },
        { label: 'Manage Chapter', icon: Settings, action: () => navigate('/chapters/manage') },
        { label: 'View Analytics', icon: BarChart3, action: () => navigate('/analytics') },
        { label: 'Member Directory', icon: Users, action: () => navigate('/members') }
      ],
      admin: [
        { label: 'User Management', icon: Users, action: () => navigate('/admin/users') },
        { label: 'Chapter Oversight', icon: MapPin, action: () => navigate('/admin/chapters') },
        { label: 'Event Approval', icon: Calendar, action: () => navigate('/admin/events') },
        { label: 'System Analytics', icon: BarChart3, action: () => navigate('/admin/analytics') }
      ],
      superadmin: [
        { label: 'Global Metrics', icon: Globe, action: () => navigate('/superadmin/metrics') },
        { label: 'System Admin', icon: Settings, action: () => navigate('/superadmin/system') },
        { label: 'Security Monitor', icon: Activity, action: () => navigate('/superadmin/security') },
        { label: 'Backup Status', icon: Download, action: () => navigate('/superadmin/backups') }
      ]
    };

    return actions[user?.role] || actions.member;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'leader' ? 'Chapter Leader Dashboard' : 
                 user?.role === 'admin' ? 'Administrator Dashboard' :
                 user?.role === 'superadmin' ? 'Super Administrator Dashboard' : 
                 'Community Member Dashboard'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {dashboardData?.notifications?.filter(n => !n.read).length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {dashboardData.notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStatsWidget stats={getQuickStatsData()} userRole={user?.role} />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="management">
                {user?.role === 'admin' || user?.role === 'superadmin' ? 'Admin' : 'My Data'}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search dashboard..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <RecentActivitiesWidget activities={dashboardData?.activities || []} />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {getRoleBasedActions().map((action, index) => (
                        <Button 
                          key={index}
                          variant="outline" 
                          className="h-20 flex flex-col items-center justify-center"
                          onClick={action.action}
                        >
                          <action.icon className="h-6 w-6 mb-2" />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <NotificationsWidget notifications={dashboardData?.notifications || []} />
                <UpcomingEventsWidget events={dashboardData?.events || []} />
                {user?.role === 'member' && (
                  <BadgesProgressWidget badges={dashboardData?.badges || []} />
                )}
                {(user?.role === 'admin' || user?.role === 'superadmin') && (
                  <SystemHealthWidget />
                )}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsChartWidget 
                title="User Growth" 
                data={getAnalyticsChartData()} 
                type="area"
                color="#3B82F6"
              />
              <AnalyticsChartWidget 
                title="Event Attendance" 
                data={getAnalyticsChartData()} 
                type="bar"
                color="#10B981"
              />
              <AnalyticsChartWidget 
                title="Chapter Activity" 
                data={[
                  { name: 'West Africa', value: 45 },
                  { name: 'East Africa', value: 30 },
                  { name: 'Southern Africa', value: 15 },
                  { name: 'North Africa', value: 10 }
                ]} 
                type="pie"
              />
              <AnalyticsChartWidget 
                title="Badge Distribution" 
                data={[
                  { name: 'Achievement', value: 456 },
                  { name: 'Participation', value: 389 },
                  { name: 'Leadership', value: 234 },
                  { name: 'Learning', value: 168 }
                ]} 
                type="bar"
                color="#F59E0B"
              />
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivitiesWidget activities={dashboardData?.activities || []} />
              <UpcomingEventsWidget events={dashboardData?.events || []} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MyChaptersWidget chapters={user?.chapters || []} />
              <BadgesProgressWidget badges={dashboardData?.badges || []} />
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            {(user?.role === 'admin' || user?.role === 'superadmin') ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Users</span>
                        <Badge>{dashboardData?.analytics?.platform?.totalUsers || 0}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Users</span>
                        <Badge variant="secondary">{dashboardData?.analytics?.platform?.activeUsers || 0}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New This Month</span>
                        <Badge variant="outline">{dashboardData?.analytics?.growth?.newUsersThisMonth || 0}</Badge>
                      </div>
                      <Button className="w-full" onClick={() => navigate('/admin/users')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View All Users
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Chapter Oversight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Chapters</span>
                        <Badge>{dashboardData?.analytics?.platform?.totalChapters || 0}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Chapters</span>
                        <Badge variant="secondary">{dashboardData?.analytics?.platform?.activeChapters || 0}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending Approval</span>
                        <Badge variant="outline">3</Badge>
                      </div>
                      <Button className="w-full" onClick={() => navigate('/admin/chapters')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Chapters
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SystemHealthWidget />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MyChaptersWidget chapters={user?.chapters || []} />
                <BadgesProgressWidget badges={dashboardData?.badges || []} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedDashboardPage;

