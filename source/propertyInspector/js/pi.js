function connectElgatoStreamDeckSocket(inPort, inPropertyInspectorUUID, inRegisterEvent, inInfo, inActionInfo)
{
    websocket = new WebSocket('ws://localhost:' + inPort);
    settings = {};

    websocket.onopen = function () {
        Register();
        GetSettings();
    };

    websocket.onmessage = function (evt) {
        var jsonObj = JSON.parse(evt.data);
        var jsonPayload = jsonObj['payload'];
        var event = jsonObj['event'];

        if(event == "didReceiveGlobalSettings")
        {
            settings = jsonPayload['settings'];
            UpdateElements();
        }
    }

    //
    // PI settings 
    // 
    function Register() {
        var json = {
            "event": inRegisterEvent,
            "uuid": inPropertyInspectorUUID
           };
        websocket.send(JSON.stringify(json));
    }

    function SetSettings() {
        var json = {
            "event": "setGlobalSettings",
            "context": inPropertyInspectorUUID,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
    }

    function GetSettings() {
        var json = {
            "event": "getGlobalSettings",
            "context": inPropertyInspectorUUID
        };
        websocket.send(JSON.stringify(json));
    }

    //
    // DOM manipulation 
    //

    function UpdateElements() {
        UpdateElement("value1", settings['value1']);
        UpdateElement("value2", settings['value2']);
    }

    function GetElementValue(elementId) {
        return document.getElementById(elementId).value;
    }

    function UpdateElement(elementId, newValue){
        document.getElementById(elementId).value = newValue;
    }

    //
    // Window events 
    // 

    // Before property inspector is unloaded
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        settings['value1'] = GetElementValue('value1');
        settings['value2'] = GetElementValue('value2');
        SetSettings();
        // Don't set a returnValue to the event, otherwise Chromium with throw an error.
    });
}