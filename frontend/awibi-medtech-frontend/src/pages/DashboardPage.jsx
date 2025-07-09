import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
  Globe
} from 'lucide-react';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Mock data for dashboard - in real app, this would come from API
  const dashboardData = {
    stats: {
      totalMembers: 1247,
      activeChapters: 23,
      upcomingEvents: 8,
      certificationsEarned: 156
    },
    recentActivities: [
      {
        id: 1,
        type: 'event',
        title: 'Healthcare Innovation Summit',
        description: 'Registered for upcoming event',
        date: '2025-07-08',
        location: 'Lagos, Nigeria'
      },
      {
        id: 2,
        type: 'chapter',
        title: 'Lagos Chapter',
        description: 'Joined new chapter',
        date: '2025-07-07',
        location: 'Lagos, Nigeria'
      },
      {
        id: 3,
        type: 'certification',
        title: 'Digital Health Fundamentals',
        description: 'Certification completed',
        date: '2025-07-06',
        location: 'Online'
      }
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'AI in Healthcare Workshop',
        date: '2025-07-15',
        time: '10:00 AM',
        location: 'Abuja, Nigeria',
        attendees: 45,
        type: 'Workshop'
      },
      {
        id: 2,
        title: 'Telemedicine Best Practices',
        date: '2025-07-20',
        time: '2:00 PM',
        location: 'Online',
        attendees: 120,
        type: 'Webinar'
      },
      {
        id: 3,
        title: 'Medical Device Innovation',
        date: '2025-07-25',
        time: '9:00 AM',
        location: 'Accra, Ghana',
        attendees: 78,
        type: 'Summit'
      }
    ],
    myChapters: [
      {
        id: 1,
        name: 'Lagos Chapter',
        location: 'Lagos, Nigeria',
        members: 234,
        role: 'Member',
        joinDate: '2025-01-15'
      },
      {
        id: 2,
        name: 'University of Lagos Chapter',
        location: 'Lagos, Nigeria',
        members: 89,
        role: 'Leader',
        joinDate: '2024-09-10'
      }
    ],
    badges: [
      {
        id: 1,
        name: 'Early Adopter',
        description: 'Joined AWIBI MedTech in the first year',
        earned: true,
        earnedDate: '2024-12-01'
      },
      {
        id: 2,
        name: 'Community Builder',
        description: 'Helped grow chapter membership by 50%',
        earned: true,
        earnedDate: '2025-03-15'
      },
      {
        id: 3,
        name: 'Innovation Champion',
        description: 'Presented at 3+ innovation events',
        earned: false,
        progress: 67
      },
      {
        id: 4,
        name: 'Mentor',
        description: 'Mentored 10+ community members',
        earned: false,
        progress: 30
      }
    ]
  };

  const filteredActivities = dashboardData.recentActivities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBasedContent = () => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <MapPin className="h-6 w-6 mb-2" />
                Manage Chapters
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Calendar className="h-6 w-6 mb-2" />
                Manage Events
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-gray-600">
                {user?.role === 'leader' ? 'Chapter Leader' : 
                 user?.role === 'admin' ? 'Administrator' :
                 user?.role === 'super_admin' ? 'Super Administrator' : 'Community Member'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
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
        {/* Admin Content */}
        {getRoleBasedContent()}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalMembers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Chapters</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.activeChapters}</p>
                </div>
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +3 new this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.upcomingEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <Activity className="h-4 w-4 mr-1" />
                Next: July 15
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certifications</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.certificationsEarned}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <BookOpen className="h-4 w-4 mr-1" />
                +8 this month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="chapters">My Chapters</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Activities
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search activities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'event' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'chapter' ? 'bg-green-100 text-green-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {activity.type === 'event' ? <Calendar className="h-4 w-4" /> :
                           activity.type === 'chapter' ? <Users className="h-4 w-4" /> :
                           <Award className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <span>{activity.date}</span>
                            <span className="mx-1">•</span>
                            <span>{activity.location}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => navigate('/events')}>
                      <Calendar className="h-6 w-6 mb-2" />
                      Browse Events
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => navigate('/chapters')}>
                      <MapPin className="h-6 w-6 mb-2" />
                      Find Chapters
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => navigate('/certification')}>
                      <Award className="h-6 w-6 mb-2" />
                      Certifications
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center" onClick={() => navigate('/community')}>
                      <Globe className="h-6 w-6 mb-2" />
                      Community
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events you're registered for or might be interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.upcomingEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{event.date} at {event.time}</span>
                            <span className="mx-2">•</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center mt-2">
                            <Badge variant="secondary">{event.type}</Badge>
                            <span className="ml-2 text-sm text-gray-500">{event.attendees} attendees</span>
                          </div>
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chapters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Chapters</CardTitle>
                <CardDescription>Chapters you're a member of</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.myChapters.map((chapter) => (
                    <div key={chapter.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{chapter.name}</h3>
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{chapter.location}</span>
                            <span className="mx-2">•</span>
                            <Users className="h-4 w-4 mr-1" />
                            <span>{chapter.members} members</span>
                          </div>
                          <div className="flex items-center mt-2">
                            <Badge variant={chapter.role === 'Leader' ? 'default' : 'secondary'}>
                              {chapter.role}
                            </Badge>
                            <span className="ml-2 text-sm text-gray-500">Joined {chapter.joinDate}</span>
                          </div>
                        </div>
                        <Button size="sm">View Chapter</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Badges & Achievements</CardTitle>
                <CardDescription>Track your progress and accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.badges.map((badge) => (
                    <div key={badge.id} className={`border rounded-lg p-4 ${badge.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Award className={`h-6 w-6 mr-2 ${badge.earned ? 'text-green-600' : 'text-gray-400'}`} />
                            <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                          {badge.earned ? (
                            <p className="text-sm text-green-600 mt-2">Earned on {badge.earnedDate}</p>
                          ) : (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Progress</span>
                                <span>{badge.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${badge.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;

