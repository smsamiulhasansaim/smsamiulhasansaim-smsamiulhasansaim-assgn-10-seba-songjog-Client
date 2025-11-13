/**
 * @author: S M Samiul Hasan
 * @file: Map.jsx
 * @description: This React component displays an interactive map of volunteer events.
 * All rights reserved by S M Samiul Hasan.
 */

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faMapMarkerAlt,
  faCalendarAlt,
  faUsers,
  faClock,
  faHeart,
  faExpand,
  faCompress,
  faLocationArrow,
  faLayerGroup,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const Map = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const mapRef = useRef(null);

  const events = [
    {
      id: 1,
      title: 'Beach Cleanup Drive',
      organization: 'Green Bangladesh',
      date: '2024-01-15',
      time: '08:00 AM',
      location: 'Cox\'s Bazar Beach',
      coordinates: { lat: 21.4272, lng: 92.0058 },
      category: 'cleanup',
      volunteers: 45,
      maxVolunteers: 100,
      verified: true,
      description: 'Join us for a beach cleanup to protect marine life.',
      urgency: 'high'
    },
    {
      id: 2,
      title: 'Tree Plantation Campaign',
      organization: 'Eco Warriors',
      date: '2024-01-20',
      time: '07:00 AM',
      location: 'National Botanical Garden',
      coordinates: { lat: 23.8103, lng: 90.4125 },
      category: 'environment',
      volunteers: 120,
      maxVolunteers: 150,
      verified: true,
      description: 'Help us plant 1000 trees to combat climate change.',
      urgency: 'medium'
    },
    {
      id: 3,
      title: 'Street Children Education',
      organization: 'Shishu Bikash',
      date: '2024-01-18',
      time: '03:00 PM',
      location: 'Dhaka City Center',
      coordinates: { lat: 23.8103, lng: 90.4125 },
      category: 'education',
      volunteers: 25,
      maxVolunteers: 30,
      verified: false,
      description: 'Teach basic literacy to underprivileged children.',
      urgency: 'high'
    },
    {
      id: 4,
      title: 'Elderly Care Program',
      organization: 'Senior Support',
      date: '2024-01-22',
      time: '10:00 AM',
      location: 'Local Elderly Home',
      coordinates: { lat: 23.7943, lng: 90.4153 },
      category: 'community',
      volunteers: 15,
      maxVolunteers: 20,
      verified: true,
      description: 'Spend time with elderly residents.',
      urgency: 'low'
    },
    {
      id: 5,
      title: 'Food Distribution Drive',
      organization: 'Food for All',
      date: '2024-01-25',
      time: '09:00 AM',
      location: 'Community Center',
      coordinates: { lat: 23.7506, lng: 90.3963 },
      category: 'community',
      volunteers: 30,
      maxVolunteers: 50,
      verified: true,
      description: 'Help distribute food packages to families in need.',
      urgency: 'medium'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Events', color: 'bg-gray-500', icon: faLayerGroup },
    { id: 'cleanup', name: 'Cleanup', color: 'bg-blue-500', icon: faMapMarkerAlt },
    { id: 'environment', name: 'Environment', color: 'bg-green-500', icon: faCalendarAlt },
    { id: 'education', name: 'Education', color: 'bg-purple-500', icon: faUsers },
    { id: 'community', name: 'Community', color: 'bg-orange-500', icon: faHeart }
  ];

  const mapTypes = [
    { id: 'standard', name: 'Standard' },
    { id: 'satellite', name: 'Satellite' },
    { id: 'terrain', name: 'Terrain' }
  ];

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ lat: 23.8103, lng: 90.4125 });
        }
      );
    } else {
      setUserLocation({ lat: 23.8103, lng: 90.4125 });
    }
  };

  useEffect(() => {getUserLocation();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    const matchesDate = !selectedDate || event.date === selectedDate;
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const getCategoryColor = (category) => {
    const colors = {
      cleanup: 'bg-blue-500',
      environment: 'bg-green-500',
      education: 'bg-purple-500',
      community: 'bg-orange-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[urgency] || 'bg-gray-500';
  };

  const handleEventClick = (event) => {
    console.log('Event clicked:', event.title);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const centerOnUser = () => {
    getUserLocation();
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : 'py-8'}`}>
      <div className={`${isFullscreen ? 'h-screen' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        
        {!isFullscreen && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Event Map</h1>
            <p className="mt-2 text-gray-600">Discover events near you on an interactive map</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex-1 flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FontAwesomeIcon icon={faFilter} className="h-4 w-4 mr-2" />
                  Filters
                </button>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value)}
                className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                {mapTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>

              <div className="flex space-x-2">
                <button
                  onClick={centerOnUser}
                  className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
                  title="Center on my location"
                >
                  <FontAwesomeIcon icon={faLocationArrow} className="h-4 w-4" />
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={category.icon} 
                      className={`h-3 w-3 mr-1 ${
                        selectedCategory === category.id ? 'text-white' : category.color.replace('bg-', 'text-')
                      }`} 
                    />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 h-96 lg:h-[600px] relative">
              <div 
                ref={mapRef}
                className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden"
              >
                {userLocation && (
                  <div 
                    className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                    title="Your location"
                  >
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
                  </div>
                )}

                {filteredEvents.map((event, index) => {
                  const left = 20 + (index * 15) % 70 + '%';
                  const top = 20 + (index * 25) % 70 + '%';
                  
                  return (
                    <div
                      key={event.id}
                      className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-125 transition-transform duration-200 ${getCategoryColor(event.category)}`}
                      style={{ left, top }}
                      onClick={() => handleEventClick(event)}
                      title={event.title}
                    >
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getUrgencyColor(event.urgency)}`}></div>
                    </div>
                  );
                })}

                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4 mr-2" />
                    Interactive map would be displayed here
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Nearby Events ({filteredEvents.length})
                </h3>
                <p className="text-sm text-gray-600">Events within your area</p>
              </div>
              
              <div className="overflow-y-auto max-h-96 lg:max-h-[536px]">
                {filteredEvents.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No events found in this area</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredEvents.map(event => (
                    <div
                      key={event.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition duration-300"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {event.title}
                        </h4>
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ml-2 ${getCategoryColor(event.category)}`}></span>
                      </div>
                      
                      <p className="text-gray-600 text-xs mb-2">{event.organization}</p>
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faClock} className="h-3 w-3 mr-1" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3 mr-1" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUsers} className="h-3 w-3 mr-1" />
                          {event.volunteers}/{event.maxVolunteers} volunteers
                        </div>
                      </div>

                      <div className="mt-2 flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.urgency === 'high' ? 'bg-red-100 text-red-800' :
                          event.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {event.urgency} priority
                        </span>
                        {event.verified && (
                          <span className="text-green-600 text-xs font-medium flex items-center">
                            <FontAwesomeIcon icon={faHeart} className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium text-gray-700">Legend:</span>
              
              {categories.slice(1).map(category => (
                <div key={category.id} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-1 ${category.color}`}></div>
                  <span className="text-gray-600">{category.name}</span>
                </div>
              ))}
              
              <div className="flex items-center ml-4">
                <div className="w-3 h-3 rounded-full mr-1 bg-blue-600 relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-gray-600">Your Location</span>
              </div>
            </div>
          </div>
        </div>

        {!isFullscreen && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{filteredEvents.length}</div>
              <div className="text-sm text-gray-600">Events Found</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {events.filter(e => e.verified).length}
              </div>
              <div className="text-sm text-gray-600">Verified Events</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.urgency === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {events.reduce((sum, event) => sum + event.volunteers, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Volunteers</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;