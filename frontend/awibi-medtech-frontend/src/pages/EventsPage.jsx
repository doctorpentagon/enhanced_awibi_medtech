import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';

const EventsPage = () => {
  const events = [
    {
      id: 1,
      title: 'AI in Healthcare Summit 2024',
      date: '2024-02-15',
      location: 'Virtual',
      attendees: 250,
      type: 'Summit',
      status: 'Registration Open',
    },
    {
      id: 2,
      title: 'Telemedicine Workshop',
      date: '2024-02-20',
      location: 'Lagos, Nigeria',
      attendees: 80,
      type: 'Workshop',
      status: 'Registration Open',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">
            Discover and join upcoming AWIBI MEDTECH events
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="secondary">{event.type}</Badge>
                <Badge variant="default">{event.status}</Badge>
              </div>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  {event.attendees} attendees
                </div>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;

