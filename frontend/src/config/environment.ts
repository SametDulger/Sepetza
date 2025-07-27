export const config = {
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5205/api',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Feature Flags
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableDebugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
  
  // External Services
  googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
  sentryDsn: process.env.REACT_APP_SENTRY_DSN || '',
  
  // App Configuration
  appName: 'Sepetza',
  appVersion: '1.0.0',
  
  // Default Settings
  defaultPageSize: 12,
  maxCartItems: 99,
  maxQuantityPerItem: 10,
  
  // Timeouts
  requestTimeout: 30000, // 30 seconds
  tokenRefreshInterval: 5 * 60 * 1000, // 5 minutes
} as const;

export default config; 