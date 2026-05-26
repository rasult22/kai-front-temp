/**
 * Utility functions for detecting device types and operating systems
 */

/**
 * Detects if the current device is running iOS
 * @returns true if the device is running iOS, false otherwise
 */
export const isIOS = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // Check for iOS devices using user agent
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
  
  // Additional check for newer iOS devices that might not be detected by user agent
  const isIOSWebKit = /webkit/.test(userAgent) && !/android/.test(userAgent);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return isIOSDevice || (isIOSWebKit && isTouchDevice && /mobile|tablet/.test(userAgent));
};

/**
 * Detects if the current device is a mobile device
 * @returns true if the device is mobile, false otherwise
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
};