"use strict";

/*

    sends these events to window:

        resourceLoaderLoadUrl, with detail { url: , maxUrlCount: }
        resourceLoaderError, with detail { error: }
        resourceLoaderDone

*/

(class ResourceLoader extends Base {

    initThisClass () {
        debugger
        super.initThisClass()
    }

    initPrototype () {
        this.newSlot("currentScript", null);
        this.newSlot("urls", []);
        this.newSlot("doneCallbacks", []),
        //this.newSlot("urlLoadingCallbacks", []);
        //this.newSlot("errorCallbacks", []);
        
        this.newSlot("jsFilesLoaded", []) // these may be embedded in index.html
        this.newSlot("cssFilesLoaded", [])  // these may be embedded in index.html

        //this.newSlot("archive", null)

        this.newSlot("resourceFilePaths", [])
        this.newSlot("maxUrlCount", 0)

        this.newSlot("isEmbeded", false)
    }

    isInIndexMode () {
        return getGlobalThis().isBuildingIndex
    }

    resourceFilePathsWithExtensions(extensions) {
        return this.resourceFilePaths().select(path => extensions.contains(path.pathExtension().toLowerCase()))
    }

    currentScriptPath () {
        if (this.currentScript()) {
            return this.currentScript().basePath()
        } 

        if (!this.isInBrowser()) {
            return process.cwd()
        }
        return ""
    }

    absolutePathForRelativePath (aPath) {
        const parts = this.currentScriptPath().split("/").concat(aPath.split("/"))
        let rPath = parts.join("/")

        if (rPath[0] === "/"[0] && this.isInBrowser()) {
            rPath = "." + rPath
        }

        return rPath
    }

    absolutePathsForRelativePaths (paths) {
        return paths.map((aPath) => { return this.absolutePathForRelativePath(aPath) })
    }

    pushRelativePaths (paths) {
        //debugger
        this.pushFilePaths(this.absolutePathsForRelativePaths(paths))
        return this
    }

    pushFilePaths (paths) {
        this.setUrls(paths.concat(this.urls()))
        this.setMaxUrlCount(this.maxUrlCount() + paths.length)
        return this
    }

    pushDoneCallback (aCallback) {
        this.doneCallbacks().push(aCallback)
        return this
    }

    // --- run ---

    run () {
        this.loadNext()
    }

    isDone () {
        return this.urls().length === 0
    }

    loadNext () {
        if (!this.isDone()) {
            const url = this.urls().shift()
            this.loadUrl(url)
        } else {
            this.done()
        }
        return this
    }

    postEvent (eventName, detail) {
        if (this.isInBrowser()) {
            const myEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                cancelable: true,
                composed: false,
              });
              window.dispatchEvent(myEvent);

            //window.postMessage("importerUrl", { url: url, maxUrlCount: this.maxUrlCount() });
        }
        return this
    }

    fullPathForUrl (url) {
        if (!this.isInBrowser()) {
            if (url.indexOf("://") === -1 && url.indexOf("/") !== 0) {
                //console.log("url: '" + url + "'")
                const rootPath = process.cwd()
                const nodePath = require("path")
                const fullPath = nodePath.join(rootPath, url)
                console.log("url: '" + url + "' -> '" + fullPath + "'")
                return fullPath
            }
        }
        return url
    }

    loadJsUrl (url) {
        const fullPath = this.fullPathForUrl(url)
        this.jsFilesLoaded().push(fullPath)
        const script = JsScript.clone().setImporter(this).setFullPath(fullPath).setDoneCallback(() => { this.loadNext() })
        this.setCurrentScript(script)

        const isImportsFile = url.split("/").pop() === "_imports.js"
        if (this.isInIndexMode() && !isImportsFile) {
            this.loadNext()
        } else {
            this.currentScript().run()
        }
    }

    loadUrl (url) {
        //this.urlLoadingCallbacks().forEach(callback => callback(url, this.maxUrlCount()))

        if (this.isInBrowser()) {
            const detail = { url: url, maxUrlCount: this.maxUrlCount() }
            this.postEvent("resourceLoaderLoadUrl", detail)
        }

        const extension = url.split(".").pop().toLowerCase()

        if (extension === "js" /*|| extension === "json"*/) {
            if (!this.isEmbeded()) {
                console.log("load js ", url)
                this.loadJsUrl(url)
            } else {
                this.loadNext() 
            }
        } else if (extension === "css") {
            this.cssFilesLoaded().push(url)
            if (!this.isEmbeded()) {
                console.log("load css ", url)
                CssLink.clone().setFullPath(url).run() // move to CSSResources?
            }
            this.loadNext()
        } else {
            // leave it to other resource handlers which call ResourceLoader.shared().resourceFilePathsWithExtensions()
            this.resourceFilePaths().push(url) 
            this.loadNext()
        }

        return this
    }

    done () {
        console.log("ResourceLoader.done() -----------------------------")
        //debugger
        this.doneCallbacks().forEach(callback => callback())
        this.postEvent("resourceLoaderDone", { }) 
        return this
    }

    setError (error) {
        //this.errorCallbacks().forEach(callback => callback(error))
        this.postEvent("resourceLoaderError", { error: error }) 
        return this
    }
}.initThisClass());

// --- ResourceLoader -----------------------------------------------


getGlobalThis().resourceLoader = ResourceLoader.shared();
resourceLoader.pushRelativePaths(["_imports.js"]);

if (getGlobalThis().ResourceLoaderIsEmbedded) {
    console.log("ResourceLoader is embeded, will run on page load")
    resourceLoader.setIsEmbeded(getGlobalThis().ResourceLoaderIsEmbedded)
    window.addEventListener("load", () => { resourceLoader.run(); });
} else {
    console.log("ResourceLoader is not embeded, will not auto run")
    //console.log("ResourceLoader is not embeded, will run with timeout")
    setTimeout(() => resourceLoader.run(), 1)
}
