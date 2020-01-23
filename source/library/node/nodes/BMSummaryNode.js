"use strict"

/*
    
    BMSummaryNode
    
    A node that contains Text, stores it's:
        content, color, font, padding, margin
    and has an inspector for these attributes
    
    support for links?

*/

window.BMSummaryNode = class BMSummaryNode extends BMStorableNode {
    
    initPrototype () {
        const joinerSlot = this.newSlot("nodeSummaryJoiner", " ").setShouldStoreSlot(true).setDuplicateOp("copyValue")
        joinerSlot.setCanInspect(true).setSlotType("String").setLabel("Summary joiner")

        const childSummarySlot = this.newSlot("nodeSubtitleIsChildrenSummary", false).setShouldStoreSlot(true).setDuplicateOp("copyValue")
        childSummarySlot.setCanInspect(true).setSlotType("Boolean").setLabel("Subtitle is children summary")

        const newLineSlot = this.newSlot("hasNewlineAferSummary", false).setShouldStoreSlot(true).setDuplicateOp("copyValue")
        newLineSlot.setCanInspect(true).setSlotType("Boolean").setLabel("Has new line after summary")

        const formatSlot = this.newSlot("summaryFormat", "value").setShouldStoreSlot(true).setDuplicateOp("copyValue")
        formatSlot.setCanInspect(true).setSlotType("String").setLabel("Summary format")
        formatSlot.setValidValues(["none", "key", "value", "key value", "value key"])

        const subCount = this.overrideSlot("subtitleIsSubnodeCount", false).setDuplicateOp("copyValue").setShouldStoreSlot(true)
        subCount.setCanInspect(true).setSlotType("Boolean").setLabel("Subtitle is subnode count")

        const noteCount = this.overrideSlot("noteIsSubnodeCount", false).setDuplicateOp("copyValue").setShouldStoreSlot(true)
        noteCount.setCanInspect(true).setSlotType("Boolean").setLabel("Note is subnode count")

        this.setShouldStore(true)
        this.setShouldStoreSubnodes(true)

        this.setTitle("title")
        this.protoAddStoredSlot("title")
    }

    init () {
        super.init()
    }

    didUpdateSlotSummaryFormat () {
        this.didUpdateNode()
    }

    summaryKey () {
        return this.title()
    }

    summaryValue () {
        return this.subtitle()
    }

    subtitle () {
        if (this.nodeSubtitleIsChildrenSummary()) {
            return this.childrenSummary()
        }

        return super.subtitle()
    }

    // --- summary ---
    		
    summary () {
        const k = this.summaryKey()
        let v = this.summaryValue()
        const f = this.summaryFormat()
        const j = this.nodeSummaryJoinerOut()
        let end = ""
        
        if (this.hasNewlineAferSummary()) {
            end = "<br>"
        }

        if (Type.isNull(v)) {
            v = ""
        }

        if (f === "key") { 
            return k + end
        }
    
        if (f === "value") { 
            return v + end
        }

        if (f === "key value") { 
            return k + j + v + end
        }

        if (f === "value key") { 
            return v + j + k + end
        }

        return ""
    }
        
    childrenSummary () {
        return this.subnodes().map(subnode => subnode.summary()).filter(s => s.length).join(this.nodeSummaryJoinerOut())
    }

    nodeSummaryJoinerOut () {
        let s = this._nodeSummaryJoiner
        
        if (s === "newline") {
            return "<br>"
        } else {
            s = s.replaceAll("<br>", "")
        }
        
        return s
    }
    
}.initThisClass()

