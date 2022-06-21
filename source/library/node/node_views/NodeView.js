"use strict";

/*

    NodeView

*/

(class NodeView extends DomStyledView {
    
    initPrototype () {
        this.newSlot("node", null) //.setDuplicateOp("duplicate")
        this.newSlot("defaultSubviewProto", null)
        this.newSlot("overrideSubviewProto", null)
        this.newSlot("nodeObservation", null)
        this.newSlot("isInspecting", false)
    }

    init () {
        super.init()
        //this.setNodeObservation(BMNotificationCenter.shared().newObservation().setName("didUpdateNode").setObserver(this))
        this.setNodeObservation(BMNotificationCenter.shared().newObservation().setObserver(this)) // observe all posts from node
        this.updateSubnodeToSubviewMap()
        return this
    } //.setDocs("init", "initializes the object", "returns this"),
    
    setParentView (v) {
        if (Type.isNull(v)) {
            console.log(this.debugTypeId() + " setParentView(null)")
        }
        return super.setParentView(v)
    }
    
    prepareToRetire () {
        //console.log(this.debugTypeId() + " prepareToRetire *********")
        this.setNode(null)
        super.prepareToRetire()
        return this
    }
	
    setNode (aNode) {
        if (this._node !== aNode) {
            this.stopWatchingNode()
            this._node = aNode
            this.startWatchingNode()

            this.updateElementIdLabel()
            this.didChangeNode()
        }
		
        return this
    }

    updateElementIdLabel () {
        const nodeId = this.node() ? this.node().debugTypeId() : "null"
        this.element().id = this.debugTypeId() + " for node " + nodeId
        return this
    }
    
    didChangeNode () {
        if (this.node()) {
            this.scheduleSyncFromNode()
        }
        return this
    }
 
    startWatchingNode () {
        if (this.node()) {
            //console.log("startWatchingNode " + this.node() + " observation count = " + BMNotificationCenter.shared().observations().length)
            this.nodeObservation().setTarget(this.node()).watch()
            //this.node().onStartObserving()
        }
        return this
    }
       
    stopWatchingNode () {
        if (this.node()) {
            //console.log("stopWatchingNode " + this.node() + " observation count = " + BMNotificationCenter.shared().observations().length)
            this.nodeObservation().stopWatching()
            //this.nodeObservation().setTarget(null)
            //this.node().onStopObserving()
        }
        return this
    }
    
    willRemove () {
        super.willRemove()
        this.stopWatchingNode()
        return this
    }
    
    subviewProto () {
        debugger;
        //console.log("looking for subviewProto")
        if (this.node()) {
            const vc = this.node().nodeTileClass()
            if (vc) { 
                return vc
            }
        }
        return super.subviewProto()
    }

    // --- syncing ---

    subviewForNode (aNode) {
        assert(this._subnodeToSubview)
        return this._subnodeToSubview[aNode]
    }

    updateSubnodeToSubviewMap () {
        // TODO: make this more efficient with add/remove hooks
        const dict = {}
        this.subviews().forEach(sv => {
            if (sv.node) { 
                dict.atSlotPut(sv.node(), sv) 
            } 
        })
        this._subnodeToSubview = dict
        return this
    }

    subviewProtoForSubnode (aSubnode) {
        let proto = this.overrideSubviewProto()
		
        if (!proto) {
		    proto = aSubnode.nodeViewClass()
        }

        if (!proto) {
            proto = this.defaultSubviewProto()
        }
				
        return proto      
    }

    newSubviewForSubnode (aSubnode) {
        if (!aSubnode) {
            throw new Error("null aSubnode")
        }

        //console.log(this.debugTypeId() + ".newSubviewForSubnode(" + aSubnode.debugTypeId() + ")")
        const proto = this.subviewProtoForSubnode(aSubnode)
		
        if (!proto) {
            aSubnode.nodeViewClass()
            throw new Error("no subviewProto for subnode " + aSubnode.typeId())
        }
		
        return proto.clone().setNode(aSubnode)
    }

    updateSubviews () {
        // for subclasses to override
        return this
    }

    flattenedSubnodes (depth) {
        if (Type.isUndefined(depth)) {
            depth = 0
        }
        const subnodes = this.node().subnodes()
        const flattened = []
        subnodes.forEach(subnode => {
            flattened.push(subnode)
            if (depth > 0) {
                subnode.subnodes().forEach(sub => flattened.push(sub))
            }
        })

        return flattened
    }
    
    visibleSubnodes () {
        return this.node().subnodes()
    }
    
    syncFromNode () {
        let subnodesDidChange = false
        // override this method if the view manages it's own subviews

        if (!this.node()) { 
            this.removeAllSubviews();
            return
        }

        //console.log("> " + this.debugTypeId() + " syncFromNode")
        
        this.node().prepareToSyncToView()
        this.updateSubnodeToSubviewMap() // not ideal - move this to update on subview add/remove
       
        const newSubviews = []
        
        // only replace subviews if sync requires it,
        // and reuse subviews for subnodes which are still present 

        this.visibleSubnodes().forEach((subnode) => {
            let subview = this.subviewForNode(subnode) // get the current view for the node, if there is one
            
            if (!subview) {
                subview = this.newSubviewForSubnode(subnode)
            }
            
            if (Type.isNull(subview)) {
                throw new Error("null subview")
            }
            
            newSubviews.push(subview)   
        })
        
        if (!newSubviews.isEqual(this.subviews())) {
            subnodesDidChange = true
            //this.removeAllSubviews() 
            this.removeAllSubviews()
            this.addSubviews(newSubviews)
            this.updateSubnodeToSubviewMap()
            // since node's don't hold a view reference, 
            // subviews no longer referenced in subviews list will be collected
        }

        this.subviews().forEach(subview => subview.syncFromNodeNow())

        return subnodesDidChange
    }
    
    syncToNode () {
        const node = this.node()
        if (node) {
            node.didUpdateNode()
            //node.scheduleSyncToStore()
        }
        return this
    }

    didUpdateNode () {
        //this.debugLog(" didUpdateNode " + this.node().type())
        this.scheduleSyncFromNode()
    }
    
    scheduleSyncToNode () {
        if (this.hasScheduleSyncFromNode()) {
            this.hasScheduleSyncFromNode()
            console.log("SKIPPING scheduleSyncToNode because hasScheduleSyncFromNode")
            this.unscheduleSyncFromNode()
            return this
        }
        
        SyncScheduler.shared().scheduleTargetAndMethod(this, "syncToNode", 0)
        return this
    }
    
    hasScheduleSyncToNode () {
        return SyncScheduler.shared().isSyncingOrScheduledTargetAndMethod(this, "syncToNode")
    }

    hasScheduleSyncFromNode () {
        return SyncScheduler.shared().isSyncingOrScheduledTargetAndMethod(this, "syncFromNode")
    }

    scheduleSyncFromNode () {
        assert(!this.hasScheduleSyncToNode())
        SyncScheduler.shared().scheduleTargetAndMethod(this, "syncFromNode", 2) // let posts happen first
        return this
    }

    unscheduleSyncFromNode () {
        SyncScheduler.shared().unscheduleTargetAndMethod(this, "syncFromNode")
    }

    syncFromNodeNow () { // unschedule syncFromNode if scheduled, and call syncFromNode now
        this.unscheduleSyncFromNode()
        this.syncFromNode()
    }

    // logging 
    
    logName () {
        return this.type()
    }
    
    log (msg) {
        const s = "[" + this.logName() + "] " + msg
        console.log(s)
        return this
    }
    
    // visibility
    
    onVisibility () {
	    super.onVisibility()
	    //this.debugLog(".onVisibility()")
	    const node = this.node()
	    if (node && node.nodeBecameVisible) {
	        node.nodeBecameVisible()
	    }

	    return this
    }
    
    // value
    
    setValue (newValue) {
        this.setInnerHtml(newValue)			
        return this
    }
    
    value () {
        return this.innerHtml()
    }

    // ---

    resyncAllViews () {
        if (!this.hasScheduleSyncToNode()) {
            this.scheduleSyncFromNode()
        }
        super.resyncAllViews()
        return this
    }
    
}.initThisClass());
