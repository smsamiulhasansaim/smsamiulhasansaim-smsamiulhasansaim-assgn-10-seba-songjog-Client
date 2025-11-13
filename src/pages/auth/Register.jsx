// Register Component - Created by S M Samiul Hasan

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUser,
  faHeart,
  faArrowRight,
  faPhone,
  faMapMarkerAlt,
  faCheckCircle,
  faExclamationTriangle,
  faShieldAlt,
  faAward,
  faUsers,
  faStar,
  faEnvelopeOpenText
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { registerWithEmail, loginWithGoogle, loginWithGitHub } from '../../firebase/functions/authService';

// Component authored by: S M Samiul Hasan
const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [verificationSent, setVerificationSent] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (passwordStrength < 2) {
      newErrors.password = 'Password is too weak';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setSuccess(false);
    setVerificationSent(false);
    
    try {
      const result = await registerWithEmail(formData.email, formData.password, formData.fullName);
      
      if (result.success) {
        console.log('Registration successful - Verification email sent');
        setSuccess(true);
        setVerificationSent(true);
        
        setTimeout(() => {
          window.location.href = '/login?message=email_verification_required';
        }, 3000);
        
      } else {
        setErrors({ submit: result.error });
      }
      
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider) => {
    setIsLoading(true);
    setErrors({});
    setVerificationSent(false);
    
    try {
      let result;
      if (provider === 'google') {
        result = await loginWithGoogle();
      } else if (provider === 'github') {
        result = await loginWithGitHub();
      }
      
      if (result && result.success) {
        console.log(`Registered with ${provider}:`, result.user);
        setSuccess(true);
        
        setTimeout(() => {
          window.location.href = '/Home';
        }, 2000);
      } else if (result) {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: `${provider} registration failed` });
    } finally {
      setIsLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    out: { 
      opacity: 0, 
      scale: 1.05,
      transition: { 
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    initial: { 
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }
    },
    tap: { 
      scale: 0.98,
      boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)"
    }
  };

  const inputVariants = {
    initial: { scale: 1 },
    focus: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    error: {
      x: [0, -5, 5, -5, 0],
      transition: { duration: 0.4 }
    }
  };

  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-emerald-500'
  ];

  const strengthLabels = [
    'Very Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong'
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-100 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {success && (
              <motion.div
                className={`p-6 text-center ${
                  verificationSent 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600'
                } text-white`}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <FontAwesomeIcon 
                    icon={verificationSent ? faEnvelopeOpenText : faCheckCircle} 
                    className="h-12 w-12 text-white mb-2" 
                  />
                  <h3 className="text-xl font-bold">
                    {verificationSent 
                      ? 'রেজিস্ট্রেশন সফল!' 
                      : 'স্বাগতম!'}
                  </h3>
                  
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2">
                      {verificationSent 
                        ? 'আপনার ইমেইলে ভেরিফিকেশন লিংক পাঠানো হয়েছে' 
                        : 'আপনার অ্যাকাউন্ট তৈরি হয়েছে!'}
                    </p>
                    
                    {verificationSent && (
                      <>
                        <p className="text-sm mb-4">
                          ইমেইল ভেরিফাই করলেই আপনি লগইন করতে পারবেন
                        </p>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="bg-white/20 rounded-lg p-3"
                        >
                          <p className="text-sm font-medium">
                            লগইন পেজে redirect হচ্ছে... <span className="font-bold">৩ সেকেন্ড</span>
                          </p>
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <div className="p-8 sm:p-10">
              <motion.div 
                className="text-center mb-8"
                variants={itemVariants}
              >
                <motion.div 
                  className="flex justify-center items-center mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="h-16 w-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1 
                    }}
                    transition={{ 
                      rotate: { duration: 0.8, ease: "easeInOut" },
                      scale: { duration: 0.3 }
                    }}
                  >
                    <FontAwesomeIcon 
                      icon={faHeart} 
                      className="text-white text-2xl" 
                    />
                  </motion.div>
                  <motion.span 
                    className="ml-4 text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    সেবা-সংযোগ
                  </motion.span>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl font-bold text-gray-900 mb-3"
                  variants={itemVariants}
                >
                  অ্যাকাউন্ট তৈরি করুন
                </motion.h2>
                <motion.p 
                  className="text-gray-600 text-lg"
                  variants={itemVariants}
                >
                  কমিউনিটির সাথে যুক্ত হোন এবং পরিবর্তন শুরু করুন
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={itemVariants}>
                  <motion.div 
                    className="grid grid-cols-2 gap-3 mb-6"
                    variants={itemVariants}
                  >
                    <motion.button
                      onClick={() => handleSocialRegister('google')}
                      className="group relative w-full flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:border-gray-300 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      variants={buttonVariants}
                      initial="initial"
                      whileHover={!isLoading ? "hover" : {}}
                      whileTap={!isLoading ? "tap" : {}}
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <FontAwesomeIcon 
                        icon={faGoogle} 
                        className="h-4 w-4 text-red-500 mr-2" 
                      />
                      Google
                    </motion.button>

                    <motion.button
                      onClick={() => handleSocialRegister('github')}
                      className="group relative w-full flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:border-gray-300 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      variants={buttonVariants}
                      initial="initial"
                      whileHover={!isLoading ? "hover" : {}}
                      whileTap={!isLoading ? "tap" : {}}
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <FontAwesomeIcon 
                        icon={faGithub} 
                        className="h-4 w-4 text-gray-800 mr-2" 
                      />
                      GitHub
                    </motion.button>
                  </motion.div>

                  <motion.div 
                    className="relative my-6"
                    variants={itemVariants}
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <motion.span 
                        className="px-3 bg-white text-gray-500 font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        অথবা ইমেইলে রেজিস্ট্রেশন করুন
                      </motion.span>
                    </div>
                  </motion.div>

                  <motion.form 
                    className="space-y-4"
                    onSubmit={handleSubmit}
                    variants={containerVariants}
                  >
                    <motion.div variants={itemVariants}>
                      <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                        পূর্ণ নাম
                      </label>
                      <motion.div
                        variants={inputVariants}
                        initial="initial"
                        whileFocus="focus"
                        animate={errors.fullName ? "error" : "initial"}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon 
                            icon={faUser} 
                            className={`h-4 w-4 transition-colors duration-300 ${
                              errors.fullName ? 'text-red-500' : 'text-gray-400'
                            }`} 
                          />
                        </div>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-sm disabled:opacity-50 ${
                            errors.fullName 
                              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                          }`}
                          placeholder="আপনার পূর্ণ নাম লিখুন"
                          disabled={isLoading}
                        />
                      </motion.div>
                      <AnimatePresence>
                        {errors.fullName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-600 text-xs flex items-center space-x-1 mt-1"
                          >
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3" />
                            <span>{errors.fullName}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        ইমেইল ঠিকানা
                      </label>
                      <motion.div
                        variants={inputVariants}
                        initial="initial"
                        whileFocus="focus"
                        animate={errors.email ? "error" : "initial"}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon 
                            icon={faEnvelope} 
                            className={`h-4 w-4 transition-colors duration-300 ${
                              errors.email ? 'text-red-500' : 'text-gray-400'
                            }`} 
                          />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-sm disabled:opacity-50 ${
                            errors.email 
                              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                          }`}
                          placeholder="আপনার ইমেইল লিখুন"
                          disabled={isLoading}
                        />
                      </motion.div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-600 text-xs flex items-center space-x-1 mt-1"
                          >
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3" />
                            <span>{errors.email}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        ফোন নম্বর
                      </label>
                      <motion.div
                        variants={inputVariants}
                        initial="initial"
                        whileFocus="focus"
                        animate={errors.phone ? "error" : "initial"}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon 
                            icon={faPhone} 
                            className={`h-4 w-4 transition-colors duration-300 ${
                              errors.phone ? 'text-red-500' : 'text-gray-400'
                            }`} 
                          />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-sm disabled:opacity-50 ${
                            errors.phone 
                              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                          }`}
                          placeholder="আপনার ফোন নম্বর লিখুন"
                          disabled={isLoading}
                        />
                      </motion.div>
                      <AnimatePresence>
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-600 text-xs flex items-center space-x-1 mt-1"
                          >
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3" />
                            <span>{errors.phone}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                        লোকেশন
                      </label>
                      <motion.div
                        variants={inputVariants}
                        initial="initial"
                        whileFocus="focus"
                        animate={errors.location ? "error" : "initial"}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon 
                            icon={faMapMarkerAlt} 
                            className={`h-4 w-4 transition-colors duration-300 ${
                              errors.location ? 'text-red-500' : 'text-gray-400'
                            }`} 
                          />
                        </div>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          required
                          value={formData.location}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-sm disabled:opacity-50 ${
                            errors.location 
                              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                          }`}
                          placeholder="আপনার লোকেশন লিখুন"
                          disabled={isLoading}
                        />
                      </motion.div>
                      <AnimatePresence>
                        {errors.location && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-600 text-xs flex items-center space-x-1 mt-1"
                          >
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3" />
                            <span>{errors.location}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        পাসওয়ার্ড
                      </label>
                      <motion.div
                        variants={inputVariants}
                        initial="initial"
                        whileFocus="focus"
                        animate={errors.password ? "error" : "initial"}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon 
                            icon={faLock} 
                            className={`h-4 w-4 transition-colors duration-300 ${
                              errors.password ? 'text-red-500' : 'text-gray-400'
                            }`} 
                          />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-sm disabled:opacity-50 ${
                            errors.password 
                              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                          }`}
                          placeholder="পাসওয়ার্ড তৈরি করুন"
                          disabled={isLoading}
                        />
                        <motion.button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                          onClick={() => setShowPassword(!showPassword)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={isLoading}
                        >
                          <FontAwesomeIcon 
                            icon={showPassword ? faEyeSlash : faEye} 
                            className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-300" 
                          />
                        </motion.button>
                      </motion.div>
                      
                      {formData.password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2 space-y-1"
                        >
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>পাসওয়ার্ড স্ট্রেন্থ:</span>
                            <span className={`font-semibold ${
                              passwordStrength === 0 ? 'text-red-600' :
                              passwordStrength === 1 ? 'text-orange-600' :
                              passwordStrength === 2 ? 'text-yellow-600' :
                              passwordStrength === 3 ? 'text-green-600' : 'text-emerald-600'
                            }`}>
                              {strengthLabels[passwordStrength]}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <motion.div
                              className={`h-1.5 rounded-full ${strengthColors[passwordStrength]}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </motion.div>
                      )}
                      
                      <AnimatePresence>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-600 text-xs flex items-center space-x-1 mt-1"
                          >
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3" />
                            <span>{errors.password}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        পাসওয়ার্ড নিশ্চিত করুন
                      </label>
                      <motion.div
                        variants={inputVariants}
                        initial="initial"
                        whileFocus="focus"
                        animate={errors.confirmPassword ? "error" : "initial"}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon 
                            icon={faLock} 
                            className={`h-4 w-4 transition-colors duration-300 ${
                              errors.confirmPassword ? 'text-red-500' : 'text-gray-400'
                            }`} 
                          />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-sm disabled:opacity-50 ${
                            errors.confirmPassword 
                              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                          }`}
                          placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                          disabled={isLoading}
                        />
                        <motion.button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={isLoading}
                        >
                          <FontAwesomeIcon 
                            icon={showConfirmPassword ? faEyeSlash : faEye} 
                            className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-300" 
                          />
                        </motion.button>
                      </motion.div>
                      <AnimatePresence>
                        {errors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-600 text-xs flex items-center space-x-1 mt-1"
                          >
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3" />
                            <span>{errors.confirmPassword}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div 
                      className="flex items-start space-x-3 pt-2"
                      variants={itemVariants}
                    >
                      <motion.input
                        id="agree-terms"
                        name="agree-terms"
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1 cursor-pointer transition-colors duration-300 disabled:opacity-50"
                        whileTap={{ scale: 0.9 }}
                        disabled={isLoading}
                      />
                      <label htmlFor="agree-terms" className="text-sm text-gray-700 cursor-pointer">
                        আমি согласен с{' '}
                        <a href="/terms" className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors duration-300">
                          সেবার শর্তাবলী
                        </a>{' '}
                        এবং{' '}
                        <a href="/privacy" className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors duration-300">
                          গোপনীয়তা নীতি
                        </a>
                      </label>
                    </motion.div>
                    <AnimatePresence>
                      {errors.terms && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-600 text-xs flex items-center space-x-1"
                        >
                          <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3" />
                          <span>{errors.terms}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <motion.div 
                      className="pt-4"
                      variants={itemVariants}
                    >
                      <motion.button
                        type="submit"
                        className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 overflow-hidden shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        variants={buttonVariants}
                        initial="initial"
                        whileHover={!isLoading && agreeToTerms ? "hover" : {}}
                        whileTap={!isLoading && agreeToTerms ? "tap" : {}}
                        disabled={isLoading || !agreeToTerms}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        
                        {isLoading && (
                          <motion.div
                            className="absolute inset-0 bg-emerald-700"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                        
                        <span className="absolute left-6 inset-y-0 flex items-center">
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <FontAwesomeIcon 
                                icon={faUser} 
                                className="h-5 w-5 text-emerald-200" 
                              />
                            </motion.div>
                          ) : (
                            <FontAwesomeIcon 
                              icon={faUser} 
                              className="h-5 w-5 text-emerald-200 group-hover:text-white transition-colors duration-300" 
                            />
                          )}
                        </span>
                        
                        {isLoading ? (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            অ্যাকাউন্ট তৈরি হচ্ছে...
                          </motion.span>
                        ) : (
                          <motion.span
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                          >
                            অ্যাকাউন্ট তৈরি করুন
                          </motion.span>
                        )}
                      </motion.button>
                    </motion.div>

                    <AnimatePresence>
                      {errors.submit && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-red-50 border border-red-200 rounded-xl p-3 text-center"
                        >
                          <p className="text-red-700 text-sm flex items-center justify-center space-x-2">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4" />
                            <span>{errors.submit}</span>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.form>

                  <motion.div 
                    className="text-center mt-6 pt-4 border-t border-gray-200"
                    variants={itemVariants}
                  >
                    <p className="text-gray-600 text-sm">
                      ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                      <motion.a 
                        href="/login" 
                        className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors duration-300 inline-flex items-center group"
                        whileHover={{ x: 5 }}
                      >
                        লগইন করুন
                        <FontAwesomeIcon 
                          icon={faArrowRight} 
                          className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" 
                        />
                      </motion.a>
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200"
                  variants={itemVariants}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-emerald-500 mr-2" />
                    কেন যোগ দিবেন সেবা-সংযোগে?
                  </h3>
                  <div className="space-y-4">
                    <motion.div 
                      className="flex items-start space-x-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">কমিউনিটির সাথে যুক্ত হোন</h4>
                        <p className="text-sm text-gray-600 mt-1">স্থানীয় সেবা ইভেন্টে যোগ দিন এবং সমমনা স্বেচ্ছাসেবকদের সাথে পরিচিত হোন</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-start space-x-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faAward} className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">আপনার প্রভাব ট্র্যাক করুন</h4>
                        <p className="text-sm text-gray-600 mt-1">আপনার অবদান মনিটর করুন এবং অর্জন ব্যাজ অর্জন করুন</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-start space-x-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faShieldAlt} className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">AI-পাওয়ার্ড ম্যাচিং</h4>
                        <p className="text-sm text-gray-600 mt-1">আপনার আগ্রহের উপর ভিত্তি করে ব্যক্তিগতকৃত ইভেন্ট সুপারিশ পান</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-start space-x-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faHeart} className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">প্রকৃত প্রভাব তৈরি করুন</h4>
                        <p className="text-sm text-gray-600 mt-1">গুরুত্বপূর্ণ কারণগুলিতে অবদান রাখুন এবং ইতিবাচক পরিবর্তন তৈরি করুন</p>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div 
                    className="mt-6 p-4 bg-white rounded-xl border border-emerald-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-emerald-600">৫০০+</div>
                        <div className="text-xs text-gray-600">সক্রিয় স্বেচ্ছাসেবক</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-emerald-600">১৫০+</div>
                        <div className="text-xs text-gray-600">সম্পন্ন ইভেন্ট</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;