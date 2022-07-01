"use strict";

/*
    KeyboardListener

    Listens to a set of keyboard events.

*/

(class KeyboardListener extends EventSetListener {
    
    initPrototype () {
    }

    init () {
        super.init()
        //this.setIsDebugging(true)
        return this
    }

    setupEventsDict () {
        this.addEventNameAndMethodName("keyup", "onKeyUp");
        this.addEventNameAndMethodName("keydown", "onKeyDown", true);
        //this.addEventNameAndMethodName("keypress", "onKeyPress");
        //this.addEventNameAndMethodName("change", "onChange");
        //this.addEventNameAndMethodName("select", "onSelect");
        return this
    }
    
}.initThisClass());