import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logAnalyticsEvent, analyticsEvents } from '../firebase/initFirebase';

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    logAnalyticsEvent(analyticsEvents.PAGE_VIEW, {
      page_path: location.pathname,
      page_title: document.title
    });
  }, [location]);

  // Helper functions for common events
  const trackLogin = (method) => {
    logAnalyticsEvent(analyticsEvents.LOGIN, { method });
  };

  const trackLogout = () => {
    logAnalyticsEvent(analyticsEvents.LOGOUT);
  };

  const trackRegistration = (method) => {
    logAnalyticsEvent(analyticsEvents.REGISTER, { method });
  };

  const trackFeatureView = (featureName) => {
    logAnalyticsEvent(analyticsEvents.FEATURE_VIEW, { feature: featureName });
  };

  const trackFeatureInteraction = (featureName, action) => {
    logAnalyticsEvent(analyticsEvents.FEATURE_INTERACTION, {
      feature: featureName,
      action
    });
  };

  const trackError = (errorCode, errorMessage, componentName) => {
    logAnalyticsEvent(analyticsEvents.ERROR_OCCURRED, {
      error_code: errorCode,
      error_message: errorMessage,
      component: componentName
    });
  };

  const trackToolUsage = (toolName, action, details = {}) => {
    logAnalyticsEvent(
      action === 'start' ? analyticsEvents.TOOL_START : analyticsEvents.TOOL_COMPLETE,
      {
        tool_name: toolName,
        ...details
      }
    );
  };

  const trackAdminAction = (action, details = {}) => {
    logAnalyticsEvent(analyticsEvents.ADMIN_ACTION, {
      action,
      ...details
    });
  };

  return {
    trackLogin,
    trackLogout,
    trackRegistration,
    trackFeatureView,
    trackFeatureInteraction,
    trackError,
    trackToolUsage,
    trackAdminAction
  };
}; 