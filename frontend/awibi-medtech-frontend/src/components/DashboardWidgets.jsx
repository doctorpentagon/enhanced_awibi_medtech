import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Users, 
  Calendar, 
  Award, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Bell,
  ChevronRight,
  BarChart3,
  PieChart,
  Globe,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Quick Stats Widget
export const QuickStatsWidget = ({ stats, userRole }) => {
  const getStatsForRole = () => {
    switch (userRole) {
      case 'admin':
      case 'superadmin':
        return [
          { label: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'blue', trend: '+12%' },
          { label: 'Active Chapters', value: stats.totalChapters || 0, icon: MapPin, color: 'green', trend: '+8%' },
          { label: 'Total Events', value: stats.totalEvents || 0, icon: Calendar, color: 'purple', trend: '+15%' },
          { label: 'System Health', value: `${stats.systemHealth || 98}%`, icon: Activity, color: 'emerald', trend: '+0.2%' }
        ];
      case 'leader':
        return [
          { label: 'Events Organized', value: stats.eventsOrganized || 0, icon: Calendar, color: 'blue', trend: '+3' },
          { label: 'Chapters Led', value: stats.chaptersLed || 0, icon: MapPin, color: 'green', trend: '0' },
          { label: 'Members Managed', value: stats.membersManaged || 0, icon: Users, color: 'purple', trend: '+12' },
          { label: 'Mentoring Sessions', value: stats.mentoringSessions || 0, icon: Award, color: 'yellow', trend: '+5' }
        ];
      default:
        return [
          { label: 'Events Attended', value: stats.eventsAttended || 0, icon: Calendar, color: 'blue', trend: '+2' },
          { label: 'Chapters Joined', value: stats.chaptersJoined || 0, icon: MapPin, color: 'green', trend: '0' },
          { label: 'Badges Earned', value: stats.badgesEarned || 0, icon: Award, color: 'yellow', trend: '+1' },
          { label: 'Total Points', value: stats.totalPoints || 0, icon: Star, color: 'purple', trend: '+150' }
        ];
    }
  };

  const statsData = getStatsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              {stat.trend} from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Recent Activities Widget
export const RecentActivitiesWidget = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_joined': return Users;
      case 'event_created': return Calendar;
      case 'badge_awarded': return Award;
      case 'chapter_milestone': return MapPin;
      case 'event_completed': return CheckCircle;
      default: return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_joined': return 'blue';
      case 'event_created': return 'purple';
      case 'badge_awarded': return 'yellow';
      case 'chapter_milestone': return 'green';
      case 'event_completed': return 'emerald';
      default: return 'gray';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activities</p>
            </div>
          ) : (
            activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              const color = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Notifications Widget
export const NotificationsWidget = ({ notifications = [] }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Bell;
      case 'low': return Info;
      default: return Bell;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </div>
          {unreadNotifications.length > 0 && (
            <Badge variant="destructive">{unreadNotifications.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => {
              const IconComponent = getPriorityIcon(notification.priority);
              const color = getPriorityColor(notification.priority);
              
              return (
                <div key={notification.id} className={`p-3 rounded-lg border ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`h-4 w-4 mt-0.5 text-${color}-600`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className={`text-${color}-600 border-${color}-200`}>
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {notifications.length > 5 && (
          <Button variant="outline" className="w-full mt-4">
            View All Notifications
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Analytics Chart Widget
export const AnalyticsChartWidget = ({ title, data, type = 'line', color = '#3B82F6' }) => {
  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.3} />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={color} />
          </BarChart>
        );
      case 'pie':
        const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        return (
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
          </LineChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Upcoming Events Widget
export const UpcomingEventsWidget = ({ events = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No upcoming events</p>
            </div>
          ) : (
            events.slice(0, 3).map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge variant="secondary">{event.type}</Badge>
                      <span className="ml-2 text-sm text-gray-500">{event.attendees} attendees</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            ))
          )}
        </div>
        {events.length > 3 && (
          <Button variant="outline" className="w-full mt-4">
            View All Events
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// My Chapters Widget
export const MyChaptersWidget = ({ chapters = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          My Chapters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chapters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No chapters joined</p>
              <Button variant="outline" className="mt-4">Find Chapters</Button>
            </div>
          ) : (
            chapters.map((chapter) => (
              <div key={chapter.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{chapter.name}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{chapter.city}, {chapter.country}</span>
                      <span className="mx-2">•</span>
                      <Users className="h-4 w-4 mr-1" />
                      <span>{chapter.members} members</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge variant={chapter.role === 'Lead' ? 'default' : 'secondary'}>
                        {chapter.role}
                      </Badge>
                      <span className="ml-2 text-sm text-gray-500">
                        Joined {new Date(chapter.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Badges Progress Widget
export const BadgesProgressWidget = ({ badges = [] }) => {
  const earnedBadges = badges.filter(b => b.earned);
  const inProgressBadges = badges.filter(b => !b.earned && b.progress > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Badges & Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Badges Earned</span>
            <Badge variant="default">{earnedBadges.length}</Badge>
          </div>
          
          {inProgressBadges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">In Progress</h4>
              <div className="space-y-3">
                {inProgressBadges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{badge.name}</span>
                      <span className="text-sm text-gray-500">{badge.progress}%</span>
                    </div>
                    <Progress value={badge.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {earnedBadges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Recent Achievements</h4>
              <div className="space-y-2">
                {earnedBadges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-2 rounded-lg bg-green-50">
                    <Award className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{badge.name}</p>
                      <p className="text-xs text-gray-500">
                        Earned {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// System Health Widget (Admin only)
export const SystemHealthWidget = ({ healthData = {} }) => {
  const healthItems = [
    { name: 'Database', status: healthData.database || 'Healthy', color: 'green' },
    { name: 'API Server', status: healthData.api || 'Healthy', color: 'green' },
    { name: 'File Storage', status: healthData.storage || 'Healthy', color: 'green' },
    { name: 'Email Service', status: healthData.email || 'Warning', color: 'yellow' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.name}</span>
              <Badge variant={item.color === 'green' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Status</span>
            <Badge variant="default">Operational</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

