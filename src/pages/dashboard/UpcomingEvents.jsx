/**
 * @author: S M Samiul Hasan
 * @file: UpcomingEvents.jsx
 * @description: This React component displays a list of upcoming volunteer events with filtering and sorting.
 * All rights reserved by S M Samiul Hasan.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faStar,
  faChevronDown,
  faChevronUp,
  faCheckCircle,
  faEye
} from '@fortawesome/free-solid-svg-icons';

const UpcomingEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState('any');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        let eventsData = [];
        
        if (data.data && Array.isArray(data.data)) {
          eventsData = data.data;
        } else if (data.events && Array.isArray(data.events)) {
          eventsData = data.events;
        } else if (Array.isArray(data)) {
          eventsData = data;
        } else if (typeof data === 'object' && data !== null) {
          eventsData = [data];
        } else {
          throw new Error('Invalid data format received from API');
        }
        
        const normalizedEvents = eventsData.map(event => ({
          id: event.eventId || event._id,
          ...event
        }));
        
        setEvents(normalizedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'cleanup', name: 'Cleanup' },
    { id: 'environment', name: 'Environment' },
    { id: 'education', name: 'Education' },
    { id: 'community', name: 'Community Service' },
    { id: 'healthcare', name: 'Healthcare' }
  ];

  const distanceOptions = [
    { id: 'any', name: 'Any Distance' },
    { id: '5km', name: 'Within 5 km' },
    { id: '10km', name: 'Within 10 km' },
    { id: '15km', name: 'Within 15 km' }
  ];

  const sortOptions = [
    { id: 'date', name: 'Date (Soonest)' },
    { id: 'distance', name: 'Distance (Nearest)' },
    { id: 'volunteers', name: 'Most Volunteers' },
    { id: 'recommended', name: 'Recommended' }
  ];

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'volunteers':
          return (b.volunteers || 0) - (a.volunteers || 0);
        case 'recommended':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      cleanup: 'bg-blue-100 text-blue-800',
      environment: 'bg-green-100 text-green-800',
      education: 'bg-purple-100 text-purple-800',
      community: 'bg-orange-100 text-orange-800',
      healthcare: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getVolunteerProgress = (volunteers, maxVolunteers) => {
    const volunteersCount = volunteers || 0;
    const maxVolunteersCount = maxVolunteers || 1;
    return Math.min((volunteersCount / maxVolunteersCount) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="mt-4 text-gray-600"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading events...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center bg-white p-8 rounded-lg shadow-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Events</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          <p className="mt-2 text-gray-600">Discover and join community service events near you</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events, organizations, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FontAwesomeIcon icon={faFilter} className="h-4 w-4 mr-2" />
                Filters
                <FontAwesomeIcon 
                  icon={showFilters ? faChevronUp : faChevronDown} 
                  className="h-4 w-4 ml-2" 
                />
              </motion.button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="mt-4 pt-4 border-t border-gray-200"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distance
                    </label>
                    <select
                      value={distanceFilter}
                      onChange={(e) => setDistanceFilter(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
                    >
                      {distanceOptions.map(option => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <motion.button
                      onClick={() => {
                        setSelectedCategory('all');
                        setDistanceFilter('any');
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reset Filters
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {filteredEvents.filter(event => (event.rating || 0) >= 4.5).length > 0 && (
          <motion.div 
            className="mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faStar} className="h-5 w-5 mr-2 text-yellow-500" />
              Recommended For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEvents
                  .filter(event => (event.rating || 0) >= 4.5)
                  .slice(0, 3)
                  .map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <EventCard 
                        event={event} 
                        onViewDetails={handleViewDetails}
                        getCategoryColor={getCategoryColor}
                        getVolunteerProgress={getVolunteerProgress}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Upcoming Events ({filteredEvents.length})
          </h2>
          
          {filteredEvents.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FontAwesomeIcon icon={faSearch} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find more events.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    layout
                  >
                    <EventCard 
                      event={event} 
                      onViewDetails={handleViewDetails}
                      getCategoryColor={getCategoryColor}
                      getVolunteerProgress={getVolunteerProgress}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const EventCard = ({ event, onViewDetails, getCategoryColor, getVolunteerProgress }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className="h-48 relative cursor-pointer overflow-hidden"
        onClick={() => onViewDetails(event.id)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Rendering Logic */}
        {event.images && event.images.length > 0 ? (
          <img 
            src={event.images[0]} 
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Fallback Gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 ${
            event.images && event.images.length > 0 ? 'hidden' : 'block'
          }`}
        ></div>

        {event.verified && (
          <motion.div 
            className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 mr-1" />
            Verified
          </motion.div>
        )}
        {(event.rating || 0) >= 4.5 && (
          <motion.div 
            className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FontAwesomeIcon icon={faStar} className="h-3 w-3 mr-1" />
            Recommended
          </motion.div>
        )}
        <motion.div 
          className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs z-10"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {(event.rating || 0).toFixed(1)} ★ ({event.reviews || 0})
        </motion.div>
      </motion.div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <motion.span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {event.category?.charAt(0).toUpperCase() + event.category?.slice(1) || 'General'}
          </motion.span>
          <motion.span 
            className="text-sm text-gray-500 flex items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3 mr-1" />
            {event.location?.split(',')[0] || 'Location'}
          </motion.span>
        </div>

        <motion.h3 
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-green-600"
          onClick={() => onViewDetails(event.id)}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {event.title || 'Untitled Event'}
        </motion.h3>

        <motion.p 
          className="text-gray-600 text-sm mb-3"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {event.organization || 'Unknown Organization'}
        </motion.p>

        <motion.div 
          className="space-y-2 mb-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center text-gray-500 text-sm">
            <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2" />
            {event.date ? new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            }) : 'Date not set'}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-2" />
            {event.time || 'Time not set'} {event.endTime && `- ${event.endTime}`}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2" />
            <span className="truncate">{event.location || 'Location not specified'}</span>
          </div>
        </motion.div>

        <motion.div 
          className="mb-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Volunteers</span>
            <span>{(event.volunteers || 0)}/{(event.maxVolunteers || 10)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getVolunteerProgress(event.volunteers, event.maxVolunteers)}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
        </motion.div>

        <motion.button
          onClick={() => onViewDetails(event.id)}
          className="w-full py-3 px-4 border border-green-600 rounded-md text-sm font-medium text-green-600 bg-white hover:bg-green-50 transition duration-300 flex items-center justify-center"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ 
            scale: 1.02,
            backgroundColor: "#dcfce7",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <FontAwesomeIcon icon={faEye} className="h-4 w-4 mr-2" />
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UpcomingEvents;