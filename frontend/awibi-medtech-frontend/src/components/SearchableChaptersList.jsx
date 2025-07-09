import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { MapPin, Users, Search, ArrowRight } from 'lucide-react';
import { searchChapters, getAllCountries, getAllRegions } from '../data/chapters';
import { useAuth } from '../contexts/AuthContext';

const SearchableChaptersList = ({ 
  showSearch = true, 
  maxChapters = 8, 
  title = "Chapters",
  subtitle = "Where Medical Innovators Unite: Discover a Chapter Near You",
  showViewAll = true,
  showMap = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredChapters = useMemo(() => {
    const chapters = searchChapters(searchTerm);
    return chapters.slice(0, maxChapters);
  }, [searchTerm, maxChapters]);

  const handleJoinChapter = (chapterId) => {
    if (!user) {
      // Redirect to login with return URL
      navigate('/login?returnTo=/chapters');
      return;
    }
    
    // Handle chapter joining logic here
    // This would typically make an API call to join the chapter
    console.log(`Joining chapter ${chapterId}`);
    // You can implement the actual joining logic here
  };

  const getChapterTypeColor = (type) => {
    switch (type) {
      case 'University':
        return 'bg-blue-100 text-blue-800';
      case 'Regional':
        return 'bg-green-100 text-green-800';
      case 'International':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">{subtitle}</p>
          )}
          {showSearch && (
            <div className="max-w-md mx-auto flex items-center border border-gray-300 rounded-full bg-white shadow-sm overflow-hidden">
              <Input
                type="text"
                placeholder="Search for a City, Country, or Region"
                className="flex-grow border-none focus:ring-0 focus:outline-none px-5 py-3 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="h-6 w-6 text-gray-500 mr-4" />
            </div>
          )}
        </div>
      )}

      {showMap && (
        <div className="bg-gray-100 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center mb-8">
          <div className="space-y-4">
            <MapPin className="h-16 w-16 text-blue-600 mx-auto" />
            <p className="text-gray-600 text-lg">Interactive chapter map coming soon!</p>
            <p className="text-gray-500">Explore chapters across Africa and beyond</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center">
          Find Your Local Awibi Medtech Chapter In Africa
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredChapters.length > 0 ? (
            filteredChapters.map((chapter) => (
              <Card key={chapter.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getChapterTypeColor(chapter.type)}>
                      {chapter.type}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <img 
                        src={`https://flagcdn.com/w20/${chapter.country.toLowerCase().replace(/\s+/g, '-')}.png`}
                        alt={`${chapter.country} flag`}
                        className="w-4 h-3 mr-1"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {chapter.country}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{chapter.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" /> 
                      {chapter.city}, {chapter.state}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" /> 
                      {chapter.members} members
                    </div>
                    <div className="text-xs text-gray-500">
                      Est. {new Date(chapter.established).getFullYear()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      <Link to={`/chapters/${chapter.id}`}>View Details</Link>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleJoinChapter(chapter.id)}
                    >
                      {user ? 'Join Chapter' : 'Login to Join'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600 text-lg">
                {searchTerm ? 'No chapters found matching your search.' : 'No chapters available.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showViewAll && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="text-lg px-8 py-3"
          >
            <Link to="/chapters">
              Explore All Chapters <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchableChaptersList;

