// Login Component - Created by S M Samiul Hasan

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faHeart,
  faArrowRight,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { loginWithEmail, loginWithGoogle, loginWithGitHub } from '../../firebase/functions/authService';
import { useAuth } from '../../context/AuthContext';

// Component authored by: S M Samiul Hasan
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const { redirectPath } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'ইমেইল প্রয়োজন';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'ইমেইল ঠিকানা সঠিক নয়';
    }
    
    if (!formData.password) {
      newErrors.password = 'পাসওয়ার্ড প্রয়োজন';
    } else if (formData.password.length < 6) {
      newErrors.password = 'পাসওয়ার্ড অন্তত ৬ ক্যারেক্টার হতে হবে';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    try {
      const result = await loginWithEmail(formData.email, formData.password);
      
      if (result.success) {
        console.log('লগইন সফল:', result.user);
        setSuccess(true);
        
        const redirectTo = redirectPath || '/';
        
        setTimeout(() => {
          setFormData({ email: '', password: '' });
          setSuccess(false);
          window.location.href = redirectTo;
        }, 2000);
      } else {
        setErrors({ submit: result.error });
      }
      
    } catch (error) {
      console.error('লগইন ব্যর্থ:', error);
      setErrors({ submit: 'লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setErrors({});
    
    try {
      let result;
      if (provider === 'google') {
        result = await loginWithGoogle();
      } else if (provider === 'github') {
        result = await loginWithGitHub();
      }
      
      if (result && result.success) {
        console.log(`${provider} দিয়ে লগইন সফল:`, result.user);
        setSuccess(true);
        
        const redirectTo = redirectPath || '/';
        
        setTimeout(() => {
          setSuccess(false);
          window.location.href = redirectTo;
        }, 2000);
      } else if (result) {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      error.setErrors({ submit: `${provider} লগইন ব্যর্থ হয়েছে` });
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
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
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
    },
    loading: {
      scale: 0.98,
      transition: { duration: 0.2 }
    }
  };

  const inputVariants = {
    initial: { scale: 1 },
    focus: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    error: {
      x: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 }
    }
  };

  const successVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      y: 20 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 200 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: -20 
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-100 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      <div className="max-w-md w-full">
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {success && (
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 text-center"
                variants={successVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5" />
                  <span className="font-semibold">লগইন সফল! রিডাইরেক্ট হচ্ছে...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-8 sm:p-10">
            <motion.div 
              className="text-center mb-10"
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
                আবারো স্বাগতম
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-lg"
                variants={itemVariants}
              >
                সেবা ও প্রভাবের যাত্রা অব্যাহত রাখুন
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => handleSocialLogin('google')}
                className="group relative w-full flex justify-center items-center py-4 px-6 border-2 border-gray-200 rounded-2xl bg-white text-base font-semibold text-gray-700 hover:border-gray-300 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                initial="initial"
                whileHover={!isLoading ? "hover" : {}}
                whileTap={!isLoading ? "tap" : {}}
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <FontAwesomeIcon 
                  icon={faGoogle} 
                  className="h-5 w-5 text-red-500 mr-3" 
                />
                Google
              </motion.button>

              <motion.button
                onClick={() => handleSocialLogin('github')}
                className="group relative w-full flex justify-center items-center py-4 px-6 border-2 border-gray-200 rounded-2xl bg-white text-base font-semibold text-gray-700 hover:border-gray-300 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                variants={buttonVariants}
                initial="initial"
                whileHover={!isLoading ? "hover" : {}}
                whileTap={!isLoading ? "tap" : {}}
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <FontAwesomeIcon 
                  icon={faGithub} 
                  className="h-5 w-5 text-gray-800 mr-3" 
                />
                GitHub
              </motion.button>
            </motion.div>

            <motion.div 
              className="relative my-8"
              variants={itemVariants}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <motion.span 
                  className="px-4 bg-white text-gray-500 font-medium"
                  whileHover={{ scale: 1.1 }}
                >
                  অথবা ইমেইলে লগইন করুন
                </motion.span>
              </div>
            </motion.div>

            <motion.form 
              className="space-y-6"
              onSubmit={handleSubmit}
              variants={containerVariants}
            >
              <motion.div 
                className="space-y-2"
                variants={itemVariants}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  ইমেইল ঠিকানা
                </label>
                <motion.div
                  variants={inputVariants}
                  initial="initial"
                  whileFocus="focus"
                  animate={errors.email ? "error" : "initial"}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      className={`h-5 w-5 transition-colors duration-300 ${
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
                    className={`block w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg disabled:opacity-50 ${
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
                      className="text-red-600 text-sm flex items-center space-x-1"
                    >
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3" />
                      <span>{errors.email}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div 
                className="space-y-2"
                variants={itemVariants}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  পাসওয়ার্ড
                </label>
                <motion.div
                  variants={inputVariants}
                  initial="initial"
                  whileFocus="focus"
                  animate={errors.password ? "error" : "initial"}
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon 
                      icon={faLock} 
                      className={`h-5 w-5 transition-colors duration-300 ${
                        errors.password ? 'text-red-500' : 'text-gray-400'
                      }`} 
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg disabled:opacity-50 ${
                      errors.password 
                        ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                    }`}
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    disabled={isLoading}
                  />
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center disabled:opacity-50"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon 
                      icon={showPassword ? faEyeSlash : faEye} 
                      className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-300" 
                    />
                  </motion.button>
                </motion.div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-600 text-sm flex items-center space-x-1"
                    >
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3" />
                      <span>{errors.password}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-between gap-4"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <motion.input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded-xl cursor-pointer transition-colors duration-300 disabled:opacity-50"
                    whileTap={{ scale: 0.9 }}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                    আমাকে মনে রাখুন
                  </label>
                </div>

                <motion.a 
                  href="/forgot-password" 
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors duration-300 inline-flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                  <FontAwesomeIcon 
                    icon={faArrowRight} 
                    className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" 
                  />
                </motion.a>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="group relative w-full flex justify-center items-center py-5 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 overflow-hidden shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover={!isLoading ? "hover" : {}}
                  whileTap={!isLoading ? "tap" : {}}
                  disabled={isLoading}
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
                          icon={faArrowRight} 
                          className="h-5 w-5 text-emerald-200" 
                        />
                      </motion.div>
                    ) : (
                      <FontAwesomeIcon 
                        icon={faArrowRight} 
                        className="h-5 w-5 text-emerald-200 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1 transition-transform duration-300" 
                      />
                    )}
                  </span>
                  
                  {isLoading ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      লগইন হচ্ছে...
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                    >
                      অ্যাকাউন্টে লগইন করুন
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
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center"
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
              className="text-center mt-8 pt-6 border-t border-gray-200"
              variants={itemVariants}
            >
              <p className="text-gray-600 text-base">
                অ্যাকাউন্ট নেই?{' '}
                <motion.a 
                  href="/register" 
                  className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors duration-300 inline-flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  এখনই তৈরি করুন
                  <FontAwesomeIcon 
                    icon={faArrowRight} 
                    className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                  />
                </motion.a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xs text-gray-500">
            লগইন করলে আপনি আমাদের{' '}
            <motion.a 
              href="/community-guidelines" 
              className="text-emerald-600 hover:text-emerald-500 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              কমিউনিটি গাইডলাইন
            </motion.a>{' '}
            এবং{' '}
            <motion.a 
              href="/privacy-policy" 
              className="text-emerald-600 hover:text-emerald-500 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              গোপনীয়তা নীতি
            </motion.a>{' '}
            মেনে নিচ্ছেন
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;