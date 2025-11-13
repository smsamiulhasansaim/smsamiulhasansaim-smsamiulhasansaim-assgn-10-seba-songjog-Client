// Footer Component - Created by S M Samiul Hasan
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { 
  faHeart,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faShieldAlt,
  faUsers,
  faTree,
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';

// Component authored by: S M Samiul Hasan
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const services = [
    { name: 'Tree Plantation', icon: faTree },
    { name: 'Cleanup Drive', icon: faShieldAlt },
    { name: 'Community Help', icon: faUsers },
    { name: 'Social Service', icon: faHandHoldingHeart }
  ];

  const socialLinks = [
    { icon: faFacebook, href: '#', color: 'hover:text-blue-600' },
    { icon: faTwitter, href: '#', color: 'hover:text-blue-400' },
    { icon: faInstagram, href: '#', color: 'hover:text-pink-500' },
    { icon: faLinkedin, href: '#', color: 'hover:text-blue-700' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
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

  const socialIconVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const linkItemVariants = {
    initial: { x: 0 },
    hover: {
      x: 10,
      transition: {
        duration: 0.3,
        ease: "easeOut"
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

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.footer 
      className="bg-gray-900 text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <motion.div 
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <motion.div 
              className="flex items-center mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center"
                variants={pulseVariants}
                initial="initial"
                animate="pulse"
              >
                <FontAwesomeIcon icon={faHeart} className="text-white text-lg" />
              </motion.div>
              <span className="ml-3 text-2xl font-bold">সেবা-সংযোগ</span>
            </motion.div>
            <motion.p 
              className="text-gray-300 mb-4 text-sm leading-relaxed"
              variants={itemVariants}
            >
              Connecting volunteers with meaningful community service opportunities through AI-powered recommendations and real-time tracking.
            </motion.p>
            <motion.div 
              className="flex space-x-4"
              variants={containerVariants}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition duration-300`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap={{ scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FontAwesomeIcon icon={social.icon} className="h-5 w-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <motion.h3 
              className="text-lg font-semibold mb-4 flex items-center"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2 text-green-400" />
              Quick Links
            </motion.h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  variants={linkItemVariants}
                  whileHover="hover"
                >
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-green-400 transition duration-300 flex items-center group"
                  >
                    <motion.span 
                      className="w-2 h-2 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition duration-300"
                      whileHover={{ scale: 1.5 }}
                    ></motion.span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <motion.h3 
              className="text-lg font-semibold mb-4 flex items-center"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <FontAwesomeIcon icon={faHandHoldingHeart} className="h-4 w-4 mr-2 text-green-400" />
              Our Services
            </motion.h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-center text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5, color: "#4ADE80" }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FontAwesomeIcon 
                      icon={service.icon} 
                      className="h-3 w-3 mr-3 text-green-400" 
                    />
                  </motion.div>
                  {service.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <motion.h3 
              className="text-lg font-semibold mb-4 flex items-center"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <FontAwesomeIcon icon={faPhone} className="h-4 w-4 mr-2 text-green-400" />
              Contact Us
            </motion.h3>
            <div className="space-y-3">
              {[
                { icon: faMapMarkerAlt, text: 'Dhaka, Bangladesh' },
                { icon: faPhone, text: '+880 1XXX-XXXXXX' },
                { icon: faEnvelope, text: 'contact@seba-songjog.org' }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center text-gray-300"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5, color: "#4ADE80" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FontAwesomeIcon 
                      icon={contact.icon} 
                      className="h-4 w-4 mr-3 text-green-400" 
                    />
                  </motion.div>
                  <span className="text-sm">{contact.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-semibold mb-2">Stay Updated</h4>
              <div className="flex">
                <motion.input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-gray-800 text-white text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.button 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-lg transition duration-300 text-sm font-medium"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Join
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="border-t border-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-gray-400 text-sm mb-2 md:mb-0"
              variants={itemVariants}
            >
              © {currentYear} সেবা-সংযোগ. All rights reserved.
            </motion.div>
            <motion.div 
              className="flex space-x-6 text-sm text-gray-400"
              variants={containerVariants}
            >
              {[
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Cookie Policy', href: '/cookies' }
              ].map((link, index) => (
                <motion.a 
                  key={index}
                  href={link.href} 
                  className="hover:text-green-400 transition duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;