'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '../navigation';

// Enhanced consent types for GDPR compliance
export enum ConsentType {
  ESSENTIAL = 'essential',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  FUNCTIONAL = 'functional',
  PERSONALIZATION = 'personalization',
  DATA_TRANSFER = 'data_transfer',
  ALL = 'all',
  NONE = 'none'
}

// Detailed consent configuration
interface ConsentConfig {
  id: ConsentType;
  required: boolean;
  defaultEnabled: boolean;
  purposes: string[];
  dataTypes: string[];
  retention: string;
  thirdParties: string[];
}

// GDPR consent record
interface ConsentRecord {
  consents: Record<ConsentType, boolean>;
  timestamp: number;
  version: string;
  ip?: string;
  userAgent?: string;
  withdrawalMechanism: boolean;
  dataTransferConsent: boolean;
}

interface CookieConsentProps {}

const CookieConsent: React.FC<CookieConsentProps> = () => {
  const t = useTranslations('cookies');
  const [isVisible, setIsVisible] = useState(false);
  const [isEU, setIsEU] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDataTransfer, setShowDataTransfer] = useState(false);
  const [consents, setConsents] = useState<Record<ConsentType, boolean>>({
    [ConsentType.ESSENTIAL]: true,
    [ConsentType.ANALYTICS]: false,
    [ConsentType.MARKETING]: false,
    [ConsentType.FUNCTIONAL]: false,
    [ConsentType.PERSONALIZATION]: false,
    [ConsentType.DATA_TRANSFER]: false,
    [ConsentType.ALL]: false,
    [ConsentType.NONE]: false,
  });

  // GDPR consent configurations
  const consentConfigs: ConsentConfig[] = [
    {
      id: ConsentType.ESSENTIAL,
      required: true,
      defaultEnabled: true,
      purposes: ['Authentication', 'Security', 'Basic functionality'],
      dataTypes: ['Session data', 'Security tokens', 'User preferences'],
      retention: 'Session duration or until logout',
      thirdParties: ['None'],
    },
    {
      id: ConsentType.FUNCTIONAL,
      required: false,
      defaultEnabled: false,
      purposes: ['Enhanced user experience', 'Feature preferences', 'Language settings'],
      dataTypes: ['UI preferences', 'Feature usage', 'Language choice'],
      retention: '1 year',
      thirdParties: ['None'],
    },
    {
      id: ConsentType.ANALYTICS,
      required: false,
      defaultEnabled: false,
      purposes: ['Usage analytics', 'Performance monitoring', 'Error tracking'],
      dataTypes: ['Page views', 'Click events', 'Performance metrics', 'Error logs'],
      retention: '2 years',
      thirdParties: ['Google Analytics', 'Sentry'],
    },
    {
      id: ConsentType.PERSONALIZATION,
      required: false,
      defaultEnabled: false,
      purposes: ['Content personalization', 'Recommendation engine', 'User experience optimization'],
      dataTypes: ['Content preferences', 'Usage patterns', 'Interaction history'],
      retention: '1 year',
      thirdParties: ['None'],
    },
    {
      id: ConsentType.MARKETING,
      required: false,
      defaultEnabled: false,
      purposes: ['Marketing campaigns', 'Advertising', 'Newsletter'],
      dataTypes: ['Email address', 'Marketing preferences', 'Campaign interactions'],
      retention: '3 years or until withdrawal',
      thirdParties: ['Email service providers', 'Marketing platforms'],
    },
    {
      id: ConsentType.DATA_TRANSFER,
      required: false,
      defaultEnabled: false,
      purposes: ['Data processing in USA', 'Cloud storage', 'Service delivery'],
      dataTypes: ['All collected data types'],
      retention: 'As per individual consent categories',
      thirdParties: ['US-based cloud providers', 'CDN services'],
    },
  ];

  useEffect(() => {
    // Load existing consent record
    const loadExistingConsent = () => {
      try {
        const existingConsentStr = localStorage.getItem('gdpr-consent-record');
        if (existingConsentStr) {
          const consentRecord: ConsentRecord = JSON.parse(existingConsentStr);
          
          // Check if consent is still valid (not older than 1 year)
          const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
          if (consentRecord.timestamp > oneYearAgo) {
            setConsents(consentRecord.consents);
            setIsVisible(false);
            return true;
          } else {
            // Consent expired, remove it
            localStorage.removeItem('gdpr-consent-record');
            localStorage.removeItem('cookieConsent'); // Legacy cleanup
          }
        }
        
        // Check legacy consent for migration
        const legacyConsent = localStorage.getItem('cookieConsent');
        if (legacyConsent) {
          localStorage.removeItem('cookieConsent');
        }
        
        return false;
      } catch (error) {
        console.error('Error loading consent record:', error);
        return false;
      }
    };

    // Check if user is from EU with enhanced detection
    const checkEULocation = async () => {
      try {
        // Get the EU status from the header set by middleware
        const response = await fetch('/api/check-eu-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        const isEUFromHeader = data.isEU;
        
        setIsEU(isEUFromHeader);
        
        // Only show the banner for EU users if no valid consent exists
        if (isEUFromHeader && !loadExistingConsent()) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error determining EU location:', error);
        // Enhanced fallback detection
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;
        
        const euTimezones = [
          'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Europe/Rome',
          'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Vienna', 'Europe/Brussels',
          'Europe/Copenhagen', 'Europe/Stockholm', 'Europe/Helsinki', 'Europe/Warsaw',
          'Europe/Prague', 'Europe/Budapest', 'Europe/Bucharest', 'Europe/Sofia',
          'Europe/Athens', 'Europe/Dublin', 'Europe/Luxembourg', 'Europe/Ljubljana',
          'Europe/Bratislava', 'Europe/Tallinn', 'Europe/Riga', 'Europe/Vilnius',
          'Europe/Zagreb', 'Europe/Sarajevo', 'Europe/Skopje', 'Europe/Podgorica',
          'Atlantic/Azores', 'Atlantic/Madeira', 'Atlantic/Canary'
        ];
        
        const euLanguages = [
          'de', 'fr', 'it', 'es', 'nl', 'pl', 'ro', 'el', 'pt', 'cs', 'hu',
          'sv', 'da', 'fi', 'sk', 'bg', 'hr', 'sl', 'et', 'lv', 'lt', 'mt', 'ga'
        ];
        
        const isEUTimezone = euTimezones.includes(timezone);
        const isEULanguage = euLanguages.some(lang => language.startsWith(lang));
        
        const isEUFallback = isEUTimezone || isEULanguage;
        setIsEU(isEUFallback);
        
        // Show the banner if we think the user is from the EU and no valid consent exists
        if (isEUFallback && !loadExistingConsent()) {
          setIsVisible(true);
        }
      }
    };

    checkEULocation();
  }, []);

  // Save consent record with full GDPR compliance
  const saveConsentRecord = (newConsents: Record<ConsentType, boolean>) => {
    try {
      const consentRecord: ConsentRecord = {
        consents: newConsents,
        timestamp: Date.now(),
        version: '2.0',
        ip: undefined, // Will be logged server-side
        userAgent: navigator.userAgent,
        withdrawalMechanism: true,
        dataTransferConsent: newConsents[ConsentType.DATA_TRANSFER],
      };
      
      localStorage.setItem('gdpr-consent-record', JSON.stringify(consentRecord));
      
      // Send consent to server for audit trail
      fetch('/api/consent/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consentRecord),
      }).catch(error => console.error('Failed to record consent server-side:', error));
      
      // Apply consent settings
      applyConsentSettings(newConsents);
      
    } catch (error) {
      console.error('Error saving consent record:', error);
    }
  };

  // Apply consent settings to actual cookies and tracking
  const applyConsentSettings = (consentSettings: Record<ConsentType, boolean>) => {
    // Essential cookies (always enabled)
    if (consentSettings[ConsentType.ESSENTIAL]) {
      // These are always set for basic functionality
    }
    
    // Analytics cookies
    if (consentSettings[ConsentType.ANALYTICS]) {
      // Enable Google Analytics, error tracking, etc.
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    } else {
      // Disable analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }
    
    // Marketing cookies
    if (consentSettings[ConsentType.MARKETING]) {
      // Enable marketing tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted'
        });
      }
    } else {
      // Disable marketing
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
      }
    }
    
    // Functional cookies
    if (consentSettings[ConsentType.FUNCTIONAL]) {
      // Enable enhanced functionality
    }
    
    // Personalization cookies
    if (consentSettings[ConsentType.PERSONALIZATION]) {
      // Enable content personalization
    }
  };

  // Handle individual consent toggle
  const handleConsentToggle = (consentType: ConsentType, enabled: boolean) => {
    if (consentType === ConsentType.ESSENTIAL) return; // Cannot disable essential
    
    const newConsents = {
      ...consents,
      [consentType]: enabled,
    };
    
    setConsents(newConsents);
  };

  // Handle accept all
  const handleAcceptAll = () => {
    const allConsents = {
      [ConsentType.ESSENTIAL]: true,
      [ConsentType.FUNCTIONAL]: true,
      [ConsentType.ANALYTICS]: true,
      [ConsentType.PERSONALIZATION]: true,
      [ConsentType.MARKETING]: true,
      [ConsentType.DATA_TRANSFER]: true,
      [ConsentType.ALL]: true,
      [ConsentType.NONE]: false,
    };
    
    setConsents(allConsents);
    saveConsentRecord(allConsents);
    setIsVisible(false);
  };

  // Handle accept essential only
  const handleAcceptEssential = () => {
    const essentialOnly = {
      [ConsentType.ESSENTIAL]: true,
      [ConsentType.FUNCTIONAL]: false,
      [ConsentType.ANALYTICS]: false,
      [ConsentType.PERSONALIZATION]: false,
      [ConsentType.MARKETING]: false,
      [ConsentType.DATA_TRANSFER]: false,
      [ConsentType.ALL]: false,
      [ConsentType.NONE]: false,
    };
    
    setConsents(essentialOnly);
    saveConsentRecord(essentialOnly);
    setIsVisible(false);
  };

  // Handle save custom preferences
  const handleSavePreferences = () => {
    saveConsentRecord(consents);
    setIsVisible(false);
    setShowDetails(false);
  };

  // Handle withdrawal of consent
  const handleWithdrawConsent = () => {
    const withdrawnConsents = {
      [ConsentType.ESSENTIAL]: true, // Cannot withdraw essential
      [ConsentType.FUNCTIONAL]: false,
      [ConsentType.ANALYTICS]: false,
      [ConsentType.PERSONALIZATION]: false,
      [ConsentType.MARKETING]: false,
      [ConsentType.DATA_TRANSFER]: false,
      [ConsentType.ALL]: false,
      [ConsentType.NONE]: true,
    };
    
    setConsents(withdrawnConsents);
    saveConsentRecord(withdrawnConsents);
    
    // Clear existing cookies (except essential)
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (!['session', 'csrf', 'auth'].some(essential => name.includes(essential))) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
    
    setIsVisible(false);
    setShowDetails(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg"
        >
          <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{t('banner_title')}</h3>
                <p className="text-sm text-gray-300 mb-2">
                  {t('banner_description')}{' '}
                  <button 
                    onClick={toggleDetails}
                    className="text-primary-400 hover:underline focus:outline-none"
                  >
                    {showDetails ? t('hide_details') : t('show_details')}
                  </button>
                </p>
                
                {showDetails && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-4 bg-gray-800 p-3 rounded-lg"
                  >
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="essential-cookies"
                            checked
                            disabled
                            className="mr-2"
                          />
                          <label htmlFor="essential-cookies" className="font-medium">{t('essential_title')}</label>
                        </div>
                        <p className="text-gray-400 ml-6">{t('essential_description')}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="analytics-cookies"
                            checked={consents[ConsentType.ANALYTICS]}
                            onChange={(e) => handleConsentToggle(ConsentType.ANALYTICS, e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor="analytics-cookies" className="font-medium">{t('analytics_title')}</label>
                        </div>
                        <p className="text-gray-400 ml-6">{t('analytics_description')}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="marketing-cookies"
                            checked={consents[ConsentType.MARKETING]}
                            onChange={(e) => handleConsentToggle(ConsentType.MARKETING, e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor="marketing-cookies" className="font-medium">{t('marketing_title')}</label>
                        </div>
                        <p className="text-gray-400 ml-6">{t('marketing_description')}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div className="text-xs text-gray-400">
                  {t('learn_more')}{' '}
                  <Link href="/privacy" className="text-primary-400 hover:underline">
                    {t('privacy_policy')}  
                  </Link>
                  {' '}{t('and')}{' '}
                  <Link href="/cookies" className="text-primary-400 hover:underline">
                    {t('cookie_policy')}
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleAcceptEssential}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {t('essential_only')}
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  {t('accept_selected')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  {t('accept_all')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;