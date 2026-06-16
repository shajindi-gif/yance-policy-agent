/**
 * YanCe Policy Agent - Safari Extension Background Script
 * Handles cross-browser API compatibility (chrome.* vs browser.*)
 */

// Safari uses browser.* namespace; this normalizes to chrome.*
if (typeof browser !== 'undefined' && typeof chrome === 'undefined') {
  self.chrome = browser;
}

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('YanCe Policy Agent v2.0 installed');
  }
});
