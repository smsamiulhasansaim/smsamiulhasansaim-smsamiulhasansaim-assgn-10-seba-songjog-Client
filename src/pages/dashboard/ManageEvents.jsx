/**
 * @author: S M Samiul Hasan
 * @file: ManageEvents.jsx
 * @description: This React component provides an interface for managing community events (create, edit, delete, view).
 * All rights reserved by S M Samiul Hasan.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faUsers,
  faCalendarAlt,
  faMapMarkerAlt,
  faDownload,
  faCheckCircle,
  faExclamationTriangle,
  faClock,
  faChevronDown,
  faChevronUp,
  faEllipsisVertical,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const ManageEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [events, setEvents] = useState({
    active: [],
    draft: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://assgn-10-seba-songjog-server.vercel.app/api/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const eventsData = await response.json();
      
      const transformedEvents = {
        active: eventsData.filter(event => {
          const eventDate = new Date(event.date);
          const today = new Date();
          return eventDate >= today && event.status !== 'draft';
        }),
        draft: eventsData.filter(event => event.status === 'draft'),
        completed: eventsData.filter(event => {
          const eventDate = new Date(event.date);
          const today = new Date();
          return eventDate < today && event.status !== 'draft';
        })
      };
      
      setEvents(transformedEvents);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: events.active.length + events.draft.length + events.completed.length,
    active: events.active.length,
    draft: events.draft.length,
    completed: events.completed.length,
    totalVolunteers: events.active.reduce((sum, event) => sum + (event.volunteers || 0), 0) +
                     events.completed.reduce((sum, event) => sum + (event.volunteers || 0), 0)
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    const currentTabEvents = events[activeTab];
    setSelectedEvents(
      selectedEvents.length === currentTabEvents.length ? [] : currentTabEvents.map(event => event._id)
    );
  };

  const handleDeleteEvents = async () => {
    if (selectedEvents.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedEvents.length} event(s)?`)) {
      try {
        setProcessing(true);
        
        const deletePromises = selectedEvents.map(eventId => 
          fetch(`https://assgn-10-seba-songjog-server.vercel.app/api/events/${eventId}`, {
            method: 'DELETE'
          })
        );
        
        await Promise.all(deletePromises);
        
        await fetchEvents();
        setSelectedEvents([]);
        
        alert('Events deleted successfully!');
      } catch (err) {
        alert('Error deleting events. Please try again.');
        console.error('Error deleting events:', err);
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleDeleteSingleEvent = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      try {
        setProcessing(true);
        
        const response = await fetch(`https://assgn-10-seba-songjog-server.vercel.app/api/events/${eventId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete event');
        }
        
        await fetchEvents();
        
        alert('Event deleted successfully!');
      } catch (err) {
        alert('Error deleting event. Please try again.');
        console.error('Error deleting event:', err);
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleDuplicateEvent = async (eventId) => {
    try {
      setProcessing(true);
      
      let eventToDuplicate = null;
      Object.keys(events).forEach(key => {
        const found = events[key].find(event => event._id === eventId);
        if (found) eventToDuplicate = found;
      });

      if (!eventToDuplicate) {
        throw new Error('Event not found');
      }

      const duplicateEvent = {
        title: `${eventToDuplicate.title} (Copy)`,
        organization: eventToDuplicate.organization,
        organizer: eventToDuplicate.organizer,
        date: eventToDuplicate.date,
        time: eventToDuplicate.time,
        endTime: eventToDuplicate.endTime,
        location: eventToDuplicate.location,
        coordinates: eventToDuplicate.coordinates,
        category: eventToDuplicate.category,
        volunteers: 0,
        maxVolunteers: eventToDuplicate.maxVolunteers,
        description: eventToDuplicate.description,
        fullDescription: eventToDuplicate.fullDescription,
        requirements: eventToDuplicate.requirements,
        images: eventToDuplicate.images,
        contact: eventToDuplicate.contact,
        verified: false,
        rating: 0,
        reviews: 0,
        impact: eventToDuplicate.impact,
        liveAttendance: 0,
        points: eventToDuplicate.points,
        isRecurring: eventToDuplicate.isRecurring,
        recurrence: eventToDuplicate.recurrence,
        status: 'draft'
      };

      const response = await fetch('https://assgn-10-seba-songjog-server.vercel.app/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(duplicateEvent)
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate event');
      }

      await fetchEvents();
      setActiveTab('draft');
      
      alert('Event duplicated successfully!');
    } catch (err) {
      alert('Error duplicating event. Please try again.');
      console.error('Error duplicating event:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleExportData = () => {
    console.log('Exporting event data');
  };

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleViewEvent = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const getStatusBadge = (event) => {
    let status = event.status;
    if (status !== 'draft') {
      const eventDate = new Date(event.date);
      const today = new Date();
      status = eventDate >= today ? 'upcoming' : 'completed';
    }

    const statusConfig = {
      upcoming: { color: 'bg-blue-100 text-blue-800', label: 'Upcoming' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      cleanup: 'bg-blue-100 text-blue-800',
      environment: 'bg-green-100 text-green-800',
      education: 'bg-purple-100 text-purple-800',
      community: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getVolunteerProgress = (volunteers, maxVolunteers) => {
    const volunteersCount = volunteers || 0;
    const maxVolunteersCount = maxVolunteers || 1;
    return Math.min((volunteersCount / maxVolunteersCount) * 100, 100);
  };

  const filteredEvents = events[activeTab].filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Events</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
              <p className="mt-2 text-gray-600">Create, edit, and manage your community events</p>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <button
                onClick={handleExportData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
              >
                <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => navigate('/create-event')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition duration-300"
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                Create Event
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faUsers} className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-gray-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalVolunteers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
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

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faFilter} className="h-4 w-4 mr-2" />
                Filters
                <FontAwesomeIcon 
                  icon={showFilters ? faChevronUp : faChevronDown} 
                  className="h-4 w-4 ml-2" 
                />
              </button>
            </div>

            {selectedEvents.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedEvents.length} selected
                </span>
                <button
                  onClick={handleDeleteEvents}
                  disabled={processing}
                  className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </button>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md">
                    <option value="all">All Categories</option>
                    <option value="cleanup">Cleanup</option>
                    <option value="environment">Environment</option>
                    <option value="education">Education</option>
                    <option value="community">Community</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md">
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setSearchTerm('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'active', name: 'Active Events', count: events.active.length },
                { id: 'draft', name: 'Drafts', count: events.draft.length },
                { id: 'completed', name: 'Completed', count: events.completed.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 transition duration-300 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className={`ml-2 py-0.5 px-2 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volunteers
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <EventRow
                        key={event._id}
                        event={event}
                        isSelected={selectedEvents.includes(event._id)}
                        onSelect={handleSelectEvent}
                        onDuplicate={handleDuplicateEvent}
                        onDelete={handleDeleteSingleEvent}
                        onEdit={handleEditEvent}
                        onView={handleViewEvent}
                        getStatusBadge={getStatusBadge}
                        getCategoryColor={getCategoryColor}
                        getVolunteerProgress={getVolunteerProgress}
                        formatDate={formatDate}
                        processing={processing}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-24 text-center">
                        <div className="text-gray-400 mb-4">
                          <FontAwesomeIcon icon={faCalendarAlt} className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500 mb-4">
                          {activeTab === 'active' && "You don't have any active events. Create your first event!"}
                          {activeTab === 'draft' && "You don't have any draft events."}
                          {activeTab === 'completed' && "You don't have any completed events yet."}
                        </p>
                        {activeTab === 'active' && (
                          <button
                            onClick={() => navigate('/create-event')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition duration-300"
                          >
                            <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                            Create Event
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventRow = ({ 
  event, 
  isSelected, 
  onSelect, 
  onDuplicate,
  onDelete,
  onEdit,
  onView,
  getStatusBadge,
  getCategoryColor,
  getVolunteerProgress,
  formatDate,
  processing
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className={isSelected ? 'bg-green-50' : 'hover:bg-gray-50'}>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(event._id)}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex-shrink-0"></div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 line-clamp-1">
              {event.title}
            </div>
            <div className="text-sm text-gray-500">{event.organization}</div>
            <div className="flex items-center mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2 text-gray-400" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center mt-1">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-500 truncate max-w-xs">{event.location}</span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <div className="font-medium">{event.volunteers || 0}/{event.maxVolunteers || 0}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${getVolunteerProgress(event.volunteers, event.maxVolunteers)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {event.views || 0} views • {event.applications || 0} applications
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(event)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            disabled={processing}
            className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faEllipsisVertical} className="h-4 w-4" />
            )}
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowActions(false);
                    onView(event._id);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition duration-300"
                >
                  <FontAwesomeIcon icon={faEye} className="h-4 w-4 mr-2" />
                  View Event
                </button>
                
                <button
                  onClick={() => {
                    setShowActions(false);
                    onEdit(event._id);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition duration-300"
                >
                  <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-2" />
                  Edit Event
                </button>

                <button
                  onClick={() => {
                    setShowActions(false);
                    onDuplicate(event._id);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition duration-300"
                >
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                  Duplicate
                </button>

                <div className="border-t border-gray-100"></div>
                
                <button
                  onClick={() => {
                    setShowActions(false);
                    onDelete(event._id, event.title);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition duration-300"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4 mr-2" />
                  Delete Event
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ManageEvents;