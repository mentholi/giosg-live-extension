var store = new Store("settings");
var ALLOWED_HOSTS = [];
var USER_IDLE_TIMEOUT = 15; // Minimum value accpeted is 15 seconds.

function init() {
  ALLOWED_HOSTS = getAllowedHosts();
  USER_IDLE_TIMEOUT = store.get('idle_timeout') || 15;
  addIdleListener();
};

function getAllowedHosts() {
  return store.get("allowed_hosts") || DEFAULT_HOSTS;
};

function notifyTabs(message) {
  chrome.tabs.query({}, function(tabs){
    for (var i = tabs.length - 1; i >= 0; i--) {
      var tab = tabs[i];
      sendIfAllowed(tab, message);
    };
  });
};

function sendIfAllowed(tab, message) {
  for (var x = ALLOWED_HOSTS.length - 1; x >= 0; x--) {
    var host = ALLOWED_HOSTS[x];
    if (tab.url.indexOf(host) > -1) {
      sendMsg(tab, message);
    }
  };
};

function sendMsg(tab, message) {
  chrome.tabs.sendMessage(tab.id, message, function(response) {});
};

function addIdleListener() {
  var previousState = "active";
  chrome.idle.setDetectionInterval(USER_IDLE_TIMEOUT);
  chrome.idle.onStateChanged.addListener(
    function (IdleState) {
      // Refresh settings
      ALLOWED_HOSTS = getAllowedHosts();
      USER_IDLE_TIMEOUT = store.get('idle_timeout') || 15;

      // Send notification
      notifyTabs({ state: IdleState, previous: previousState });
      previousState = IdleState;
    });
};

init();