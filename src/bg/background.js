var store = new Store("settings");
var ALLOWED_HOSTS = [];
var USER_IDLE_TIMEOUT = 15; // Minimum value accpeted is 15 seconds.
var OFFLINE_ONLY_WHEN_LOCKED = false;

function init() {
  ALLOWED_HOSTS = getAllowedHosts();
  USER_IDLE_TIMEOUT = store.get('idle_timeout') || 15;
  OFFLINE_ONLY_WHEN_LOCKED =  store.get('only_offline_when_locked') || false;
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
      notifyTabs({ state: IdleState, previous: previousState, offlineOnlyOnLock: OFFLINE_ONLY_WHEN_LOCKED });
      previousState = IdleState;
    });
};

function refreshSettingsInterval() {
  setInterval(function () {
    // Refresh settings
    ALLOWED_HOSTS = getAllowedHosts();
    OFFLINE_ONLY_WHEN_LOCKED =  store.get('only_offline_when_locked') || false;
    new_timeout = store.get('idle_timeout') || 15;

    if (USER_IDLE_TIMEOUT != new_timeout) {
      // Force extension reload if timeout changed.
      window.location.reload();
    }
  }, 5000);
};

init();