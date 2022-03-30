
"use strict";

// ------------------------------------------------------------------

Object.defineSlot = function (obj, slotName, slotValue) {
    //if (!Object.hasOwnSlot(obj, slotName, slotValue)) {
    const descriptor = {
        configurable: true,
        enumerable: false,
        value: slotValue,
        writable: true,
    }

    if (typeof(slotValue) === "function") {
        slotValue.displayName = slotName
    }
    
    Object.defineProperty(obj, slotName, descriptor)
    //}
}

if (!String.prototype.capitalized) {
    Object.defineSlot(String.prototype, "capitalized",
        function () {
            return this.replace(/\b[a-z]/g, function (match) {
                return match.toUpperCase();
            });
        }
    )
}
// ------------------------------------------------------------------

(class Base {
    // Base class with helpful methods for cloning and slot creation 

    static isInBrowser() {
        return (typeof (document) !== 'undefined')
    }

    isInBrowser() {
        return (typeof (document) !== 'undefined')
    }

    static shared() {
        if (!this._shared) {
            this._shared = this.clone()
        }
        return this._shared
    }

    static type() {
        return this.name
    }

    static initThisClass() {
        //console.log("this.classType() = ", this.classType())
        /*
        if (typeof(getGlobalThis()[this.type()]) !== "undefined") {
            const msg = "WARNING: Attempt to redefine getGlobalThis()['" + this.type() + "']"
            console.warn(msg)
            throw new Error(msg)
        }*/

        getGlobalThis()[this.type()] = this

        if (this.prototype.hasOwnProperty("initPrototype")) {
            // each class inits it's own prototype, so make sure we only call our own initPrototype()
            //this.prototype.initPrototype.apply(this.prototype)
            this.prototype.initPrototype()
        }
        return this
    }

    static type() {
        return this.name
    }

    type() {
        return this.constructor.name
    }

    static clone() {
        const obj = new this()
        obj.init()
        return obj
    }

    init() {
        // subclasses should override to initialize
    }

    newSlot(slotName, initialValue) {
        if (typeof (slotName) !== "string") {
            throw new Error("slot name must be a string");
        }

        if (initialValue === undefined) {
            initialValue = null
        };

        const privateName = "_" + slotName;
        this[privateName] = initialValue;

        if (!this[slotName]) {
            this[slotName] = function () {
                return this[privateName];
            }
        }

        const setterName = "set" + slotName.capitalized()

        if (!this[setterName]) {
            this[setterName] = function (newValue) {
                this[privateName] = newValue;
                return this;
            }
        }

        return this;
    }


}.initThisClass());

