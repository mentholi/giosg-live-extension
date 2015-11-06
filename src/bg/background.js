/**
* List of allowed hosts where the extension should
* work. We don't want it to do anything for other sites.
*/
var ALLOWED_HOSTS = [
  "service.giosg.com",
  "service-staging.giosg.com",
  "servicetst.giosg.com",
  "127.0.0.1:8000",
];


/**
* Initialize
*/
function init() {
  console.log('giosg Live extension started!');
  addIdleListener();
};

/**
* Loop all browsers open tabs and send notification if
* allowed by ALLOWED_HOSTS list.
*/
function notifyTabs(message) {
  chrome.tabs.query({}, function(tabs){
    for (var i = tabs.length - 1; i >= 0; i--) {
      var tab = tabs[i];
      sendIfAllowed(tab, message);
    };
  });
};

/**
* Checks if current tab url is defined in ALLOWED_HOSTS
* and if so, then sends message to the message listener on
* that tab.
*/
function sendIfAllowed(tab, message) {
  for (var x = ALLOWED_HOSTS.length - 1; x >= 0; x--) {
    var host = ALLOWED_HOSTS[x];
    if (tab.url.indexOf(host) > -1) {
      sendMsg(tab, message);
    }
  };
};

/**
* Send message to injected js that listens messages
* from the extension.
*/
function sendMsg(tab, message) {
  chrome.tabs.sendMessage(tab.id, message, function(response) {});
};

/**
* Add listener for idle events.
* Chrome api uses OS apis to decide when
* user is idle or computer is locked.
*/
function addIdleListener() {
  var previousState = "active";
  chrome.idle.setDetectionInterval(60);
  chrome.idle.onStateChanged.addListener(
    function (IdleState) {
      // Send notification
      notifyTabs({ state: IdleState, previous: previousState });
      previousState = IdleState;
    });
};

init();