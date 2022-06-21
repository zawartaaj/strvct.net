"use strict";

/*

    BMMeridiemNode 
    
*/

(class BMMeridiemNode extends BaseNode {
    
    initPrototype () {
        this.newSlot("value", 1).setComment("month value starts with 1")
    }

    /*
    init () {
        super.init()
        this.setNoteIconName("right-arrow")

        this.setCanDelete(false)
        this.setNodeCanInspect(false)

        this.setTitle("a month")
        this.setNodeCanEditTitle(true)

        //this.setSubnodeProto(BMOptionNode)
        //this.setNodeCanReorderSubnodes(false)

        //this.setNodeViewClassName("BMOptionsNodeView")
    }

    setValue (v) {
        assert(Number.isInteger(v) && v > 0 && v < 13)
        this._value = v
        return this
    }

    year () {
        const year = this.parentNode().value()
        return year
    }

    daysThisMonth () {
        return new Date(this.year(), this.value() - 1, 0).getDate();
    }

    monthNames () {
        return ["January", "February", "March", "April", 
            "May", "June", "July", "August", 
            "September", "October", "November", "December"];
    }

    monthName () {
        return this.monthNames()[this.value()-1]
    }

    title () {
        return this.monthName()
    }

    zeroPaddedMonthNumber () {
        let v = this.value()
        if (v < 10) { 
            v = "0" + v 
        }
        return v
    }

    subtitle () {
        //return this.zeroPaddedMonthNumber()
        return null
    }
    
    nodeTileLink () {
        // used by UI tile views to browse into next column
        return this
    }

    prepareToSyncToView () {
        // called after Node is selected
        if (!this.subnodeCount()) {

            for (let i = 1; i < this.daysThisMonth() + 1; i++) {
                this.addSubnode(BMDayNode.clone().setValue(i))
            }
        }
    }
    */
    
}.initThisClass());
