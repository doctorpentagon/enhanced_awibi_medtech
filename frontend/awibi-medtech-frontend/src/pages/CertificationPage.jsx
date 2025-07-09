import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Award, BookOpen, CheckCircle, Clock } from 'lucide-react';

const CertificationPage = () => {
  const certifications = [
    {
      id: 1,
      title: 'Healthcare Technology Fundamentals',
      description: 'Learn the basics of medical technology and digital health',
      duration: '4 weeks',
      level: 'Beginner',
      status: 'Available',
    },
    {
      id: 2,
      title: 'AI in Medical Diagnosis',
      description: 'Advanced course on artificial intelligence applications in healthcare',
      duration: '6 weeks',
      level: 'Advanced',
      status: 'Coming Soon',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Certification</h1>
        <p className="text-gray-600 mt-2">
          Advance your career with AWIBI MEDTECH certifications
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <Card key={cert.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="secondary">{cert.level}</Badge>
                <Badge variant={cert.status === 'Available' ? 'default' : 'secondary'}>
                  {cert.status}
                </Badge>
              </div>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                {cert.title}
              </CardTitle>
              <CardDescription>{cert.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {cert.duration}
                </div>
                <Button 
                  className="w-full" 
                  disabled={cert.status !== 'Available'}
                >
                  {cert.status === 'Available' ? 'Enroll Now' : 'Coming Soon'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">More Certifications Coming Soon</h3>
            <p className="text-gray-600 mb-4">
              We're developing comprehensive certification programs to help you advance your career in medical technology.
            </p>
            <Button variant="outline">
              Get Notified
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CertificationPage;

