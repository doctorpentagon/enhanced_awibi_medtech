import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Users, Calendar, Award, MapPin, ArrowRight, Play, CheckCircle,
  Globe, Heart, Lightbulb, Search, Mail, Phone, Linkedin, Youtube, Instagram, X,
} from 'lucide-react';

// Import components
import SearchableEventsList from '../components/SearchableEventsList';
import SearchableChaptersList from '../components/SearchableChaptersList';

// Import images
import heroImage from '../assets/doctor-patient-and-black-man-with-tablet-hospita-2023-11-27-05-04-20-utc.png';
import aboutUsImage from '../assets/d.png';
import impactImage1 from '../assets/a.png';
import impactImage2 from '../assets/b.png';
import impactImage3 from '../assets/e.png';
import impactImage4 from '../assets/c.png';
import trendingNews1 from '../assets/images.png';
import trendingNews2 from '../assets/images-1.png';
import trendingNews3 from '../assets/doctor-patient-and-black-man-with-tablet-hospita-2023-11-27-05-04-20-utc-1.png';
import testimonial1 from '../assets/user.png';
import testimonial2 from '../assets/leader.png';
import logoImage from '../assets/logo.png';
import metricsImage from '../assets/metrics.png';

const HomePage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Community Members', value: '2000 +', icon: Users },
    { label: 'Countries', value: '15+', icon: Globe },
  ];

  const trendingNews = [
    {
      id: 1,
      title: 'Awibi Chapters Lead Breakthrough in Global MedTech Hackathon 2025',
      description: 'Latest collaboration between Lagos and Nairobi chapters results in affordable mobile testing device for rural communities',
      image: trendingNews1,
      link: '#',
    },
    {
      id: 2,
      title: 'Awibi Launches New AI-Powered Learning Platform',
      description: 'Join 1000+ innovators worldwide for our largest virtual healthcare innovation challenge yet',
      image: trendingNews2,
      link: '#',
    },
    {
      id: 3,
      title: 'Portable Diagnostics Registration Now Open',
      description: 'Access personalized medical technology courses and connect with mentors through our enhanced digital education hub',
      image: trendingNews3,
      link: '#',
    },
  ];

  const testimonials = [
    {
      id: 1,
      text: '"We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want."',
      author: 'Jenny Wilson',
      company: 'Grower.io',
      image: testimonial1,
    },
    {
      id: 2,
      text: '"We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want."',
      author: 'Devon Lane',
      company: 'DLDesign.co',
      image: testimonial2,
    },
    {
      id: 3,
      text: '"We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want."',
      author: 'Jenny Wilson',
      company: 'Grower.io',
      image: testimonial1,
    },
    {
      id: 4,
      text: '"We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want."',
      author: 'Devon Lane',
      company: 'DLDesign.co',
      image: testimonial2,
    },
  ];

  const socialLinks = [
    { name: 'Youtube', icon: Youtube, description: 'Subscribe to join a community of Innovators and learn the latest in Health technology', link: '#' },
    { name: 'Instagram', icon: Instagram, description: 'Follow and discover Health resources, community events, and inspirational stories', link: '#' },
    { name: 'Linkedin', icon: Linkedin, description: 'Join a community of creative innovators and learn how to use the latest in technology.', link: 'https://www.linkedin.com/company/awibimedtech/' },
    { name: 'X', icon: X, description: 'Join the conversation to discover the latest tools, resources, and events,', link: '#' },
  ];

  const quickLinks = [
    { name: 'Home', link: '/' },
    { name: 'Chapters', link: '/chapters' },
    { name: 'Community', link: '/community' },
    { name: 'Events', link: '/events' },
    { name: 'Certification', link: '/certification' },
    { name: 'Privacy', link: '/privacy' },
    { name: 'Terms', link: '/terms' },
  ];

  const partners = [
    { name: 'Layers', logo: 'https://via.placeholder.com/100x50?text=Layers' },
    { name: 'Sisyphus', logo: 'https://via.placeholder.com/100x50?text=Sisyphus' },
    { name: 'Circooles', logo: 'https://via.placeholder.com/100x50?text=Circooles' },
    { name: 'Catalog', logo: 'https://via.placeholder.com/100x50?text=Catalog' },
    { name: 'Quotient', logo: 'https://via.placeholder.com/100x50?text=Quotient' },
  ];

  const impactMilestones = [
    { title: 'Lagos Chapter Launch', type: 'Event', date: 'January, 2025', image: impactImage1 },
    { title: 'Pan-African MedTech Hackathon', type: 'Hackathon', date: 'March, 2024', image: impactImage2 },
    { title: 'Educational Platform Milestone', type: 'Milestone', date: 'August, 2024', image: impactImage3 },
    { title: 'Healthcare Innovation Award', type: 'Award', date: 'February, 2025', image: impactImage4 },
    { title: 'Afya-Scan: From Concept to Implementation', type: 'Project', date: 'September, 2025', image: impactImage1 }, // Reusing image for now
  ];

  const awibiMetrics = [
    { value: '5,000+', label: 'Community members' },
    { value: '320+', label: 'Medtech Projects Launched' },
    { value: '45+', label: 'Geographical Reach' },
    { value: '850+', label: 'Educational Events Annually' },
    { value: '150+', label: 'Excellence Badge Awarded' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-base py-1 px-3">
                  🚀 Transforming Healthcare Through Technology
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Empowering The
                  <span className="text-blue-600"> Future of MedTech</span>
                  <br />
                  Innovation
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Connect with passionate innovators worldwide as we build a future
                  where medical technology breaks barriers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  onClick={() => navigate('/register')}
                >
                  Join Our Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-lg text-gray-700">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <img
                src={heroImage}
                alt="Healthcare Technology"
                className="rounded-2xl shadow-2xl w-full max-w-lg lg:max-w-none h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-gray-700 mb-8">
            Proudly supported by diverse industry leaders who believe in advancing healthcare innovation
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {partners.map((partner, index) => (
              <img key={index} src={partner.logo} alt={partner.name} className="h-10 opacity-75 hover:opacity-100 transition-opacity" />
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative flex justify-center lg:justify-start">
              <img
                src={aboutUsImage}
                alt="About Us"
                className="rounded-2xl shadow-2xl w-full max-w-lg lg:max-w-none h-auto object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wider">About us</h2>
              <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                AWIBI MedTech
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                AWIBI Medtech Foundation unites Healthcare innovators globally, providing resources and education to
                advance medical technology through collaborative effort.
              </p>
              <ul className="space-y-3 text-lg text-gray-700">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-600 mr-2" /> Foster Innovation</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-600 mr-2" /> Support Healthcare Solutions</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-600 mr-2" /> Provide Education & Resources</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-blue-600 mr-2" /> Recognize Contributions</li>
              </ul>
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-800 px-0 text-lg"
                onClick={() => navigate('/community')}
              >
                Learn more <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Find Events Near You Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SearchableEventsList 
            showSearch={true}
            maxEvents={4}
            featuredOnly={true}
            title="Find Events Near You"
            showViewAll={true}
          />
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our impact
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover our milestones and success stories since the inception of our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactMilestones.map((milestone, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img src={milestone.image} alt={milestone.title} className="w-full h-48 object-cover" />
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-2">{milestone.type}</Badge>
                  <CardTitle className="text-xl mb-2">{milestone.title}</CardTitle>
                  <CardDescription className="text-gray-600">{milestone.date}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SearchableChaptersList 
            showSearch={true}
            maxChapters={8}
            title="Chapters"
            subtitle="Where Medical Innovators Unite: Discover a Chapter Near You"
            showViewAll={true}
            showMap={true}
          />
        </div>
      </section>

      {/* Trending News Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trending News
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingNews.map((news) => (
              <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2">{news.title}</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">{news.description}</CardDescription>
                  <Button asChild variant="link" className="px-0 text-blue-600 hover:text-blue-800">
                    <Link to={news.link}>Learn more <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AWIBI Medtech Metrics Section */}
      <section className="py-20 bg-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-base font-semibold uppercase tracking-wider text-blue-200">AWIBI</h2>
              <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                AWIBI Medtech Foundation is a community-driven organization that connects students, researchers, and
                professionals worldwide, providing education, resources, and mentorship to advance medical
                technology innovation while fostering collaboration and recognizing contributions through its global
                network of healthcare enthusiasts.
              </h3>
              <Button
                variant="link"
                className="text-blue-200 hover:text-white px-0 text-lg"
                onClick={() => navigate('/community')}
              >
                Learn more <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <img
                src={metricsImage}
                alt="AWIBI Medtech Metrics"
                className="rounded-2xl shadow-2xl w-full max-w-lg lg:max-w-none h-auto object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-16">
            {awibiMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-blue-200 mb-2">{metric.value}</div>
                <div className="text-lg text-blue-100">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Don't just take our words
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">{testimonial.text}</p>
                  <div className="flex items-center">
                    <img src={testimonial.image} alt={testimonial.author} className="h-12 w-12 rounded-full object-cover mr-4" />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Join Community Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Be Part of Our Global Healthcare Innovation Community
          </h2>
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-3 text-lg"
              onClick={() => navigate('/chapters')}
            >
              Join AWIBI Medtech Community today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img src={logoImage} alt="Awibi MedTech Logo" className="h-10" />
            <p className="text-gray-400">AWIBI MedTech Foundation</p>
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail className="h-5 w-5" />
              <span>awibihealth@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Phone className="h-5 w-5" />
              <span>+2348177790294</span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.link} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Socials</h4>
            <ul className="space-y-2">
              {socialLinks.map((social, index) => (
                <li key={index}>
                  <a href={social.link} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                    <social.icon className="h-5 w-5 mr-2" /> {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.link} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center">
                  <social.icon className="h-8 w-8 text-white mx-auto mb-2" />
                  <p className="text-sm font-medium">{social.name}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500">
          © Copyright 2025, All Rights Reserved by Awibi Medtech
        </div>
      </footer>
    </div>
  );
};

export default HomePage;


