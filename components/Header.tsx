'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

type Language = {
  code: string;
  name: string;
  flag: string;
  locale: string;
};

const languages: Language[] = [
  { code: 'EN', name: 'English', flag: '🇺🇸', locale: 'en' }
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  
  // Default to English
  const currentLanguage = languages[0];

  // Check system preference for dark mode on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true' || 
                    (!('darkMode' in localStorage) && 
                     window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDarkMode(isDark);
      
      // Apply dark mode class to document if needed
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(newMode));
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Convert', href: '/convert' },
    { name: 'Tools', href: '/tools' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Badges', href: '/badges' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close other menus if open
    if (isLanguageMenuOpen) setIsLanguageMenuOpen(false);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const handleLanguageChange = async (lang: Language) => {
    setIsLanguageMenuOpen(false);
    // Language switching is disabled as i18n has been removed
  };

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled 
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg' 
        : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-md'} border-b border-gray-200/30 dark:border-gray-800/30`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center group">
                <motion.div 
                  className="mr-2 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 rounded-lg shadow-lg ring-2 ring-white/10 dark:ring-gray-800/20"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
                >
                  <span className="text-white font-bold text-lg">CV</span>
                </motion.div>
                <motion.span 
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-500 dark:from-primary-400 dark:via-secondary-400 dark:to-primary-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  ConvertViral
                </motion.span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(link.href) 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side controls */}
          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <span className="mr-1">{currentLanguage.flag}</span>
                <span>{currentLanguage.code}</span>
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang)}
                          className={`w-full text-left px-4 py-2 text-sm ${currentLanguage.code === lang.code 
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          role="menuitem"
                        >
                          <span className="mr-2">{lang.flag}</span>
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* User Profile/Login Button */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-sm font-medium text-white rounded-md px-4 py-2 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-500 hover:from-primary-700 hover:via-secondary-700 hover:to-primary-600 shadow-md hover:shadow-lg transition-all duration-200 border border-white/10 dark:border-gray-800/30"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/challenges"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Daily Challenges
                        </Link>
                        <Link
                          href="/badges"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          My Badges
                        </Link>
                        <Link
                          href="/api/auth/signout"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
                          role="menuitem"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Sign out
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="flex items-center text-sm font-medium text-white rounded-md px-4 py-2 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-500 hover:from-primary-700 hover:via-secondary-700 hover:to-primary-600 shadow-md hover:shadow-lg transition-all duration-200 border border-white/10 dark:border-gray-800/30"
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.href) 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4 py-2">
                {/* Language Selector */}
                <div className="flex-1">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">Language</div>
                  <div className="flex mt-1 space-x-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className={`flex items-center justify-center h-8 w-8 rounded-full ${currentLanguage.code === lang.code 
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                      >
                        <span>{lang.flag}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-3 px-2 space-y-1">
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/challenges"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Challenges
                    </Link>
                    <Link
                      href="/api/auth/signout"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Sign out
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/api/auth/signin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;