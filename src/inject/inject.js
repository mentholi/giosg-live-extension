ALLOWED_SENDERS = [
  'nkapodlknoliigamdpkaciikenecjphf'
];

/*chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);

    // ----------------------------------------------------------
    // This part of the script triggers when page is done loading
    console.log("Hello. This message was sent from scripts/inject.js");
    // ----------------------------------------------------------
    //addIdleListener();
  }
  }, 10);
});*/


function init() {
  addMessageListener();
  console.log('client init');
};

function onBackgroundMessage(message) {
  if (message.state == 'idle') {

  } else if (message.state == 'locked') {

  } else {

  }
};

function addMessageListener() {
  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    //chrome.pageAction.show(sender.tab.id);
    if (ALLOWED_SENDERS.indexOf(sender) > -1) {
      sendResponse({ success: true });
      onBackgroundMessage(msg);
    } else {
      console.log('ignored message from: ', sender);
    }
  });
};

init();