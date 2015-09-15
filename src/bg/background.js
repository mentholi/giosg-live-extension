// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

/*var settings = new Store("settings", {
  "sample_setting": "This is how you use Store.js to remember values"
});
*/

ALLOWED_HOSTS = [
  'service.giosg.com',
  'service-staging.giosg.com',
  'servicetst.giosg.com',
  '127.0.0.1:8000',
]

// Make a simple request:
function sendMsg() {
  // Make a simple request:
  chrome.tabs.query({}, function(tabs){
    console.log('all tabs:', tabs);

    for (var i = tabs.length - 1; i >= 0; i--) {
      var tab = tabs[i];
      console.log(tab.url);
      for (var x = ALLOWED_HOSTS.length - 1; x >= 0; x--) {
        var host = ALLOWED_HOSTS[x];
        if (tab.url.indexOf(host) > -1) {
          console.log('sending to:', tab);
          chrome.tabs.sendMessage(tab.id, { action: "open_dialog_box" }, function(response) {
            console.log('background.js: ', response);
          });
        }
      };
    };
  });
};

function init() {
  addIdleListener();
};

function addIdleListener() {
  console.log('addIdleListener fired');
  // Minimum value accpeted is 15 seconds.
  // TODO: Read from settings
  chrome.idle.setDetectionInterval(15);

  var previousState = "active";
  chrome.idle.onStateChanged.addListener(
    function (IdleState) {
      if (IdleState === "idle") {
        onIdleState(IdleState, previousState);
      } else if (IdleState === "locked") {
        onLockedState(IdleState, previousState);
      } else {
        onActiveState(IdleState, previousState);
      }
      previousState = IdleState;
    });
};

function onIdleState(current, previous) {
  console.log('onIdleState');
  notifyAppPage('stop');
};

function onLockedState(current, previous) {
  console.log('onLockedState');
  notifyAppPage('stop');
};

function onActiveState(current, previous) {
  console.log('onActiveState');
  notifyAppPage('start');
};

function notifyAppPage(message) {
  console.log('notifyAppPage: ', message);
  chrome.extension.sendMessage({ }, function(response) {
    console.log('notifyAppPage: ', response);
  });
}