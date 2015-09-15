// SAMPLE
this.manifest = {
    "name": "giosg Live extension",
    "icon": "icon.png",
    "settings": [
        {
            "tab": "Idle settings",
            "group": "Timeouts",
            "name": "idle_timeout",
            "type": "slider",
            "label": "Go offline if computer has been idle for:",
            "max": 120,
            "min": 15,
            "step": 5,
            "display": true,
            "displayModifier": function (value) {
                return value + " seconds";
            }
        },
        {
            "tab": "Advanced",
            "group": "Allowed hosts",
            "name": "allowedHostsList",
            "type": "listBox",
            "label": "Allow this extension to work in these domains",
            "options": []
        },
        {
            "tab": "Advanced",
            "group": "Allowed hosts",
            "name": "removeHostBtn",
            "type": "button",
            "text": "Remove selected host",
        },
        {
            "tab": "Advanced",
            "group": "Allowed hosts",
            "name": "addHostText",
            "type": "text",
            "label": "Add new host",
        },
        {
            "tab": "Advanced",
            "group": "Allowed hosts",
            "name": "addHostBtn",
            "type": "button",
            "text": "Add host",
        }
    ],
    "alignment": [
        [
            "idle_timeout"
        ]
    ]
};
