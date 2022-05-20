
"use strict";

/*

    BMGroupChatRoom

*/

(class BMGroupChatRoom extends BMApplet {
    
    initPrototype () {
        this.newSlot("name", "Untitled")
    }

    init () {
        super.init()

        this.setNotifications(BaseNode.clone().setTitle("channels"))
	        this.addSubnode(this.notifications())

        this.setMessages(BaseNode.clone().setTitle("direct messages"))
	        this.addSubnode(this.messages())

	    }

    title () {
        return this.name()
    }

    setTitle (aString) {
        this.setName(aString)
        return this
    }

}.initThisClass());

