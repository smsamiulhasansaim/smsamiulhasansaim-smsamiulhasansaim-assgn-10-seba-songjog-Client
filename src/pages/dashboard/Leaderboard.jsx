import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faMedal,
  faStar,
  faCrown,
  faSearch,
  faAward,
  faCalendarAlt,
  faUsers,
  faTree,
  faRecycle,
  faGraduationCap,
  faHandHoldingHeart,
  faChevronDown,
  faChevronUp,
  faShare,
  faFire
} from '@fortawesome/free-solid-svg-icons';

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);

  const leaderboardData = {
    monthly: [
      {
        id: 1,
        rank: 1,
        name: 'Ayesha Siddiqa',
        points: 2450,
        events: 12,
        hours: 48,
        level: 'Gold',
        avatar: '/api/placeholder/100/100',
        impact: {
          treesPlanted: 45,
          wasteCollected: 120,
          peopleHelped: 200
        },
        badges: ['environment', 'community', 'education'],
        streak: 15,
        joined: '2023-01-15'
      },
      {
        id: 2,
        rank: 2,
        name: 'Rafiq Islam',
        points: 2180,
        events: 10,
        hours: 42,
        level: 'Gold',
        avatar: '/api/placeholder/100/100',
        impact: {
          treesPlanted: 38,
          wasteCollected: 95,
          peopleHelped: 150
        },
        badges: ['cleanup', 'environment'],
        streak: 12,
        joined: '2023-02-20'
      },
      {
        id: 3,
        rank: 3,
        name: 'Fatima Begum',
        points: 1950,
        events: 9,
        hours: 36,
        level: 'Silver',
        avatar: '/api/placeholder/100/100',
        impact: {
          treesPlanted: 25,
          wasteCollected: 80,
          peopleHelped: 120
        },
        badges: ['education', 'community'],
        streak: 8,
        joined: '2023-03-10'
      },
      {
        id: 4,
        rank: 4,
        name: 'Hasan Mahmud',
        points: 1720,
        events: 8,
        hours: 32,
        level: 'Silver',
        avatar: '/api/placeholder/100/100',
        impact: {
          treesPlanted: 20,
          wasteCollected: 65,
          peopleHelped: 90
        },
        badges: ['cleanup'],
        streak: 6,
        joined: '2023-01-25'
      },
      {
        id: 5,
        rank: 5,
        name: 'Nusrat Jahan',
        points: 1580,
        events: 7,
        hours: 28,
        level: 'Silver',
        avatar: '/api/placeholder/100/100',
        impact: {
          treesPlanted: 18,
          wasteCollected: 55,
          peopleHelped: 85
        },
        badges: ['environment', 'cleanup'],
        streak: 10,
        joined: '2023-02-15'
      }
    ],
    allTime: [
      {
        id: 1,
        rank: 1,
        name: 'Ayesha Siddiqa',
        points: 12500,
        events: 58,
        hours: 232,
        level: 'Platinum',
        avatar: '/api/placeholder/100/100',
        impact: {
          treesPlanted: 245,
          wasteCollected: 620,
          peopleHelped: 1200
        },
        badges: ['environment', 'community', 'education', 'cleanup'],
        streak: 25,
        joined: '2023-01-15'
      },
      {
        id: 2,
        rank: 2,
        name: 'Rafiq Islam',
        points: 11800,
        events: 52,
        hours: 208,
        level: 'Platinum',
        avatar: '/api/placeholder/100/100',
        impact: {
          treesPlanted: 198,
          wasteCollected: 495,
          peopleHelped: 950
        },
        badges: ['cleanup', 'environment', 'community'],
        streak: 20,
        joined: '2023-02-20'
      }
    ]
  };

  const currentUser = {
    id: 15,
    rank: 15,
    name: 'You',
    points: 850,
    events: 4,
    hours: 16,
    level: 'Bronze',
    avatar: '/api/placeholder/100/100',
    impact: {
      treesPlanted: 8,
      wasteCollected: 25,
      peopleHelped: 40
    },
    badges: ['environment'],
    streak: 3,
    joined: '2024-01-01'
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: faTrophy },
    { id: 'environment', name: 'Environment', icon: faTree },
    { id: 'cleanup', name: 'Cleanup', icon: faRecycle },
    { id: 'education', name: 'Education', icon: faGraduationCap },
    { id: 'community', name: 'Community', icon: faHandHoldingHeart }
  ];

  const timeFilters = [
    { id: 'monthly', name: 'This Month' },
    { id: 'quarterly', name: 'This Quarter' },
    { id: 'yearly', name: 'This Year' },
    { id: 'allTime', name: 'All Time' }
  ];

  const getLevelColor = (level) => {
    const colors = {
      Platinum: 'bg-gradient-to-r from-gray-400 to-gray-600',
      Gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      Silver: 'bg-gradient-to-r from-gray-300 to-gray-400',
      Bronze: 'bg-gradient-to-r from-orange-400 to-orange-600'
    };
    return colors[level] || 'bg-gradient-to-r from-green-400 to-green-600';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) {
      return <FontAwesomeIcon icon={faCrown} className="h-6 w-6 text-yellow-400" />;
    } else if (rank === 2) {
      return <FontAwesomeIcon icon={faMedal} className="h-5 w-5 text-gray-400" />;
    } else if (rank === 3) {
      return <FontAwesomeIcon icon={faMedal} className="h-5 w-5 text-orange-400" />;
    }
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getBadgeIcon = (badge) => {
    const icons = {
      environment: faTree,
      cleanup: faRecycle,
      education: faGraduationCap,
      community: faHandHoldingHeart
    };
    return icons[badge] || faAward;
  };

  const getBadgeColor = (badge) => {
    const colors = {
      environment: 'bg-green-100 text-green-800 border-green-200',
      cleanup: 'bg-blue-100 text-blue-800 border-blue-200',
      education: 'bg-purple-100 text-purple-800 border-purple-200',
      community: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[badge] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredData = leaderboardData[timeFilter]?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <FontAwesomeIcon icon={faTrophy} className="h-8 w-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Community Leaderboard</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrate our top volunteers and track your progress in making a difference
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  You
                </div>
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                  #{currentUser.rank}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{currentUser.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faAward} className="h-4 w-4 mr-1 text-green-500" />
                    {currentUser.points} points
                  </span>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-1 text-blue-500" />
                    {currentUser.events} events
                  </span>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faFire} className="h-4 w-4 mr-1 text-orange-500" />
                    {currentUser.streak} day streak
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white ${getLevelColor(currentUser.level)}`}>
                <FontAwesomeIcon icon={faMedal} className="h-4 w-4 mr-1" />
                {currentUser.level}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {currentUser.points} points to next level
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {timeFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 ${
                    timeFilter === filter.id
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search volunteers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Volunteer</div>
              <div className="col-span-2">Points</div>
              <div className="col-span-2">Events</div>
              <div className="col-span-2">Impact</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredData.map((user) => (
              <LeaderboardRow
                key={user.id}
                user={user}
                isExpanded={expandedUser === user.id}
                onExpand={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                getRankIcon={getRankIcon}
                getLevelColor={getLevelColor}
                getBadgeIcon={getBadgeIcon}
                getBadgeColor={getBadgeColor}
              />
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faTrophy} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Points Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Event Participation</h3>
              <p className="text-sm text-gray-600">100 points per event + bonus for duration</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Bring Friends</h3>
              <p className="text-sm text-gray-600">50 points for each friend you refer</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faFire} className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consistency</h3>
              <p className="text-sm text-gray-600">Streak bonuses for regular participation</p>
            </div>
            <div className="text-center p-4">
              <div className="bg-orange-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faStar} className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Special Achievements</h3>
              <p className="text-sm text-gray-600">Bonus points for milestones and impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardRow = ({ 
  user, 
  isExpanded, 
  onExpand, 
  getRankIcon, 
  getLevelColor, 
  getBadgeIcon, 
  getBadgeColor 
}) => {
  return (
    <div className="bg-white hover:bg-gray-50 transition duration-300">
      <div className="px-6 py-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-1">
            <div className="flex items-center justify-center">
              {getRankIcon(user.rank)}
            </div>
          </div>

          <div className="col-span-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${getLevelColor(user.level)}`}>
                    <FontAwesomeIcon icon={faMedal} className="h-3 w-3 mr-1" />
                    {user.level}
                  </span>
                  <span className="flex items-center text-xs text-gray-500">
                    <FontAwesomeIcon icon={faFire} className="h-3 w-3 mr-1 text-orange-500" />
                    {user.streak} days
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="text-lg font-bold text-gray-900">{user.points.toLocaleString()}</div>
            <div className="text-sm text-gray-500">points</div>
          </div>

          <div className="col-span-2">
            <div className="flex items-center text-gray-700">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <div className="font-semibold">{user.events}</div>
                <div className="text-sm text-gray-500">{user.hours} hours</div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <FontAwesomeIcon icon={faTree} className="h-4 w-4 text-green-500 mb-1" />
                <div className="text-xs font-semibold text-gray-900">{user.impact.treesPlanted}</div>
                <div className="text-xs text-gray-500">Trees</div>
              </div>
              <div>
                <FontAwesomeIcon icon={faRecycle} className="h-4 w-4 text-blue-500 mb-1" />
                <div className="text-xs font-semibold text-gray-900">{user.impact.wasteCollected}kg</div>
                <div className="text-xs text-gray-500">Waste</div>
              </div>
              <div>
                <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-purple-500 mb-1" />
                <div className="text-xs font-semibold text-gray-900">{user.impact.peopleHelped}</div>
                <div className="text-xs text-gray-500">People</div>
              </div>
            </div>
          </div>

          <div className="col-span-1 flex justify-end">
            <button
              onClick={onExpand}
              className="p-2 text-gray-400 hover:text-gray-600 transition duration-300"
            >
              <FontAwesomeIcon 
                icon={isExpanded ? faChevronUp : faChevronDown} 
                className="h-5 w-5" 
              />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Badges & Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(badge)}`}
                  >
                    <FontAwesomeIcon 
                      icon={getBadgeIcon(badge)} 
                      className="h-3 w-3 mr-1" 
                    />
                    {badge.charAt(0).toUpperCase() + badge.slice(1)}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-sm text-gray-600">Member Since</div>
                  <div className="font-semibold text-gray-900">
                    {new Date(user.joined).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-sm text-gray-600">Current Streak</div>
                  <div className="font-semibold text-gray-900 flex items-center">
                    <FontAwesomeIcon icon={faFire} className="h-4 w-4 mr-1 text-orange-500" />
                    {user.streak} days
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recent Impact</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Trees Planted</span>
                  <span className="font-semibold text-green-600">+{user.impact.treesPlanted}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Waste Collected</span>
                  <span className="font-semibold text-blue-600">+{user.impact.wasteCollected} kg</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">People Helped</span>
                  <span className="font-semibold text-purple-600">+{user.impact.peopleHelped}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Volunteer Hours</span>
                  <span className="font-semibold text-orange-600">+{user.hours} hrs</span>
                </div>
              </div>
              
              <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300">
                <FontAwesomeIcon icon={faShare} className="h-4 w-4 mr-2" />
                Share Achievement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;