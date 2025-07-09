import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Users, Plus } from 'lucide-react';

const ChaptersPage = () => {
  const chapters = [
    {
      id: 1,
      name: 'AMT Lagos',
      city: 'Lagos',
      country: 'Nigeria',
      members: 120,
      type: 'Regional',
      status: 'Active',
    },
    {
      id: 2,
      name: 'AMT Abuja',
      city: 'Abuja',
      country: 'Nigeria',
      members: 85,
      type: 'Regional',
      status: 'Active',
    },
    {
      id: 3,
      name: 'AMT University of Lagos',
      city: 'Lagos',
      country: 'Nigeria',
      members: 200,
      type: 'University',
      status: 'Active',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapters</h1>
          <p className="text-gray-600 mt-2">
            Find and join AWIBI MEDTECH chapters in your area
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Start New Chapter
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => (
          <Card key={chapter.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="secondary">{chapter.type}</Badge>
                <Badge variant={chapter.status === 'Active' ? 'default' : 'secondary'}>
                  {chapter.status}
                </Badge>
              </div>
              <CardTitle>{chapter.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {chapter.city}, {chapter.country}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  {chapter.members} members
                </div>
                <Button variant="outline" size="sm">
                  View Chapter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChaptersPage;

