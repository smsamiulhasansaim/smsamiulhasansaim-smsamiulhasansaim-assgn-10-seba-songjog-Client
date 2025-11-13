import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSearch,
  faArrowLeft,
  faHeart,
  faMapMarkerAlt,
  faUsers,
  faTree,
  faCompass,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  const quickLinks = [
    {
      name: 'Home',
      href: '/',
      icon: faHome,
      description: 'Return to homepage',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Events',
      href: '/upcoming-events',
      icon: faUsers,
      description: 'Browse all events',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Map',
      href: '/map',
      icon: faMapMarkerAlt,
      description: 'Find events near you',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      icon: faTree,
      description: 'See top volunteers',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const popularEvents = [
    {
      title: 'Beach Cleanup Drive',
      participants: 45,
      location: 'Cox\'s Bazar'
    },
    {
      title: 'Tree Plantation',
      participants: 120,
      location: 'Botanical Garden'
    },
    {
      title: 'Community Food Drive',
      participants: 30,
      location: 'Dhaka City'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center">
        
        {/* Animated 404 Graphic */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-300 opacity-20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="h-32 w-32 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FontAwesomeIcon icon={faCompass} className="h-16 w-16 text-white" />
              </div>
              <div className="flex items-center justify-center text-red-500 mb-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 mr-2" />
                <span className="text-xl font-semibold">Page Not Found</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Oops! You're Lost in Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            The page you're looking for seems to have volunteered elsewhere. 
            But don't worry, there are plenty of ways to make a difference!
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mb-8">
            <div className="flex shadow-lg rounded-full overflow-hidden">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for events, organizations..."
                  className="w-full pl-12 pr-4 py-4 text-gray-800 focus:outline-none"
                />
              </div>
              <button className="bg-green-500 hover:bg-green-600 px-6 text-white font-semibold transition duration-300">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
            <FontAwesomeIcon icon={faHeart} className="h-6 w-6 mr-2 text-red-500" />
            Quick Navigation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 text-left border border-gray-200"
              >
                <div className={`h-12 w-12 bg-gradient-to-r ${link.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <FontAwesomeIcon icon={link.icon} className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{link.name}</h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </a>
            ))}
          </div>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 transition duration-300 shadow-sm hover:shadow-md"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Popular Events Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Popular Events You Might Like
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularEvents.map((event, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200 hover:border-green-300 transition duration-300"
              >
                <h3 className="font-semibold text-gray-800 mb-2">{event.title}</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{event.participants} participants</span>
                  <span>{event.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl text-white p-8">
          <h2 className="text-2xl font-semibold mb-4">Join Our Growing Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-green-100">Active Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">150+</div>
              <div className="text-green-100">Events Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1.2K+</div>
              <div className="text-green-100">Trees Planted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">45K+</div>
              <div className="text-green-100">Waste Collected</div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-gray-500">
          <p>Need help? <a href="/contact" className="text-green-600 hover:text-green-700 underline">Contact our support team</a></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;