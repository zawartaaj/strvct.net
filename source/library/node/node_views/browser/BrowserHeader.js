"use strict";

/* 

    BrowserHeader

    View at top of BrowserView for: 
    - back arrow
    - path and/or title, subtitle

*/


(class BrowserHeader extends DomFlexView {
    
    initPrototype () {
        this.newSlot("backArrowView")
        this.newSlot("titleView")
    }

    init () {
        super.init()
        this.turnOffUserSelect()
        this.setTransition("all 0.35s")
        this.setBackgroundColor("#222")
        this.setColor("white")
        this.setMinAndMaxHeight("3em")
        this.setWidth("100%")
        //this.setPadding("1em")
        this.setFontSize("1.6em")
        this.setFontWeight("bold")
    
        this.setInnerHTML("test header")
        return this
    }
    
   
}.initThisClass());