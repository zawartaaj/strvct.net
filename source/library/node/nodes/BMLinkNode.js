"use strict";

/*
    
    BMLinkNode
    
    A node that to represent a link to another node, which is not a subnode
    
*/

(class BMLinkNode extends BMSummaryNode {
    
    static availableAsNodePrimitive () {
        return true
    }

    initPrototype () {
        {
            const slot = this.newSlot("linkedNode", null)
            slot.setShouldStoreSlot(true)
            slot.setDuplicateOp("copyValue")
        }
        
        {
            const slot = this.newSlot("willDuplicateLinkedObject", false)
            slot.setShouldStoreSlot(true)
            slot.setCanInspect(true)
            slot.setSlotType("Boolean")
            slot.setLabel("Will duplicate linked object")
        }
    }

    initPrototypeObject () {
        this.setShouldStore(true)
        this.setShouldStoreSubnodes(false)
        this.setCanDelete(true)
        this.setNodeCanInspect(true)
        this.setNodeCanEditTitle(true)

        this.setCanDelete(true)
        this.setNodeCanInspect(true) 
    }

    /*
    init () {
        super.init()
    }
    */

    nodeAcceptsDrop (aNode) {
        return true
    }

    nodeDropped (aNode) {
        this.setLinkedNode(aNode)
    }

    duplicate () {
        const obj = super.duplicate()
        if (this.willDuplicateLinkedObject()) {
            const ln = this.linkedNode()
            if (ln) {
                obj.setLinkedNode(ln.duplicate())
            }
        }
        return obj
    }

    title () {
        const ln = this.linkedNode()
        if (ln) {
            return ln.title()
        }
        return "Unlinked"
    }

    subtitle () {
        const ln = this.linkedNode()
        if (ln) {
            return ln.subtitle()
        }
        return "drop tile to link"    
    }

    /*
    title () {
        if (Type.isNull(super.title()) && this.linkedNode()) {
            return this.linkedNode().title()
        }

        return super.title()
    }
    */

    acceptedSubnodeTypes () { 
        // TODO: have browser use nodeTileLink for this protocol?
        return []
    }
    
    note () {
        if (this.linkedNode()) {
            return this.linkedNode().note()
        }

        return null
    }

    noteIconName () {
        //return this.nodeTileLink() ? "double right caret" : null
        return null
    }

    nodeTileLink () {
        return this.linkedNode()
    }

    nodeCanReorderSubnodes () {
        const ln = this.linkedNode()
        return ln ? ln.nodeCanReorderSubnodes() : false // have this operation done in the browser?
    }

    addSubnodeAt (aSubnode, anIndex) {
        return super.addSubnodeAt(aSubnode, anIndex)
    }

}.initThisClass());

