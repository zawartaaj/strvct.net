"use strict";

/*

    BMPongMessage
    
*/

(class BMPongMessage extends BMMessage {
    
    initPrototype () {

    }

    init () {
        super.init()
        this.setMsgType("pong")
    }
        
    msgDict () {
        return {
            msgType: this.msgType()
        }
    }
    
}.initThisClass())
