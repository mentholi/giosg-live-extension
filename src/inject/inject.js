START_BTN_ONLINE_CLASS = "btn-danger";
ORIGINAL_STATE_ONLINE = false;

/**
* Initialize
*/
function init() {
  addMessageListener();
};

/**
* Handler for messages received from background.js.
* Checks the computers current state and acts accordingly.
*/
function onBackgroundMessage(message) {
  if (message.state === "locked") {
    // Store original state so that
    // when computer is active again, we know if
    // we should go to online state.
    ORIGINAL_STATE_ONLINE = (getCurrentState() === "online");
  }

  if (message.state === "locked") {
    setOfflineState();
  } else if (message.state === "active") {
    setActiveState();
  }
};

/**
* Add message listener that listens messages from
* extensions background.js.
* This will send reply to background and call handler fn.
*/
function addMessageListener() {
  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg && msg.state) {
      sendResponse({ success: true });
      onBackgroundMessage(msg);
    }
  });
};

/**
* Set operator to offline state if not yet.
*/
function setOfflineState() {
  if (getCurrentState() === "online") {
    clickStatStopBtn();
  }
};

/**
* Set operator to online state if he is
* offline currently and if he was online
* before the computer was locked
*/
function setActiveState() {
  if (getCurrentState() === "offline" && ORIGINAL_STATE_ONLINE) {
    clickStatStopBtn();
  }
};

/**
* Get start stop button element.
*/
function getStatStopBtn() {
  return document.querySelector("[ng-click=\"$ctrl.toggleOnline()\"]");
};

/**
* Get operator current online state by checking which css
* classes the button has.
*/
function getCurrentState() {
  var btn = getStatStopBtn();
  if (btn && btn.classList.contains(START_BTN_ONLINE_CLASS)) {
    return "online";
  }
  return "offline";
};

/**
* Mimic clicking the start stop button on the page.
* so we don't need to call internal js apis.
*/
function clickStatStopBtn() {
  var btn = getStatStopBtn();
  if (btn) {
    btn.click();
  }
};

init();
