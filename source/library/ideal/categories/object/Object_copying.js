"use strict";

/*

    Object_copying
    
    copying related behavior 

*/

getGlobalThis().MissingSlotError = (class MissingSlotError extends Error {
    constructor(message) {
      super(message);
      //debugger;
      this.name = "MissingSlotError"; // not sure why this isn't already set...
    }
});
  

(class Object_copying extends Object {

    // --- copying ---

    shallowCopy () {
        const copy = Object.assign({}, this);
        return copy
    }
 
    duplicate () {
        assert(this.isInstance())
        const instance = this.thisClass().clone().copyFrom(this)
        instance.duplicateSlotValuesFrom(this) // TODO: what about lazy slots?
        return instance
    }
 
    copy () {
        return this.duplicate()
    }
 
    copyFromAndIgnoreMissingSlots (anObject) { // prefer to use this externally so it's clear what it's doing
        return this.copyFrom (anObject, true) 
    }
    
    copyFrom (anObject, ingoreMissingSlots = false) { 
        // externally, when you need:
        //   copyFrom (anObject, true) 
        // please use: 
        //   copyFromAndIgnoreMissingSlots() e
        // instead
        //
        // WARNING: subclasses will need to customize this
        this.duplicateSlotValuesFrom(anObject, ingoreMissingSlots)
        return this
    }
 
    duplicateSlotValuesFrom (otherObject, ingoreMissingSlots = false) {
        // TODO: add a type check of some kind?
 
        this.thisPrototype().allSlotsMap().forEachKV((slotName, mySlot) => {
            const otherSlot = otherObject.thisPrototype().slotNamed(slotName)
            const hasSlot = !Type.isNullOrUndefined(otherSlot)
            if (hasSlot) {
                const v = otherSlot.onInstanceGetValue(otherObject) // TODO: what about lazzy slots?
                const dop = otherSlot.duplicateOp()
    
                if (dop === "copyValue") {
                    mySlot.onInstanceSetValue(this, v)
                } else if (dop === "duplicate" && v && v.duplicate) {
                    const dup = v.duplicate()
                    mySlot.onInstanceSetValue(this, dup)
                }
            } else if (!ingoreMissingSlots) {
                throw new MissingSlotError()
            }
        })
        return this
    }
 
    copySlotValuesFrom (otherObject) {
        this.thisPrototype().allSlotsMap().forEachKV((slotName, mySlot) => {
            const otherSlot = otherObject.thisPrototype().slotNamed(slotName)
            const v = otherSlot.onInstanceGetValue(otherObject)
            mySlot.onInstanceSetValue(this, v)
        })
        return this
    }

}).initThisCategory();
