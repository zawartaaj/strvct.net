"use strict"

/*

    BMChatThreads

*/

window.BMChatThreads = class BMChatThreads extends BMContactLinks {
    
    initPrototype () {

    }

    init () {
        super.init()
        this.setLinkProto(BMChatThread)
    }

    finalize () {
        super.finalize()
        this.setTitle("direct messages")
    }
	
    shelfIconName () {
        return "chat/direct_messages"
	    //return "mail-white"
    }
    
}.initThisClass()