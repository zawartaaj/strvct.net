"use strict";

/*

    Object_mutation 

    Object category to support observing slot value changes (i.e. "mutations").

*/

(class Object_mutation extends Object {

    setMutationObservers (aSet) {
        if (!this._mutationObservers) {
            Object.defineSlot(this, "_mutationObservers", aSet)
        }
        return this
    }

    mutationObservers () {
        return this._mutationObservers
    }

    addMutationObserver (anObserver) {
        if (!this._mutationObservers) {
            this.setMutationObservers(new Set())
        }

        this.mutationObservers().add(anObserver)
        return this
    }

    removeMutationObserver (anObserver) {
        assert(anObserver)
        this.mutationObservers().delete(anObserver)
        return this
    }

    // ------

    willMutate () {
        /*
        const mos = this._mutationObservers
        if (mos) {
            mos.forEach(v => { 
                v.onWillMutateObject(this)
            })
        }
        */
    }

    didMutate () {
        const mos = this._mutationObservers
        if (mos) {
            mos.forEach(obs => {
                obs.onDidMutateObject(this)
            })
        }
    }

}).initThisCategory();
