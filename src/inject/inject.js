START_BTN_ONLINE_CLASS = "btn-danger";
ORIGINAL_STATE_ONLINE = false;

function init() {
  addMessageListener();
};

function onBackgroundMessage(message) {
  if (message.state == "idle" || message.state == "locked") {
    // Store original state so that
    // when computer is active again, we know if
    // we should go to online state.
    ORIGINAL_STATE_ONLINE = (getCurrentState() === "online");
    setOfflineState();
  } else {
    setActiveState();
  }
};

function addMessageListener() {
  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg && msg.state) {
      sendResponse({ success: true });
      onBackgroundMessage(msg);
    }
  });
};

function setOfflineState() {
  if (getCurrentState() === "online") {
    clickStatStopBtn();
  }
};

function setActiveState() {
  if (getCurrentState() === "offline" && ORIGINAL_STATE_ONLINE) {
    clickStatStopBtn();
  }
};

function getStatStopBtn() {
  return document.querySelector("[ng-click=\"toggleOnline()\"]");
};

function getCurrentState() {
  var btn = getStatStopBtn();
  if (btn && btn.classList.contains(START_BTN_ONLINE_CLASS)) {
    return "online";
  }
  return "offline";
};

function clickStatStopBtn() {
  var btn = getStatStopBtn();
  if (btn) {
    btn.click();
  }
};

init();
