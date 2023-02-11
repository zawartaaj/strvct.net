"use strict";

/*
    
    NavView
    
*/

(class NavView extends NodeView {

    initPrototypeSlots () {
        this.newSlot("stackView", null)
        this.newSlot("scrollView", null) // ScrollView fits NavView size, and contains TilesView which may be larger
        this.newSlot("tilesView", null) // is inside scrollView
        this.newSlot("isCollapsed", false)
        this.newSlot("animatesCollapse", true)
        this.newSlot("beforeEdgePanBorderBottom", null) // private
        this.newSlot("beforeEdgePanBorderRight", null) // private
    }

    targetWidth () {
        const defaultWidth = 300
        if (this.node()) {
            const minWidth = this.node().nodeMinTileWidth()
            const maxWidth = 600
            let w = defaultWidth
            w = Math.max(defaultWidth, minWidth)
            w = Math.min(w, maxWidth)
            if (w) {
                return w
            }
        }
        return defaultWidth
    }

    targetHeight () {
        if (this.node()) {
            const h = this.node().nodeMinTileHeight()
            if (h) {
                return h
            }
        }
        return 64
    }

    init () {
        super.init()
        this.setDisplay("block")
        this.setPosition("relative")
        this.setFlexDirection("column")
        this.setFlexGrow(1)
        //this.setOpacity(0)
        this.setOverflow("hidden")
        this.setUserSelect("none")
        //this.setTransition("opacity 0.5s ease-in-out")
        //this.setTransition("flex-basis 0.1s")
        this.setTransition("opacity 0.5s ease-in-out, flex-basis 0s")

        /*
        this.setHeaderClass(ColumnGroupHeader)
        this.setMiddleClass(BrowserScrollView)
        this.setFooterClass(ColumnGroupFooter)
        this.setupHeaderMiddleFooterViews()
        this.footerView().hideDisplay()
        */

        this.setScrollView(StackScrollView.clone())
        this.addSubview(this.scrollView())

        this.setTilesView(TilesView.clone())
        this.scrollView().addSubview(this.tilesView())

        this.addGestureRecognizer(RightEdgePanGestureRecognizer.clone()) // for adjusting width
        this.addGestureRecognizer(BottomEdgePanGestureRecognizer.clone()) // for adjusting height

        //this.addGestureRecognizer(RightEdgePanGestureRecognizer.clone()) 
        return this
    }

    isVertical () {
        return this.stackView().direction() === "right"
    }

    syncOrientation () {
        if (this.isVertical()) {
            this.makeOrientationRight()
        } else {
            this.makeOrientationDown()
        }
        return this
    }

    // --- border ---

    borderColor () {
        return "rgba(255, 255, 255, 0.3)"
    }

    hasBorder () {
        const node = this.node()
        if (node) {
            const hint = node.nodeNavBorderHint()
            if (Type.isBoolean(hint)) {
                return hint
            }
        }
        return true
    }

    borderStyle () {
        if (this.hasBorder()) {
            return "1px solid " + this.borderColor()
        }
        return null
    }

    // ---

    makeOrientationRight () {
        this.setFlexDirection("column")
        this.setFlexBasis(this.targetWidth() + "px")
        this.setFlexGrow(0)
        this.setFlexShrink(0)
        this.setBorderBottom(null)
        this.setBorderRight(this.borderStyle())
        this.scrollView().setIsVertical(true)
        //this.setBoxShadow("inset -10px 0 20px rgba(0, 0, 0, 0.05)")
    }

    makeOrientationDown () {
        this.setFlexDirection("row")
        this.setFlexBasis(this.targetHeight() + "px")
        this.setFlexGrow(0)
        this.setFlexShrink(0)
        this.setBorderRight(null)
        this.setBorderBottom(this.borderStyle())
        this.scrollView().setIsVertical(false)
        //this.setBoxShadow("inset 0 -10px 40px #222")
    }

    setNode (aNode) {
        super.setNode(aNode)
        this.tilesView().setNode(aNode)
        return this
    }

    syncFromNode () {
        this.syncOrientation()
        //this.tilesView().syncFromNode()
        this.applyStyles()

        if (this.isVertical()) {
            const w = this.node().nodeMinTileWidth()
            if (w && !Type.isNullOrUndefined(w)) {
                this.setMinAndMaxWidth(w)
                /*
                this.setFlexBasis(w + "px")
                this.setFlexGrow(0)
                this.setFlexShrink(0)
                */
            }
        } else {
            const h = this.node().nodeMinTileHeight()
            if (h && !Type.isNullOrUndefined(h)) {
                this.setMinAndMaxHeight(h)
            }
        }

        return this
    }

    /*
    applyStyles () {
        super.applyStyles()
        
        if (this.isVertical()) {
            this.applyColumnStyle()
        }
        return this
    }
    */

    applyColumnStyle () {
        this.setBorder("")
        const themeClass = this.currentThemeClass()
        if (themeClass) {
            const columns = themeClass.firstSubnodeWithTitle("columns")
            //debugger;
            if (columns) {
                const colorFields = columns.subnodes().select(sn => sn.thisClass().isSubclassOf(Object.getClassNamed("BMStringField")) || sn.type() === "BMField")
                const count = colorFields.length
                if (count) {
                    let i = this.stackView().stackViewDepth()
                    let ci = i % count
                    const color = colorFields.at(ci).value()
                    console.log("column " + i + " color index " + ci + " color " + color)
                    this.setBackgroundColor(color)
                }
            }
        }
    }

    // --- collpase / uncollapse ---

    collapse () {
        if (!this.isCollapsed()) {
            this.hideDisplay()
            //this.setMinAndMaxWidth(0)

            /*
            this.setFlexBasis("0px")
            this.setFlexGrow(0)
            this.setFlexShrink(0)
            */
           this.setIsCollapsed(true)
        }
    }

    uncollapse () {
        if (this.isCollapsed()) {
            this.unhideDisplay()
            //this.setMinAndMaxWidth(this.targetWidth() + "px")
            this.syncOrientation()
            this.setIsCollapsed(false)
        }
    }

    // --- right edge gesture ---

    onRightEdgePanBegin (aGesture) {
        this.setBeforeEdgePanBorderRight(this.borderRight())
        this.setBorderRight("1px dashed red")
    }

    onRightEdgePanMove (aGesture) {
        const p = aGesture.currentPosition() // position in document coords
        const f = this.frameInDocument()
        const nw = Math.max(10, p.x() - f.x())
        //console.log("nw = ", nw)
        this.node().setNodeMinTileWidth(nw)
        this.scheduleSyncToNode()

        return this
    }

    onRightEdgePanComplete (aGesture) {
        this.onRightEdgePanMove(aGesture)
        this.setBorderRight(this.beforeEdgePanBorderRight())
        this.setBeforeEdgePanBorderBottom(null)
        this.unhideTransition()
    }

    // --- bottom edge gesture ---


    onBottomEdgePanBegin (aGesture) {
        this.setBeforeEdgePanBorderBottom(this.borderBottom())
        this.setBorderBottom("1px dashed red")
        //this.setTransition("min-height 0s, max-height 0s")
        this.hideTransition()
    }

    onBottomEdgePanMove (aGesture) {
        const p = aGesture.currentPosition() // position in document coords
        const f = this.frameInDocument()
        const newHeight = Math.max(10, p.y() - f.y())
        //console.log("node " + this.node().title() + " newHeight = ", newHeight)
        this.node().setNodeMinTileHeight(newHeight)
        this.scheduleSyncToNode()
        return this
    }

    onBottomEdgePanComplete (aGesture) {
        this.onBottomEdgePanMove(aGesture)
        this.setBorderBottom(this.beforeEdgePanBorderBottom())
        this.setBeforeEdgePanBorderBottom(null)
        this.unhideTransition()
    }
/*
    removeAllGestureRecognizers () {
        //debugger;
        return super.removeAllGestureRecognizers()
    }
    */

}.initThisClass());