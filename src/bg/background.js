var store = new Store("settings");
var ALLOWED_HOSTS = [];
var USER_IDLE_TIMEOUT = 15; // Minimum value accpeted is 15 seconds.

function init() {
  ALLOWED_HOSTS = getAllowedHosts();
  USER_IDLE_TIMEOUT = store.get('idle_timeout') || 15;
  refreshSettingsInterval();

  console.log('giosg Live extension started: ', USER_IDLE_TIMEOUT);
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

      // Send notification
      notifyTabs({ state: IdleState, previous: previousState });
      previousState = IdleState;
    });
};

function refreshSettingsInterval() {
  setInterval(function () {
    // Refresh settings
    ALLOWED_HOSTS = getAllowedHosts();
    new_timeout = store.get('idle_timeout') || 15;
    if (USER_IDLE_TIMEOUT != new_timeout) {
      // Force extension reload if timeout changed.
      window.location.reload();
    }
  }, 5000);
};

init();