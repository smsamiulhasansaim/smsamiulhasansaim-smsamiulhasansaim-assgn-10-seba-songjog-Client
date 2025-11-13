// Navbar Component - Created by S M Samiul Hasan

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'framer-motion';
import {
  faBars,
  faTimes,
  faUser,
  faMapMarkerAlt,
  faCalendarAlt,
  faTrophy,
  faPlus,
  faHeart,
  faBell,
  faSearch,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../firebase/functions/authService';
import '../../assets/styles/Navbar.css';

// Component authored by: S M Samiul Hasan
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/', icon: faHeart },
    { name: 'Events', href: '/upcoming-events', icon: faCalendarAlt },
    { name: 'Leaderboard', href: '/leaderboard', icon: faTrophy },
    { name: 'Map', href: '/map', icon: faMapMarkerAlt },
  ];

  const userNavigation = [
    { name: 'My Profile', href: '/profile' },
    { name: 'Joined Events', href: '/joined-events' },
    { name: 'Manage Events', href: '/manage-events' },
    { name: 'Settings', href: '/settings' },
  ];

  const notifications = [
    { id: 1, text: 'Your event "Beach Cleanup" has been approved', time: '5 min ago', read: false },
    { id: 2, text: 'You earned 50 points for attending "Tree Planting"', time: '1 hour ago', read: false },
    { id: 3, text: 'New event near you: "Community Gardening"', time: '2 hours ago', read: true },
    { id: 4, text: 'You leveled up to Bronze!', time: '1 day ago', read: true },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
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

  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const notificationDotVariants = {
    initial: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const unreadNotifications = notifications.filter(notification => !notification.read).length;

  const userData = user ? {
    name: user.displayName || user.email?.split('@')[0] || 'User',
    points: 1250,
    level: 'Bronze',
    avatar: user.photoURL,
    email: user.email
  } : null;

  if (loading) {
    return (
      <motion.nav 
        className="navbar"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="navbar-brand">
              <div className="navbar-logo">
                <Link to="/" className="logo-link">
                  <div className="logo-icon">
                    <FontAwesomeIcon icon={faHeart} className="logo-icon-svg" />
                  </div>
                  <span className="logo-text">Seba-Songjog</span>
                </Link>
              </div>
            </div>
            <div className="navbar-actions">
              <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-24"></div>
            </div>
          </div>
        </div>
      </motion.nav>
    );
  }

  return (
    <motion.nav 
      className="navbar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="navbar-logo">
              <motion.div
                variants={logoVariants}
                initial="initial"
                whileHover="hover"
              >
                <Link to="/" className="logo-link">
                  <div className="logo-icon">
                    <FontAwesomeIcon icon={faHeart} className="logo-icon-svg" />
                  </div>
                  <span className="logo-text">
                    সেবা-সংযোগ
                  </span>
                </Link>
              </motion.div>
            </div>

            <div className="desktop-nav">
              <div className="nav-links">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    custom={index}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => 
                        `nav-link ${isActive ? 'nav-link-active' : ''}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <FontAwesomeIcon 
                            icon={item.icon} 
                            className={`nav-icon ${isActive ? 'nav-icon-active' : ''}`} 
                          />
                          {item.name}
                          {isActive && (
                            <motion.div 
                              className="nav-indicator"
                              layoutId="navbarIndicator"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="navbar-actions">
            {user && (
              <motion.div
                variants={buttonVariants} 
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/create-event"
                  className="create-event-btn"
                >
                  <FontAwesomeIcon icon={faPlus} className="btn-icon" />
                  Create Event
                </Link>
              </motion.div>
            )}

            <div className="action-item">
              <motion.button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="action-btn"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FontAwesomeIcon icon={faSearch} className="action-icon" />
              </motion.button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div 
                    className="dropdown search-dropdown"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="dropdown-content">
                      <form onSubmit={handleSearch} className="search-form">
                        <motion.input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search events, locations..."
                          className="search-input"
                          autoFocus
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        />
                        <motion.button
                          type="submit"
                          className="search-submit-btn"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <FontAwesomeIcon icon={faSearch} className="search-submit-icon" />
                        </motion.button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user && (
              <div className="action-item">
                <motion.button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="action-btn notification-btn"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FontAwesomeIcon icon={faBell} className="action-icon" />
                  {unreadNotifications > 0 && (
                    <motion.span 
                      className="notification-dot"
                      variants={notificationDotVariants}
                      initial="initial"
                      animate={["visible", "pulse"]}
                    />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div 
                      className="dropdown notification-dropdown"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="dropdown-header">
                        <h3 className="dropdown-title">Notifications</h3>
                        {unreadNotifications > 0 && (
                          <motion.span 
                            className="notification-badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            {unreadNotifications} new
                          </motion.span>
                        )}
                      </div>
                      
                      <div className="notification-list">
                        {notifications.length > 0 ? (
                          notifications.map((notification, index) => (
                            <motion.div
                              key={notification.id}
                              className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <div className="notification-text">{notification.text}</div>
                              <div className="notification-time">{notification.time}</div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="notification-empty">
                            No notifications
                          </div>
                        )}
                      </div>
                      
                      <div className="dropdown-footer">
                        <Link
                          to="/notifications"
                          className="dropdown-link"
                          onClick={() => setIsNotificationsOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user ? (
              <div className="action-item">
                <motion.button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="profile-btn"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="avatar">
                    {userData.avatar ? (
                      <img 
                        src={userData.avatar} 
                        alt={userData.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">{userData.name}</div>
                    <div className="profile-details">{userData.points} pts • {userData.level}</div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      className="dropdown profile-dropdown"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="dropdown-header profile-header">
                        <div className="flex items-center space-x-3">
                          <div className="avatar-lg">
                            {userData.avatar ? (
                              <img 
                                src={userData.avatar} 
                                alt={userData.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                                {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="profile-name-lg">{userData.name}</div>
                            <div className="profile-details-lg">{userData.points} points • {userData.level}</div>
                            <div className="profile-email">{userData.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="dropdown-divider"></div>
                      
                      {userNavigation.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={item.href}
                            className="dropdown-item"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FontAwesomeIcon icon={faUser} className="dropdown-item-icon" />
                            {item.name}
                          </Link>
                        </motion.div>
                      ))}
                      
                      <div className="dropdown-divider"></div>
                      
                      <div className="dropdown-footer">
                        <motion.button
                          onClick={handleLogout}
                          className="logout-btn"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
                          Sign out
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="auth-buttons">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/login"
                    className="login-btn"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} className="btn-icon" />
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/register"
                    className="signup-btn"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="btn-icon" />
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}

            <div className="mobile-menu-btn">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="menu-toggle-btn"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FontAwesomeIcon 
                  icon={isMenuOpen ? faTimes : faBars} 
                  className="menu-icon" 
                />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="mobile-menu-content">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => 
                      `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={item.icon} className="mobile-nav-icon" />
                    {item.name}
                  </NavLink>
                </motion.div>
              ))}

              {user && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navigation.length * 0.1 }}
                >
                  <Link
                    to="/create-event"
                    className="mobile-create-event-btn"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mobile-btn-icon" />
                    Create Event
                  </Link>
                </motion.div>
              )}

              {!user && (
                <motion.div 
                  className="mobile-auth-section"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (navigation.length + 1) * 0.1 }}
                >
                  <div className="mobile-auth-buttons">
                    <Link
                      to="/login"
                      className="mobile-login-btn"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faSignInAlt} className="mobile-btn-icon" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="mobile-signup-btn"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="mobile-btn-icon" />
                      Sign Up
                    </Link>
                  </div>
                </motion.div>
              )}

              {user && (
                <motion.div 
                  className="mobile-user-section"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (navigation.length + 1) * 0.1 }}
                >
                  <div className="mobile-profile">
                    <div className="mobile-avatar">
                      {userData.avatar ? (
                        <img 
                          src={userData.avatar} 
                          alt={userData.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                          {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="mobile-profile-info">
                      <div className="mobile-profile-name">{userData.name}</div>
                      <div className="mobile-profile-details">{userData.points} pts • {userData.level}</div>
                      <div className="mobile-profile-email">{userData.email}</div>
                    </div>
                  </div>
                  
                  {userNavigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        className="mobile-user-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUser} className="mobile-user-link-icon" />
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  <motion.button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="mobile-logout-btn"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (userNavigation.length + 1) * 0.05 }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mobile-logout-icon" />
                    Sign out
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;