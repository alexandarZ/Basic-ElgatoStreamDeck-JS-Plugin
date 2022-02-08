function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
    websocket = new WebSocket("ws://127.0.0.1:" + inPort);
    actions = {};
    settings = {};
    
    websocket.onopen = function () {
        RegisterPlugin();
        InitializePlugin();
        GetSettings();
    };

    websocket.onmessage = function (evt) {
        var jsonObj = JSON.parse(evt.data);
        var jsonPayload = jsonObj['payload'];
        var event = jsonObj['event'];
        var action = jsonObj['action'];

        if (event == "keyDown") {
            actions[action].OnKeyDown(jsonPayload, settings);
        }
        else if (event == "keyUp") {
            actions[action].OnKeyUp(jsonPayload, settings);
        }
        else if (event == "willAppear") {
            actions[action].WillAppear(jsonPayload);
        }
        else if (event == "willDisappear") {
            actions[action].WillDisappear(jsonPayload);
        }
        else if(event == "didReceiveGlobalSettings")
        {
            settings = jsonPayload['settings'];
        }
    };

    function RegisterPlugin() {
        var json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };
        websocket.send(JSON.stringify(json));
    }

    function GetSettings() {
        var json = {
            "event": "getGlobalSettings",
            "context": inPluginUUID
        };
        websocket.send(JSON.stringify(json));
    }

    function InitializePlugin() {
        InitializeActions();
    }

    function InitializeActions() {
        actions['com.cdl.test.dummyaction'] = new DummyAction(websocket);
    }
};