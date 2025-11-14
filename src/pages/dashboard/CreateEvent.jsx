// CreateEvent Component - Created by S M Samiul Hasan

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faClock,
  faImage,
  faTag,
  faUpload,
  faPlus,
  faMinus,
  faLightbulb,
  faFileAlt,
  faEnvelope,
  faPhone,
  faGlobe,
  faUser,
  faBuilding,
  faChartBar,
  faCertificate,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

// Component authored by: S M Samiul Hasan
const CreateEvent = () => {
  const { user } = useAuth();
  const [eventData, setEventData] = useState({
    title: '',
    organization: '',
    organizer: '',
    description: '',
    fullDescription: '',
    category: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    coordinates: { lat: '', lng: '' },
    maxVolunteers: '',
    volunteers: 0,
    requirements: [''],
    images: [],
    contact: {
      email: '',
      phone: '',
      website: ''
    },
    verified: false,
    rating: 0,
    reviews: 0,
    impact: {
      wasteCollected: '',
      areaCleaned: '',
      previousParticipants: ''
    },
    liveAttendance: 0,
    points: 0,
    isRecurring: false,
    recurrence: ''
  });

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const categories = [
    'cleanup',
    'environment',
    'education',
    'community',
    'healthcare',
    'animal welfare',
    'elderly care',
    'disaster relief',
    'other'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
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

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const formSectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.title.trim()) {
      newErrors.title = 'Event title is required';
    }
    
    if (!eventData.organization.trim()) {
      newErrors.organization = 'Organization name is required';
    }
    
    if (!eventData.organizer.trim()) {
      newErrors.organizer = 'Organizer name is required';
    }
    
    if (!eventData.description.trim()) {
      newErrors.description = 'Short description is required';
    }
    
    if (!eventData.fullDescription.trim()) {
      newErrors.fullDescription = 'Full description is required';
    }
    
    if (!eventData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!eventData.date) {
      newErrors.date = 'Event date is required';
    }
    
    if (!eventData.time) {
      newErrors.time = 'Start time is required';
    }
    
    if (!eventData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!eventData.maxVolunteers || eventData.maxVolunteers < 1) {
      newErrors.maxVolunteers = 'Maximum volunteers must be at least 1';
    }
    
    if (!eventData.contact.email) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(eventData.contact.email)) {
      newErrors.contactEmail = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setEventData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));

    if (errors[`${parent}${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors(prev => ({
        ...prev,
        [`${parent}${field.charAt(0).toUpperCase() + field.slice(1)}`]: ''
      }));
    }
  };

  const handleCoordinateChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: parseFloat(value) || ''
      }
    }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...eventData.requirements];
    newRequirements[index] = value;
    setEventData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addRequirement = () => {
    setEventData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index) => {
    if (eventData.requirements.length > 1) {
      const newRequirements = eventData.requirements.filter((_, i) => i !== index);
      setEventData(prev => ({
        ...prev,
        requirements: newRequirements
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log('Uploading images:', files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setEventData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const generateAiSuggestions = () => {
    const suggestions = [
      "Beach Cleanup Drive - Protect Marine Life",
      "Tree Plantation Campaign - Create Greener Environment",
      "Street Children Education Program - Provide Educational Support",
      "Community Health Awareness Camp - Spread Health Awareness",
      "Plastic Waste Recycling Workshop - Learn Recycling Techniques",
      "River Cleanup Mission - Protect Water Bodies"
    ];
    setAiSuggestions(suggestions);
    setShowAiSuggestions(true);
  };

  const useAiSuggestion = (suggestion) => {
    setEventData(prev => ({
      ...prev,
      title: suggestion
    }));
    setShowAiSuggestions(false);
  };

  const calculatePoints = (category) => {
    const pointsMap = {
      'cleanup': 50,
      'environment': 40,
      'education': 35,
      'community': 30,
      'healthcare': 45,
      'animal welfare': 35,
      'elderly care': 40,
      'disaster relief': 60,
      'other': 25
    };
    return pointsMap[category] || 25;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      alert('Please log in to create an event');
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);
    
    try {
      const eventPoints = calculatePoints(eventData.category);

      const finalEventData = {
        title: eventData.title || '',
        organization: eventData.organization || '',
        organizer: eventData.organizer || '',
        description: eventData.description || '',
        fullDescription: eventData.fullDescription || '',
        category: eventData.category || 'other',
        date: eventData.date || '',
        time: eventData.time || '',
        endTime: eventData.endTime || '',
        location: eventData.location || '',
        coordinates: {
          lat: parseFloat(eventData.coordinates.lat) || 0,
          lng: parseFloat(eventData.coordinates.lng) || 0
        },
        maxVolunteers: parseInt(eventData.maxVolunteers) || 0,
        volunteers: 0,
        requirements: eventData.requirements.filter(req => req.trim() !== ''),
        images: eventData.images.length > 0 ? eventData.images : ['/api/placeholder/600/400'],
        contact: {
          email: eventData.contact.email || '',
          phone: eventData.contact.phone || '',
          website: eventData.contact.website || ''
        },
        verified: eventData.verified || false,
        rating: 0,
        reviews: 0,
        impact: {
          wasteCollected: eventData.impact.wasteCollected || '',
          areaCleaned: eventData.impact.areaCleaned || '',
          previousParticipants: eventData.impact.previousParticipants || ''
        },
        liveAttendance: 0,
        points: eventPoints,
        isRecurring: eventData.isRecurring || false,
        recurrence: eventData.recurrence || '',
        ownerId: user.uid,
        ownerEmail: user.email,
        ownerName: user.displayName || 'Anonymous',
        visibility: "public"
      };

      console.log('Submitting event data:', finalEventData);

      const eventResponse = await fetch('https://assgn-10-seba-songjog-server.vercel.app/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalEventData)
      });

      if (!eventResponse.ok) {
        const errorData = await eventResponse.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const eventResult = await eventResponse.json();
      console.log('Event created and added to user profile:', eventResult);

      setSuccess(true);
      
      setTimeout(() => {
        setEventData({
          title: '',
          organization: '',
          organizer: '',
          description: '',
          fullDescription: '',
          category: '',
          date: '',
          time: '',
          endTime: '',
          location: '',
          coordinates: { lat: '', lng: '' },
          maxVolunteers: '',
          volunteers: 0,
          requirements: [''],
          images: [],
          contact: {
            email: '',
            phone: '',
            website: ''
          },
          verified: false,
          rating: 0,
          reviews: 0,
          impact: {
            wasteCollected: '',
            areaCleaned: '',
            previousParticipants: ''
          },
          liveAttendance: 0,
          points: 0,
          isRecurring: false,
          recurrence: ''
        });
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ submit: error.message || 'Error creating event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEventData({
      title: '',
      organization: '',
      organizer: '',
      description: '',
      fullDescription: '',
      category: '',
      date: '',
      time: '',
      endTime: '',
      location: '',
      coordinates: { lat: '', lng: '' },
      maxVolunteers: '',
      volunteers: 0,
      requirements: [''],
      images: [],
      contact: {
        email: '',
        phone: '',
        website: ''
      },
      verified: false,
      rating: 0,
      reviews: 0,
      impact: {
        wasteCollected: '',
        areaCleaned: '',
        previousParticipants: ''
      },
      liveAttendance: 0,
      points: 0,
      isRecurring: false,
      recurrence: ''
    });
    setErrors({});
    setSuccess(false);
  };

  if (!user) {
    return (
      <motion.div 
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to create events</p>
            <motion.a
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Go to Login
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-3xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Create New Event
          </motion.h1>
          <motion.p 
            className="mt-2 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Organize a community service event and make a difference
          </motion.p>
          <motion.p 
            className="mt-1 text-xs text-green-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Event will be added to both public events and your personal events
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-800 font-medium">Event created successfully! It's now available in public events and your personal events.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Title *
              </label>
              <motion.button
                type="button"
                onClick={generateAiSuggestions}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 transition duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FontAwesomeIcon icon={faLightbulb} className="h-3 w-3 mr-1" />
                AI Suggestions
              </motion.button>
            </div>
            
            <motion.input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter a compelling event title..."
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.title && (
              <motion.p 
                className="text-red-600 text-xs mt-1 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                {errors.title}
              </motion.p>
            )}

            <AnimatePresence>
              {showAiSuggestions && (
                <motion.div 
                  className="mt-2 border border-gray-200 rounded-md bg-white shadow-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      onClick={() => useAiSuggestion(suggestion)}
                      className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition duration-300"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faLightbulb} className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faBuilding} className="h-4 w-4 mr-2 text-gray-400" />
                  Organization *
                </label>
                <input
                  type="text"
                  name="organization"
                  value={eventData.organization}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ${
                    errors.organization ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Your organization name"
                />
                {errors.organization && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                    {errors.organization}
                  </p>
                )}
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-2 text-gray-400" />
                  Organizer Name *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={eventData.organizer}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ${
                    errors.organizer ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.organizer && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                    {errors.organizer}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <motion.label className="block text-sm font-medium text-gray-700 mb-2" variants={itemVariants}>
              <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2 text-gray-400" />
              Short Description *
            </motion.label>
            <motion.input
              type="text"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 mb-4 ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Brief description of your event..."
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1 flex items-center mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                {errors.description}
              </p>
            )}
            
            <motion.label className="block text-sm font-medium text-gray-700 mb-2" variants={itemVariants}>
              Full Description *
            </motion.label>
            <motion.textarea
              name="fullDescription"
              value={eventData.fullDescription}
              onChange={handleChange}
              required
              rows={6}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ${
                errors.fullDescription ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Describe your event in detail... What will volunteers do? Why is it important? What to expect?"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.fullDescription && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                {errors.fullDescription}
              </p>
            )}
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faTag} className="h-4 w-4 mr-2 text-gray-400" />
                  Category *
                </label>
                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ${
                    errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                    {errors.category}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faUsers} className="h-4 w-4 mr-2 text-gray-400" />
                  Maximum Volunteers *
                </label>
                <input
                  type="number"
                  name="maxVolunteers"
                  value={eventData.maxVolunteers}
                  onChange={handleChange}
                  min="1"
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ${
                    errors.maxVolunteers ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 50"
                />
                {errors.maxVolunteers && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                    {errors.maxVolunteers}
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div 
              className="mt-4 p-3 bg-blue-50 rounded-md"
              variants={itemVariants}
            >
              <div className="flex items-center text-sm text-blue-700">
                <FontAwesomeIcon icon={faLightbulb} className="h-4 w-4 mr-2" />
                <span>
                  This event will reward <strong>{calculatePoints(eventData.category)} points</strong> to volunteers
                  {eventData.category && ` (${eventData.category} category)`}
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <motion.h3 className="text-lg font-medium text-gray-900 mb-4" variants={itemVariants}>
              <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 mr-2 text-gray-400" />
              Date & Time
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { field: 'date', label: 'Date *', type: 'date' },
                { field: 'time', label: 'Start Time *', type: 'time' },
                { field: 'endTime', label: 'End Time', type: 'time' }
              ].map((item, index) => (
                <motion.div 
                  key={item.field}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {item.field === 'time' && <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-1 text-gray-400" />}
                    {item.label}
                  </label>
                  <input
                    type={item.type}
                    name={item.field}
                    value={eventData[item.field]}
                    onChange={handleChange}
                    required={item.field !== 'endTime'}
                    min={item.field === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ${
                      errors[item.field] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors[item.field] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                      {errors[item.field]}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div className="mt-4 flex items-center" variants={itemVariants}>
              <input
                type="checkbox"
                name="isRecurring"
                checked={eventData.isRecurring}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                This is a recurring event
              </label>
            </motion.div>

            <AnimatePresence>
              {eventData.isRecurring && (
                <motion.div 
                  className="mt-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <select
                    name="recurrence"
                    value={eventData.recurrence}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                  >
                    <option value="">Select recurrence</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <motion.label className="block text-sm font-medium text-gray-700 mb-2" variants={itemVariants}>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2 text-gray-400" />
              Event Location *
            </motion.label>
            <motion.input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 mb-4 ${
                errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter full address or location details..."
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.location && (
              <p className="text-red-600 text-xs mt-1 flex items-center mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                {errors.location}
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['lat', 'lng'].map((coord, index) => (
                <motion.div 
                  key={coord}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {coord === 'lat' ? 'Latitude' : 'Longitude'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={eventData.coordinates[coord]}
                    onChange={(e) => handleCoordinateChange(coord, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    placeholder={coord === 'lat' ? "e.g., 23.8103" : "e.g., 90.4125"}
                  />
                </motion.div>
              ))}
            </div>
            <motion.p className="mt-1 text-sm text-gray-500" variants={itemVariants}>
              Volunteers will see this location on the map
            </motion.p>
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <motion.h3 className="text-lg font-medium text-gray-900 mb-4" variants={itemVariants}>
              Contact Information
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { field: 'email', icon: faEnvelope, placeholder: 'organizer@example.com', type: 'email', required: true },
                { field: 'phone', icon: faPhone, placeholder: '+880 1XXX-XXXXXX', type: 'tel', required: false },
                { field: 'website', icon: faGlobe, placeholder: 'www.example.org', type: 'url', required: false }
              ].map((contact, index) => (
                <motion.div 
                  key={contact.field}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={contact.icon} className="h-4 w-4 mr-2 text-gray-400" />
                    {contact.field === 'email' ? 'Contact Email *' : 
                     contact.field === 'phone' ? 'Contact Phone' : 'Website'}
                  </label>
                  <input
                    type={contact.type}
                    value={eventData.contact[contact.field]}
                    onChange={(e) => handleNestedChange('contact', contact.field, e.target.value)}
                    required={contact.required}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ${
                      errors[`contact${contact.field.charAt(0).toUpperCase() + contact.field.slice(1)}`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder={contact.placeholder}
                  />
                  {errors[`contact${contact.field.charAt(0).toUpperCase() + contact.field.slice(1)}`] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
                      {errors[`contact${contact.field.charAt(0).toUpperCase() + contact.field.slice(1)}`]}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Volunteer Requirements
              </label>
              <motion.button
                type="button"
                onClick={addRequirement}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 transition duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FontAwesomeIcon icon={faPlus} className="h-3 w-3 mr-1" />
                Add Requirement
              </motion.button>
            </div>

            <AnimatePresence>
              {eventData.requirements.map((requirement, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center space-x-2 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    placeholder="e.g., Bring gloves, Wear comfortable shoes..."
                  />
                  {eventData.requirements.length > 1 && (
                    <motion.button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-2 text-red-500 hover:text-red-700 transition duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FontAwesomeIcon icon={faMinus} className="h-4 w-4" />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <motion.h3 className="text-lg font-medium text-gray-900 mb-4" variants={itemVariants}>
              <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 mr-2 text-gray-400" />
              Impact Information (Optional)
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { field: 'wasteCollected', placeholder: 'e.g., 2.5 tons' },
                { field: 'areaCleaned', placeholder: 'e.g., 5 km coastline' },
                { field: 'previousParticipants', placeholder: 'e.g., 500+' }
              ].map((impact, index) => (
                <motion.div 
                  key={impact.field}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {impact.field === 'wasteCollected' ? 'Waste Collected' :
                     impact.field === 'areaCleaned' ? 'Area Cleaned' : 'Previous Participants'}
                  </label>
                  <input
                    type="text"
                    value={eventData.impact[impact.field]}
                    onChange={(e) => handleNestedChange('impact', impact.field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    placeholder={impact.placeholder}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div className="flex items-center" variants={itemVariants}>
              <input
                type="checkbox"
                name="verified"
                checked={eventData.verified}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                <FontAwesomeIcon icon={faCertificate} className="h-4 w-4 mr-1 text-green-500" />
                Verified Organization
              </label>
            </motion.div>
            <motion.p className="mt-1 text-sm text-gray-500" variants={itemVariants}>
              Check this if your organization is officially verified
            </motion.p>
          </motion.div>

          <motion.div 
            className="bg-white shadow rounded-lg p-6"
            variants={formSectionVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <motion.label className="block text-sm font-medium text-gray-700 mb-2" variants={itemVariants}>
              <FontAwesomeIcon icon={faImage} className="h-4 w-4 mr-2 text-gray-400" />
              Event Images (Optional)
            </motion.label>
            <motion.div 
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center"
              whileHover={{ borderColor: "#10B981" }}
              transition={{ duration: 0.3 }}
            >
              <FontAwesomeIcon icon={faUpload} className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload images for your event
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <motion.label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 cursor-pointer transition duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Choose Files
              </motion.label>
            </motion.div>
            
            <AnimatePresence>
              {eventData.images.length > 0 && (
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</p>
                  <div className="flex flex-wrap gap-2">
                    {eventData.images.map((image, index) => (
                      <motion.img
                        key={index}
                        src={image}
                        alt={`Event preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
              >
                <p className="text-red-700 text-sm flex items-center justify-center space-x-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4" />
                  <span>{errors.submit}</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="flex justify-between items-center"
            variants={itemVariants}
          >
            <motion.button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Reset Form
            </motion.button>
            
            <div className="flex space-x-4">
              <motion.button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Save as Draft
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                whileHover={!isSubmitting ? "hover" : {}}
                whileTap={!isSubmitting ? "tap" : {}}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Creating Event...
                  </div>
                ) : (
                  'Create Event'
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default CreateEvent;