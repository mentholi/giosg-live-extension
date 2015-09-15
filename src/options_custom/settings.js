var settings_store = new Store("settings");

window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
        setHosts(settings.manifest.allowedHostsList);

        settings.manifest.addHostBtn.addEvent("action", function () {
            addHost(settings.manifest.allowedHostsList, settings.manifest.addHostText.element.value, true);
        });

        settings.manifest.removeHostBtn.addEvent("action", function () {
            removeHost(settings.manifest.allowedHostsList, true);
        });
    });
});

function setHosts(listEl) {
    if (settings_store.get('allowed_hosts') === undefined) {
        host_list = DEFAULT_HOSTS;
    } else {
        host_list = settings_store.get("allowed_hosts");
    }

    for (var i = host_list.length - 1; i >= 0; i--) {
        var host = host_list[i];
        addHost(listEl, host, false);
    };
    saveHosts(listEl.element.options);
};

function addHost(listEl, new_host, save) {
    var newEl = new Element("option", {
        "value": new_host,
        "text": new_host
    });
    newEl.inject(listEl.element);

    if (save) {
        saveHosts(listEl.element.options);
    }
};

function removeHost(listEl, save) {
    for (var i = listEl.element.selectedOptions.length - 1; i >= 0; i--) {
        var opt = listEl.element.selectedOptions[i];
        opt.remove();
    };
    if (save) {
        saveHosts(listEl.element.options);
    }
};

function saveHosts(options) {
    var host_list = [];
    for (var i = options.length - 1; i >= 0; i--) {
        host_list.push(options[i].value);
    };
    settings_store.set("allowed_hosts", host_list);
};