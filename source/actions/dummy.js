class DummyAction {

    #socket = null;
    #coordinates = null;

    constructor(websocket) 
    {
        this.#socket = websocket;
    }

    OnKeyDown = async function(jsonPayload, settings) {
        console.log("OnKeyDown")
    }

    OnKeyUp = function(jsonPayload, settings) {
        console.log("OnKeyUp");
    }

    WillAppear = function(jsonPayload) {
        this.#coordinates = jsonPayload['coordinates'];
    }

    WillDisappear = function(jsonPayload) {
        console.log("WillDisappear")
    }
}