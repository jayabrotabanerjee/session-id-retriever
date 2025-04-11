// Background script to handle storage and messaging
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'storeData') {
    chrome.storage.local.set({[request.key]: request.data}, () => {
      console.log('Data stored:', request.key);
    });
  } else if (request.action === 'logKeystroke') {
    console.log('Keystroke logged:', request.data);
    // Optionally, store in chrome.storage or send to server
  }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { action: 'checkLogout' });
  }
});
