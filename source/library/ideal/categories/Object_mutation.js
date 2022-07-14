"use strict";

/*

    Object_mutation 

    Object category to support observing slot value changes (i.e. "mutations").

*/

(class Object_mutation extends Object {

    mutatorMethodNamesSet () {
        throw new Error("undefined mutatorMethodNamesSet on '" + this.type() + "' class")
    }
    
    setupMutatorHooks () {
        this.mutatorMethodNamesSet().forEach((slotName) => {
            const unhookedName = "unhooked_" + slotName
            const unhookedFunction = this[slotName]
    
            Object.defineSlot(this, unhookedName, unhookedFunction)
    
            const hookedFunction = function () {
                this.willMutate(slotName)
                const result = this[unhookedName].apply(this, arguments)
                this.didMutate(slotName)
    
                //let argsString = []
                //for (let i=0; i < arguments.length; i++) {
                //    if (i !== 0) { argsString += ", " }
                //    argsString += String(arguments[i])
                //}
                //console.log("hooked Array " + slotName + "(" + argsString + ")") 
                //console.log("result = " + result)
    
                return result
            }
    
            Object.defineSlot(this, slotName, hookedFunction)
        })
    }

    // -----------------------------------------

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
