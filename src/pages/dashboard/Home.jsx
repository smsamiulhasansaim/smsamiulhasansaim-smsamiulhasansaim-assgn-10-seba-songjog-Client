// Home Component - Created by S M Samiul Hasan

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import {
  faSearch,
  faMapMarkerAlt,
  faUsers,
  faTree,
  faTrash,
  faTrophy,
  faCalendarAlt,
  faHeart,
  faArrowRight,
  faStar,
  faClock,
  faCheckCircle,
  faFire,
  faHandHoldingHeart,
  faRecycle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

// Component authored by: S M Samiul Hasan
const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentUser] = useState({
    name: 'John Doe',
    points: 1250,
    level: 'Bronze',
    rank: 15,
    eventsJoined: 8,
    hoursVolunteered: 32
  });

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/api/events/public');

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Invalid response format');
        }

        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const limitedData = data.slice(0, 3);
          setFeaturedEvents(limitedData);
        } else {
          setFeaturedEvents([]);
        }

      } catch (err) {
        console.error('API fetch error:', err);
        setError('ডাটা লোড করতে সমস্যা হচ্ছে');
        setFeaturedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  const stats = [
    { icon: faTree, number: '1,200+', label: 'Trees Planted', color: 'text-green-500' },
    { icon: faTrash, number: '45K+', label: 'Waste Collected (kg)', color: 'text-blue-500' },
    { icon: faUsers, number: '500+', label: 'Active Volunteers', color: 'text-purple-500' },
    { icon: faHeart, number: '150+', label: 'Events Completed', color: 'text-red-500' }
  ];

  const categories = [
    { id: 'all', name: 'All Events', icon: faCalendarAlt, color: 'bg-gray-500' },
    { id: 'environment', name: 'Environment', icon: faTree, color: 'bg-green-500' },
    { id: 'cleanup', name: 'Cleanup', icon: faRecycle, color: 'bg-blue-500' },
    { id: 'education', name: 'Education', icon: faUsers, color: 'bg-purple-500' },
    { id: 'community', name: 'Community', icon: faHandHoldingHeart, color: 'bg-orange-500' }
  ];

  const aiRecommendations = [
    {
      id: 1,
      title: 'Based on your interests',
      events: ['Park Cleanup', 'Local Tree Planting'],
      reason: 'Matches your environmental interests',
      icon: faTree
    },
    {
      id: 2,
      title: 'Near your location',
      events: ['Community Garden', 'Local Cleanup'],
      reason: 'Events within 5km from you',
      icon: faMapMarkerAlt
    }
  ];

  const impactStories = [
    {
      id: 1,
      name: 'Ayesha Rahman',
      role: 'Volunteer',
      story: 'Joined 15+ cleanup events and inspired 10 friends to volunteer!',
      image: '/api/placeholder/100/100',
      points: 2450
    },
    {
      id: 2,
      name: 'Green Bangladesh',
      role: 'Organization',
      story: 'Organized 50+ events, planted 5000+ trees across the country',
      image: '/api/placeholder/100/100',
      events: 50
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      cleanup: 'bg-blue-100 text-blue-800',
      environment: 'bg-green-100 text-green-800',
      education: 'bg-purple-100 text-purple-800',
      community: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level) => {
    const colors = {
      Bronze: 'bg-orange-500',
      Silver: 'bg-gray-400',
      Gold: 'bg-yellow-500',
      Platinum: 'bg-gray-600'
    };
    return colors[level] || 'bg-green-500';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:3000/api/events/public')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedEvents(data.slice(0, 3));
        } else {
          setFeaturedEvents([]);
        }
      })
      .catch(error => {
        error.setError('ডাটা লোড করতে সমস্যা হচ্ছে');
        setFeaturedEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
              variants={itemVariants}
            >
              Connect. Serve. 
              <span className="block text-green-200 mt-2">Make Impact.</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-green-100 max-w-3xl mx-auto px-4"
              variants={itemVariants}
            >
              Join Bangladesh's largest community of volunteers and create meaningful change through AI-powered service opportunities
            </motion.p>
            
            <motion.div 
              className="max-w-2xl mx-auto relative mb-8 md:mb-12 px-4"
              variants={itemVariants}
            >
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row shadow-2xl rounded-lg overflow-hidden">
                <div className="flex-1 relative mb-2 sm:mb-0">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search events, locations, or causes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-gray-800 text-base sm:text-lg focus:outline-none bg-white border border-gray-300"
                  />
                </div>
                <motion.button 
                  type="submit"
                  className="bg-green-500 hover:bg-green-400 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition duration-300 whitespace-nowrap"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Search
                </motion.button>
              </form>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4"
              variants={staggerContainer}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center bg-white bg-opacity-20 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <FontAwesomeIcon icon={stat.icon} className={`h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2 ${stat.color} mx-auto`} />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-black">{stat.number}</div>
                  <div className="text-[#00C950] text-xs sm:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <motion.section 
        className="py-8 sm:py-12 bg-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8 text-white"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Your Volunteer Journey</h2>
                <p className="text-green-100 text-sm sm:text-base">Keep making a difference!</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center mb-4 md:mb-0">
                {[
                  { value: currentUser.points, label: 'Points' },
                  { value: `#${currentUser.rank}`, label: 'Rank' },
                  { value: currentUser.eventsJoined, label: 'Events' },
                  { value: currentUser.hoursVolunteered, label: 'Hours' }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">{item.value}</div>
                    <div className="text-green-100 text-xs sm:text-sm">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 md:mt-0">
                <motion.div 
                  className={`inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-full text-white font-semibold text-sm sm:text-base ${getLevelColor(currentUser.level)}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faTrophy} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {currentUser.level} Level
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="py-8 sm:py-12 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center justify-center sm:justify-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <FontAwesomeIcon icon={faStar} className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-yellow-500" />
            AI Recommendations For You
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {aiRecommendations.map((rec, index) => (
              <motion.div 
                key={rec.id}
                className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-green-200 p-4 sm:p-6"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-start mb-3 sm:mb-4">
                  <FontAwesomeIcon icon={rec.icon} className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2 sm:mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{rec.title}</h3>
                    <p className="text-green-600 text-xs sm:text-sm">✓ {rec.reason}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {rec.events.map((event, eventIndex) => (
                    <motion.div 
                      key={eventIndex}
                      className="flex items-center text-gray-700 bg-green-50 rounded-md sm:rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: eventIndex * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 sm:mr-3" />
                      {event}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-8 sm:py-12 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Browse by Category
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center p-4 sm:p-6 rounded-lg sm:rounded-xl transition duration-300 transform ${
                  activeCategory === category.id
                    ? 'bg-green-500 text-white shadow-xl'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:shadow-lg'
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 ${
                  activeCategory === category.id ? 'bg-white text-green-500' : category.color + ' text-white'
                }`}>
                  <FontAwesomeIcon icon={category.icon} className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-center">{category.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="py-8 sm:py-12 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold text-gray-800"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Featured Events
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <NavLink 
                to="/upcoming-events" 
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition duration-300 font-semibold text-sm sm:text-base flex items-center"
              >
                View All Events
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3 w-3" />
              </NavLink>
            </motion.div>
          </div>

          {loading ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-gray-600">Loading featured events...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">ডাটা লোড করতে সমস্যা হচ্ছে</h3>
              <p className="text-yellow-700 mb-4">দয়া করে আবার চেষ্টা করুন</p>
              <motion.button 
                onClick={retryFetch}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                আবার চেষ্টা করুন
              </motion.button>
            </motion.div>
          ) : featuredEvents.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Featured Events Available</h3>
              <p className="text-gray-500">Currently there are no featured events. Check back later.</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredEvents.map((event, index) => (
                <motion.div 
                  key={event.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-200"
                  variants={cardVariants}
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="h-40 sm:h-48 bg-gradient-to-br from-green-400 to-blue-500 relative">
                    {event.verified && (
                      <motion.div 
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold flex items-center"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Verified
                      </motion.div>
                    )}
                    {event.urgent && (
                      <motion.div 
                        className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold flex items-center"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <FontAwesomeIcon icon={faFire} className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Urgent
                      </motion.div>
                    )}
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-3">{event.organization}</p>

                    <div className="space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <FontAwesomeIcon icon={faClock} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    <div className="mb-3 sm:mb-4">
                      <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                        <span>Volunteers</span>
                        <span>{event.volunteers}/{event.maxVolunteers}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <motion.div 
                          className="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.volunteers / event.maxVolunteers) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <NavLink 
                        to={`/event/${event._id}`}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition duration-300 font-semibold text-sm sm:text-base"
                      >
                        View Details
                      </NavLink>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      <motion.section 
        className="py-8 sm:py-12 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Community Impact Stories
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {impactStories.map((story, index) => (
              <motion.div 
                key={story.id}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <motion.div 
                    className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {story.name.split(' ').map(n => n[0]).join('')}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{story.name}</h3>
                    <p className="text-green-600 text-sm sm:text-base mb-1 sm:mb-2">{story.role}</p>
                    <p className="text-gray-700 text-sm sm:text-base mb-2 sm:mb-3">{story.story}</p>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      {story.points && (
                        <span className="flex items-center mr-3 sm:mr-4">
                          <FontAwesomeIcon icon={faTrophy} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-500" />
                          {story.points} points
                        </span>
                      )}
                      {story.events && (
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" />
                          {story.events} events
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-12 sm:py-16 bg-gradient-to-r from-green-600 to-green-700 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <FontAwesomeIcon icon={faHandHoldingHeart} className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-green-200" />
          </motion.div>
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Make a Difference?
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl mb-6 sm:mb-8 text-green-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Join thousands of volunteers creating positive change in communities across Bangladesh
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <NavLink
                to="/register"
                className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition duration-300 shadow-lg block"
              >
                Join Now - It's Free
              </NavLink>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <NavLink
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition duration-300 block"
              >
                Learn More
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;