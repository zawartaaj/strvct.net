"use strict"

/*
    DomSplitView


*/

window.DomView = class DomSplitView extends DomView {
    
    initPrototype () {
        this.newSlot("topView", null)
        this.newSlot("bottomView", null)

        this.newSlot("leftView", null)
        this.newSlot("rightView", null)
    }

    init () {
        super.init()
        return this
    }

    isSplit() {
        return this.topView() || this.bottomView() || this.leftView() || this.rightView()
    }

    canSplit () {
        return !this.isSplit() && this.subviews().length === 0
    }

    splitTopBottom () {
        assert(this.canSplit())

        this.setTopView(DomView.clone())
        this.addSubview(this.topView())

        this.setBottomView(DomView.clone())
        this.addSubview(this.bottomView())

        this.debugSplitViews()
        return this
    }

    splitLeftRight () {
        assert(this.canSplit())

        this.setLeftView(DomView.clone())
        this.addSubview(this.leftView())
        
        this.setRightView(DomView.clone())
        this.addSubview(this.rightView())

        this.debugSplitViews()
        return this
    }

    debugSplitViews () {
        this.splitViews().forEach(sv => sv.setBorder("1px solid yellow"))
    }

    splitViews () {
        return [this.leftView(), this.rightView(), this.topView(), this.bottomView()].select(v => !Type.isNull(v))
    }

    isSplitLeftRight () {
        return !Type.isNull(this.leftView())
    }

    isSplitTopBottom () {
        return !Type.isNull(this.topView())
    }


    

}.initThisClass()
