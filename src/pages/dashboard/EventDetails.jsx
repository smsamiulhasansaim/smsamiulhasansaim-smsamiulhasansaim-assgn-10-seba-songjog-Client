// EventDetails Component - Created by S M Samiul Hasan
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faShare,
  faArrowLeft,
  faCheckCircle,
  faQrcode,
  faStar,
  faExclamationTriangle,
  faUserFriends,
  faPhone,
  faEnvelope,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://assgn-10-seba-songjog-server.vercel.app/api/events');

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Invalid response format');
        }

        const data = await response.json();
        let eventsData = [];

        if (data.data && Array.isArray(data.data)) {
          eventsData = data.data;
        } else if (data.events && Array.isArray(data.events)) {
          eventsData = data.events;
        } else if (Array.isArray(data)) {
          eventsData = data;
        } else {
          throw new Error('Invalid events data format received from API');
        }

        const foundEvent = eventsData.find(event =>
          event.eventId === eventId || event._id === eventId
        );

        if (!foundEvent) {
          throw new Error(`Event with ID ${eventId} not found`);
        }

        setEvent(foundEvent);

      } catch (error) {
        setError(error.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const handleJoinEvent = () => {
    setIsJoined(true);
  };

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getDaysUntilEvent = (dateString) => {
    if (!dateString) return 0;
    try {
      const eventDate = new Date(dateString);
      const today = new Date();
      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      return 0;
    }
  };

  const getVolunteerProgress = () => {
    if (!event) return 0;
    const volunteers = event.volunteers || 0;
    const maxVolunteers = event.maxVolunteers || 1;
    return Math.min((volunteers / maxVolunteers) * 100, 100);
  };

  const normalizeEvent = (eventData) => {
    if (!eventData) return null;

    return {
      id: eventData.eventId || eventData._id,
      eventId: eventData.eventId || eventData._id,
      title: eventData.title || 'No Title',
      organization: eventData.organization || 'Unknown Organization',
      organizer: eventData.organizer || eventData.organization || 'Unknown Organizer',
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || '10:00',
      endTime: eventData.endTime || '12:00',
      location: eventData.location || 'Location not specified',
      category: eventData.category || 'general',
      volunteers: eventData.volunteers || 0,
      maxVolunteers: eventData.maxVolunteers || 10,
      description: eventData.description || 'No description available',
      fullDescription: eventData.fullDescription || eventData.description || 'No description available',
      requirements: eventData.requirements || ['No specific requirements'],
      contact: eventData.contact || { email: '', phone: '', website: '' },
      verified: eventData.verified || false,
      rating: eventData.rating || 0,
      reviews: eventData.reviews || 0,
      impact: eventData.impact || {
        wasteCollected: '0',
        areaCleaned: '0',
        previousParticipants: '0'
      },
      liveAttendance: eventData.liveAttendance || 0,
      points: eventData.points || 0
    };
  };

  const normalizedEvent = normalizeEvent(event);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !normalizedEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <FontAwesomeIcon icon={faExclamationTriangle} className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The event you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/upcoming-events')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition duration-300"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5 mr-2" />
              Back to Events
            </button>

            <div className="flex space-x-3">
              <button
                onClick={handleShareEvent}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
              >
                <FontAwesomeIcon icon={faShare} className="h-4 w-4 mr-2" />
                Share
              </button>

              {isJoined && (
                <button
                  onClick={() => setShowQRCode(true)}
                  className="flex items-center px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition duration-300"
                >
                  <FontAwesomeIcon icon={faQrcode} className="h-4 w-4 mr-2" />
                  Check-in QR
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {normalizedEvent.category?.charAt(0).toUpperCase() + normalizedEvent.category?.slice(1) || 'General'}
                    </span>
                    {normalizedEvent.verified && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-1" />
                        Verified Organization
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <FontAwesomeIcon icon={faStar} className="h-4 w-4 mr-1" />
                      {normalizedEvent.rating?.toFixed(1) || '0.0'} ({normalizedEvent.reviews || 0} reviews)
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {normalizedEvent.title}
                  </h1>

                  <p className="text-lg text-gray-600 mb-4">
                    Organized by <span className="font-semibold">{normalizedEvent.organization}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-semibold">{formatDate(normalizedEvent.date)}</div>
                    <div className="text-sm text-gray-500">{getDaysUntilEvent(normalizedEvent.date)} days to go</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-semibold">{normalizedEvent.time} - {normalizedEvent.endTime}</div>
                    <div className="text-sm text-gray-500">Duration varies</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-semibold">{normalizedEvent.location?.split(',')[0] || 'Location'}</div>
                    <div className="text-sm text-gray-500">{normalizedEvent.location?.split(',')[1] || 'Bangladesh'}</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <FontAwesomeIcon icon={faUserFriends} className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-semibold">{normalizedEvent.liveAttendance} attending now</div>
                    <div className="text-sm text-gray-500">{normalizedEvent.volunteers} total volunteers</div>
                  </div>
                </div>
              </div>

              {!isJoined ? (
                <button
                  onClick={handleJoinEvent}
                  disabled={normalizedEvent.volunteers >= normalizedEvent.maxVolunteers}
                  className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 ${
                    normalizedEvent.volunteers >= normalizedEvent.maxVolunteers
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                  }`}
                >
                  {normalizedEvent.volunteers >= normalizedEvent.maxVolunteers ? 'Event Full' : 'Join This Event'}
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-500 mb-2 mx-auto" />
                  <h3 className="text-lg font-semibold text-green-800 mb-1">You're Joined!</h3>
                  <p className="text-green-600">We'll send you reminders as the event approaches</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {['details', 'impact', 'location', 'organizer'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-6 text-sm font-medium border-b-2 transition duration-300 ${
                        activeTab === tab
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 mb-4 whitespace-pre-line">
                        {showFullDescription ? normalizedEvent.fullDescription : normalizedEvent.description}
                      </p>
                      {normalizedEvent.fullDescription && normalizedEvent.fullDescription !== normalizedEvent.description && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-green-600 hover:text-green-700 font-medium flex items-center transition duration-300"
                        >
                          {showFullDescription ? 'Show Less' : 'Read More'}
                          <FontAwesomeIcon
                            icon={showFullDescription ? faChevronUp : faChevronDown}
                            className="h-4 w-4 ml-1"
                          />
                        </button>
                      )}
                    </div>

                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {normalizedEvent.requirements.map((requirement, index) => (
                          <div key={index} className="flex items-center text-gray-700">
                            <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-green-500 mr-2" />
                            {requirement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'impact' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Impact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{normalizedEvent.impact.wasteCollected}</div>
                        <div className="text-blue-800">Waste to be Collected</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{normalizedEvent.impact.areaCleaned}</div>
                        <div className="text-green-800">Area to be Cleaned</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{normalizedEvent.impact.previousParticipants}</div>
                        <div className="text-purple-800">Previous Participants</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Location</h3>
                    <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-gray-600">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-8 w-8 mx-auto mb-2" />
                        <p>Map would be displayed here</p>
                        <p className="text-sm">{normalizedEvent.location}</p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">Getting There</h4>
                          <p className="text-yellow-700 text-sm mt-1">
                            Look for the {normalizedEvent.organization} banner at the venue.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'organizer' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700">Organization</h4>
                        <p className="text-gray-900">{normalizedEvent.organization}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Contact Person</h4>
                        <p className="text-gray-900">{normalizedEvent.organizer}</p>
                      </div>
                      {normalizedEvent.contact?.email && (
                        <div className="flex items-center text-gray-700">
                          <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 mr-2" />
                          <a href={`mailto:${normalizedEvent.contact.email}`} className="text-green-600 hover:text-green-700">
                            {normalizedEvent.contact.email}
                          </a>
                        </div>
                      )}
                      {normalizedEvent.contact?.phone && (
                        <div className="flex items-center text-gray-700">
                          <FontAwesomeIcon icon={faPhone} className="h-4 w-4 mr-2" />
                          <a href={`tel:${normalizedEvent.contact.phone}`} className="text-green-600 hover:text-green-700">
                            {normalizedEvent.contact.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Volunteers Joined</span>
                    <span>{normalizedEvent.volunteers}/{normalizedEvent.maxVolunteers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getVolunteerProgress()}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{Math.max(normalizedEvent.maxVolunteers - normalizedEvent.volunteers, 0)}</div>
                  <div className="text-sm text-gray-600">Spots Available</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Points</h3>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{normalizedEvent.points}</div>
                <div className="text-yellow-800 font-medium">Points Available</div>
                <p className="text-yellow-700 text-sm mt-2">
                  Complete this event to earn these points
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Check-in QR Code</h3>
              <div className="bg-gray-200 h-64 w-64 mx-auto flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faQrcode} className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Show this QR code at the event venue for check-in
              </p>
              <button
                onClick={() => setShowQRCode(false)}
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

export default EventDetails;