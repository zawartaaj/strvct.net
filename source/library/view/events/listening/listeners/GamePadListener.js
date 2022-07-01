"use strict";

/*
    GamePadListener

    Listens to a set of mouse events.

*/

(class GamePadListener extends EventSetListener {
    
    initPrototype () {

    }

    init () {
        super.init()
        return this
    }

    setupEventsDict () {
        this.addEventNameAndMethodName("gamepadconnected",   "onGamePadConnected");
        this.addEventNameAndMethodName("gamepaddisconnected", "onGamePadDisconnected");
        return this
    }

}.initThisClass());
