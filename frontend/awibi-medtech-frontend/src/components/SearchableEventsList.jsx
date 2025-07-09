import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import { searchEvents, getFeaturedEvents } from '../data/events';

const SearchableEventsList = ({ 
  showSearch = true, 
  maxEvents = 4, 
  featuredOnly = false,
  title = "Find Events Near You",
  showViewAll = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = useMemo(() => {
    let eventsToShow = featuredOnly ? getFeaturedEvents() : searchEvents(searchTerm);
    return eventsToShow.slice(0, maxEvents);
  }, [searchTerm, maxEvents, featuredOnly]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{title}</h2>
          {showSearch && (
            <div className="max-w-md mx-auto flex items-center border border-gray-300 rounded-full bg-white shadow-sm overflow-hidden">
              <Input
                type="text"
                placeholder="Search for an Event or Location"
                className="flex-grow border-none focus:ring-0 focus:outline-none px-5 py-3 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="h-6 w-6 text-gray-500 mr-4" />
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="w-fit">{event.type}</Badge>
                  <div className="text-sm text-gray-500">
                    {formatDate(event.date)}
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" /> 
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" /> 
                    {event.location}, {event.country}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" /> 
                    {event.attendees} attendees
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/events/${event.id}`}>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No events found matching your search.' : 'No events available.'}
            </p>
          </div>
        )}
      </div>

      {showViewAll && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="text-lg px-8 py-3"
          >
            <Link to="/events">
              Check out all events →
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchableEventsList;

