import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faQrcode,
  faBell,
  faBellSlash,
  faTrash,
  faCheckCircle,
  faExclamationTriangle,
  faChevronDown,
  faChevronUp,
  faShare,
  faDownload,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

const JoinedEvents = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [showQRCode, setShowQRCode] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState({
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5000/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const responseData = await response.json();
        
        const allEvents = Array.isArray(responseData) 
          ? responseData 
          : (responseData.data || responseData.events || []);

        const today = new Date();
        const transformedEvents = {
          upcoming: allEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
          }).map(event => ({
            ...event,
            status: 'confirmed',
            reminderSet: false,
            checkInCode: `EVT-${event.id}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            preparation: ['Wear comfortable clothing', 'Bring necessary items', 'Arrive 15 minutes early'],
            organizerContact: {
              name: event.organizer,
              phone: event.contact?.phone || '+880 1XXX-XXXXXX',
              email: event.contact?.email || 'contact@organization.org'
            }
          })),
          past: allEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate < today;
          }).map(event => ({
            ...event,
            status: 'completed',
            feedbackSubmitted: Math.random() > 0.5,
            rating: Math.floor(Math.random() * 5) + 1,
            impact: {
              hoursVolunteered: Math.floor(Math.random() * 8) + 1,
              peopleHelped: Math.floor(Math.random() * 100) + 50,
              itemsCollected: event.category === 'cleanup' ? Math.floor(Math.random() * 1000) + 500 : null
            },
            checkInCode: `EVT-${event.id}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
          }))
        };
        
        setJoinedEvents(transformedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedEvents();
  }, []);

  const toggleReminder = async (eventId) => {
    try {
      setJoinedEvents(prev => ({
        ...prev,
        upcoming: prev.upcoming.map(event => 
          event.id === eventId 
            ? { ...event, reminderSet: !event.reminderSet }
            : event
        )
      }));
    } catch (err) {
    }
  };

  const leaveEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to leave this event?')) {
      try {
        setJoinedEvents(prev => ({
          ...prev,
          upcoming: prev.upcoming.filter(event => event.id !== eventId)
        }));
        
        alert('You have successfully left the event.');
      } catch (err) {
        alert('Error leaving event. Please try again.');
      }
    }
  };

  const downloadTicket = async (event) => {
    try {
      const ticketData = {
        event: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        checkInCode: event.checkInCode
      };
      
      const blob = new Blob([JSON.stringify(ticketData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${event.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Ticket downloaded successfully!');
    } catch (err) {
      alert('Error downloading ticket. Please try again.');
    }
  };

  const shareEvent = async (event) => {
    try {
      const shareText = `Join me at ${event.title} on ${formatDate(event.date)} at ${event.time}. ${event.location}`;
      
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Event details copied to clipboard!');
      }
    } catch (err) {
    }
  };

  const submitFeedback = async (eventId) => {
    try {
      setJoinedEvents(prev => ({
        ...prev,
        past: prev.past.map(event => 
          event.id === eventId 
            ? { ...event, feedbackSubmitted: true, rating: 5 }
            : event
        )
      }));
      
      alert('Thank you for your feedback!');
    } catch (err) {
      alert('Error submitting feedback. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDaysUntilEvent = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (event) => {
    if (event.status === 'completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 mr-1" />
          Completed
        </span>
      );
    }
    
    const daysUntil = getDaysUntilEvent(event.date);
    if (daysUntil === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Today
        </span>
      );
    } else if (daysUntil === 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Tomorrow
        </span>
      );
    } else if (daysUntil <= 7) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          In {daysUntil} days
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Confirmed
        </span>
      );
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Events</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <p className="mt-2 text-gray-600">Manage your upcoming events and view your participation history</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'upcoming', name: 'Upcoming', count: joinedEvents.upcoming.length },
                { id: 'past', name: 'Past Events', count: joinedEvents.past.length }
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
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Upcoming Events ({joinedEvents.upcoming.length})
                </h2>
                
                {joinedEvents.upcoming.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FontAwesomeIcon icon={faCalendarAlt} className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                    <p className="text-gray-500">Join some events to see them here!</p>
                  </div>
                ) : (
                  joinedEvents.upcoming.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      type="upcoming"
                      expandedEvent={expandedEvent}
                      setExpandedEvent={setExpandedEvent}
                      showQRCode={showQRCode}
                      setShowQRCode={setShowQRCode}
                      toggleReminder={toggleReminder}
                      leaveEvent={leaveEvent}
                      downloadTicket={downloadTicket}
                      shareEvent={shareEvent}
                      getStatusBadge={getStatusBadge}
                      getCategoryColor={getCategoryColor}
                      formatDate={formatDate}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'past' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Past Events ({joinedEvents.past.length})
                </h2>
                
                {joinedEvents.past.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
                    <p className="text-gray-500">Your completed events will appear here</p>
                  </div>
                ) : (
                  joinedEvents.past.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      type="past"
                      expandedEvent={expandedEvent}
                      setExpandedEvent={setExpandedEvent}
                      submitFeedback={submitFeedback}
                      getStatusBadge={getStatusBadge}
                      getCategoryColor={getCategoryColor}
                      formatDate={formatDate}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-in QR Code</h3>
              <p className="text-sm text-gray-600 mb-4">Event: {showQRCode.title}</p>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="bg-white p-4 rounded">
                  <FontAwesomeIcon icon={faQrcode} className="h-32 w-32 text-gray-800 mx-auto" />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-mono text-gray-700">{showQRCode.checkInCode}</p>
                <p className="text-xs text-gray-500 mt-1">Check-in Code</p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Show this QR code at the event venue for quick check-in
              </p>
              
              <button
                onClick={() => setShowQRCode(null)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EventCard = ({ 
  event, 
  type, 
  expandedEvent, 
  setExpandedEvent, 
  setShowQRCode,
  toggleReminder,
  leaveEvent,
  downloadTicket,
  shareEvent,
  submitFeedback,
  getStatusBadge,
  getCategoryColor,
  formatDate
}) => {
  const isExpanded = expandedEvent === event.id;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>
              {getStatusBadge(event)}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {event.title}
            </h3>
            
            <p className="text-gray-600 mb-3">{event.organization}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2 text-green-500" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-2 text-green-500" />
                {event.time} - {event.endTime}
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2 text-green-500" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
            {type === 'upcoming' && (
              <>
                <button
                  onClick={() => setShowQRCode(event)}
                  className="inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition duration-300"
                >
                  <FontAwesomeIcon icon={faQrcode} className="h-4 w-4 mr-2" />
                  QR Code
                </button>
                
                <button
                  onClick={() => toggleReminder(event.id)}
                  className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition duration-300 ${
                    event.reminderSet
                      ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={event.reminderSet ? faBell : faBellSlash} 
                    className="h-4 w-4 mr-2" 
                  />
                  {event.reminderSet ? 'Reminder On' : 'Reminder Off'}
                </button>
              </>
            )}
            
            <button
              onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
              <FontAwesomeIcon 
                icon={isExpanded ? faChevronUp : faChevronDown} 
                className="h-4 w-4 ml-2" 
              />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          {type === 'upcoming' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Event Details</h4>
                <p className="text-gray-700 mb-4">{event.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Requirements:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {event.requirements?.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 text-green-500 mr-2" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Preparation:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {event.preparation?.map((prep, index) => (
                        <li key={index} className="flex items-center">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 text-yellow-500 mr-2" />
                          {prep}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => downloadTicket(event)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                    Download Ticket
                  </button>
                  
                  <button
                    onClick={() => shareEvent(event)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faShare} className="h-4 w-4 mr-2" />
                    Share Event
                  </button>
                  
                  <button
                    onClick={() => leaveEvent(event.id)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4 mr-2" />
                    Leave Event
                  </button>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Organizer Contact:</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{event.organizerContact?.name}</div>
                    <div>{event.organizerContact?.phone}</div>
                    <div>{event.organizerContact?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Your Impact</h4>
                {event.impact && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(event.impact).map(([key, value]) => (
                      value && (
                        <div key={key} className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{value}</div>
                          <div className="text-xs text-green-800 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Feedback</h4>
                {event.feedbackSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center text-green-800">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 mr-2" />
                      <span className="font-medium">Feedback Submitted</span>
                    </div>
                    {event.rating && (
                      <div className="mt-2 text-sm text-green-700">
                        You rated this event: {event.rating}/5 stars
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 mb-3">
                      Help us improve by sharing your experience
                    </p>
                    <button
                      onClick={() => submitFeedback(event.id)}
                      className="w-full py-2 px-4 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 transition duration-300"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JoinedEvents;