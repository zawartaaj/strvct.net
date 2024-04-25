"use strict";

/* 
    AiRequest

    AiRequest <- on -> XhrWrapper 

    Wrapper for request to API service that manages streaming the response and checking for various errors.
    
    Delegate protocol:

      onRequestBegin(request)
      onRequestComplete(request)
      onRequestError(request, error)

      onStreamStart(request)
      onStreamData(request, newContent)
      onStreamEnd(request)

    Delegate can get info via:

      request.fullContent() 
      request.status()
      request.error()

*/

(class AiRequest extends BMStorableNode {

  initPrototypeSlots() {
    {
      const slot = this.newSlot("delegate", null); // optional reference to object that owns request 
    }

    {
      const slot = this.newSlot("service", null); 
    }

    {
      const slot = this.newSlot("needsProxy", true);
      slot.setCanInspect(true);
      slot.setCanEditInspection(false);
      slot.setDuplicateOp("duplicate");
      slot.setInspectorPath("");
      slot.setIsSubnodeField(true);
      slot.setShouldStoreSlot(true);
      slot.setSlotType("String");
      slot.setSyncsToView(true);
    }

    {
      const slot = this.newSlot("bodyJson", null); // this will contain the model choice and messages
    }

    {
      const slot = this.newSlot("body", null); 
      slot.setCanInspect(false);
      slot.setCanEditInspection(false);
      slot.setInspectorPath("");
      slot.setIsSubnodeField(false);
      slot.setShouldStoreSlot(true);
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("String");
    }

    {
      const slot = this.newSlot("json", null);
    }

    // streaming


    {
      const slot = this.newSlot("xhr", null);
    }

    {
      const slot = this.newSlot("isStreaming", false); // external read-only
      slot.setInspectorPath("")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("Boolean")
      slot.setIsSubnodeField(true)
    }

    {
      const slot = this.newSlot("xhrPromise", null); 
    }

    {
      const slot = this.newSlot("requestId", null);
      slot.setInspectorPath("");
      slot.setShouldStoreSlot(true);
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("String");
      slot.setIsSubnodeField(true);
      slot.setCanEditInspection(false);
    }

    {
      const slot = this.newSlot("readIndex", 0); // current read index in the responseText
      slot.setInspectorPath("");
      slot.setShouldStoreSlot(true);
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("String");
      slot.setIsSubnodeField(true);
      slot.setCanEditInspection(false);
    }

    {
      const slot = this.newSlot("readLines", null);
    }

    {
      const slot = this.newSlot("isContinuation", false); // flag to skip "start" delegate message
      slot.setInspectorPath(this.type());
      slot.setShouldStoreSlot(true);
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("Boolean");
      slot.setIsSubnodeField(true);
      slot.setCanEditInspection(false);
    }


    {
      // where the continued request started in the fullContext (not the responseText)
      // Need to remove fullContent after this point if we need to retry the request
      const slot = this.newSlot("continuationStartIndex", 0); 
      slot.setInspectorPath(this.type());
      slot.setShouldStoreSlot(true);
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("Boolean");
      slot.setIsSubnodeField(true);
      slot.setCanEditInspection(false);
    }

    {
      const slot = this.newSlot("stopReason", null);
      slot.setInspectorPath(this.type());
      slot.setShouldStoreSlot(true);
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("String");
      slot.setIsSubnodeField(true);
      slot.setCanEditInspection(false);
    }

    {
      const slot = this.newSlot("retryDelaySeconds", 1);
      slot.setInspectorPath(this.type());
      slot.setShouldStoreSlot(false);
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("Number");
      slot.setIsSubnodeField(true);
      slot.setCanEditInspection(false);
    }

    {
      const slot = this.newSlot("fullContent", null); 
      slot.setInspectorPath(this.type());
      slot.setShouldStoreSlot(true);
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("String");
      slot.setIsSubnodeField(true);
      slot.setCanEditInspection(false);
    }

    {
      const slot = this.newSlot("error", null);
    }

    {
      const slot = this.newSlot("status", "");
      slot.setInspectorPath(this.type());
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("String")
      slot.setIsSubnodeField(true)
      slot.setCanEditInspection(false)
    }


    {
      const slot = this.newSlot("didAbort", false);
      slot.setInspectorPath(this.type());
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("Boolean")
      slot.setIsSubnodeField(true)
      slot.setCanEditInspection(false)
    }

    {
      const slot = this.newSlot("retryRequestAction", null);
      slot.setInspectorPath("");
      slot.setLabel("Retry Request");
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("Action");
      slot.setIsSubnodeField(true);
      slot.setActionMethodName("retryRequest");
    }

    {
      const slot = this.newSlot("copyBodyAction", null);
      slot.setInspectorPath("");
      slot.setLabel("Copy Body");
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("Action");
      slot.setIsSubnodeField(true);
      slot.setActionMethodName("copyBody");
    }

    {
      const slot = this.newSlot("copyMessagesAction", null);
      slot.setInspectorPath("");
      slot.setLabel("Copy Messages");
      slot.setSyncsToView(true);
      slot.setDuplicateOp("duplicate");
      slot.setSlotType("Action");
      slot.setIsSubnodeField(true);
      slot.setActionMethodName("copyMessages");
    }


    this.setShouldStore(false)
    this.setShouldStoreSubnodes(false)
  }


  init () {
    super.init();
    this.setIsDebugging(false);
    this.setRequestId(this.puuid());
    this.setTitle("Request");
    this.setIsDebugging(true);
  }

  subtitle () {
    return this.status();
  }

  // --- service properties ---

  apiUrl () {
    return this.service().chatEndpoint();
  }

  apiKey () {
    return this.service().apiKey();
  }

  // --- fetch ---

  body () {
    return JSON.stringify(this.bodyJson(), 2, 2);
  }

  requestOptions () {
    const apiKey = this.apiKey();
    return {
      method: "POST",
      headers: {
        //"Content-Type": "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Bearer ${apiKey}`,
        'Accept-Encoding': 'identity'
      },
      body: JSON.stringify(this.bodyJson())
    };
  }

  assertValid () {
    if (!this.apiUrl()) {
      throw new Error(this.type() + " apiUrl missing");
    }

    if (!this.apiKey()) {
      throw new Error(this.type() + " apiKey missing");
    }
  }

  activeApiUrl () {
    let url = this.apiUrl();
    if (this.needsProxy()) {
      url = ProxyServers.shared().defaultServer().proxyUrlForUrl(url);
    }
    return url;
  }

  proxyUrl () {
    const proxyUrl = ProxyServers.shared().defaultServer().proxyUrlForUrl(this.url());
    return proxyUrl;
    //return WebBrowserWindow.shared().rootUrl() + "/?proxyUrl=" + encodeURIComponent(this.url())
  }

  showRequest () {
    this.debugLog(this.description());
  }

  showResponse () {
    const json = this.json();
    this.debugLog(" response json: ", json);
    if (json.error) {
      console.warn(this.type() + " ERROR:", json.error.message);
    }
  }

  // --- normal response --- 

  responseSizeDescription () {
    const size = this.xhr() ? this.xhr().responseText.length : 0;
    return ByteFormatter.clone().setValue(size).formattedValue();
  }

  // --- helpers ---

  curlCommand () {
    const commandParts = [];
    commandParts.push(`curl  --insecure "` + this.activeApiUrl() + '"');
    const headers = this.requestOptions().headers;

     Object.keys(headers).forEach((key) => {
      const value = headers[key];
      commandParts.push(` --header "${key}: ${value}"`);
    });

    const data = JSON.stringify(this.bodyJson());
    commandParts.push(` --data '` + data + `'`);
    return commandParts.join(" \\\n");
  }

  description () {
    const json = {
      requestId: this.requestId(),
      options: this.requestOptions(),
      activeApiUrl:  this.activeApiUrl(),
      apiUrl:  this.apiUrl(),
      body: this.bodyJson()
    };
    return JSON.stringify(json, 2, 2);
  }

  // --- streaming response --- 

  assertReadyToStream () {
    const target = this.delegate();
    if (target) {
      // verify streamTarget protocol is implemented by target
      assert(target.onStreamStart);
      assert(target.onStreamData);
      assert(target.onStreamEnd);
    }
  }

  setupForStreaming () {
    // subclasses should override this method to set up the request for streaming
    return this;
  }

  async asyncSendAndStreamResponse () {

    this.service().prepareToSendRequest(this); // give anthropic a chance to ensure alternating user/assistant messages

    this.setError(null); // clear error (in case we are retrying)
    assert(!this.xhr());

    if (!this.isContinuation()) {
      assert(!this.xhrPromise());
      this.setXhrPromise(Promise.clone());
    }

    this.assertValid();
    this.assertReadyToStream();

    //console.log("--- URL ---\n", this.activeApiUrl(), "\n-----------");
    //console.log("--- CURL ---\n", this.curlCommand(), "\n-----------");

    this.setIsStreaming(true);
    this.setStatus("streaming");

    this.setupForStreaming();
    this.setReadLines([]);

    const xhr = new XMLHttpRequest();
    this.setXhr(xhr);
    xhr.open("POST", this.activeApiUrl());

    // set headers
    const options = this.requestOptions();
    
    for (const header in options.headers) {
      const value = options.headers[header];
      xhr.setRequestHeader(header, value);
    }

    xhr.responseType = ""; // "" or "text" is required for streams

    if (!this.isContinuation()) {
      this.setFullContent("");
    }

    // TODO: move to a standard wrapped XHR class?
    
    // why false arg? see https://stackoverflow.com/questions/51204603/read-response-stream-via-xmlhttprequest
    xhr.addEventListener("progress", (event) => {
     EventManager.shared().safeWrapEvent(() => { this.onXhrProgress(event) }, event)
     //this.onXhrProgress(event)
    }, false);

    xhr.addEventListener("loadend", (event) => {
      try { 
        EventManager.shared().safeWrapEvent(() => { this.onXhrLoadEnd(event) }, event);
      } catch (error) {
       this.onError(error); 
      }
      //this.onXhrLoadEnd(event)
    });

    xhr.addEventListener("error", (event) => {
      EventManager.shared().safeWrapEvent(() => { this.onXhrError(event) }, event)
      //this.onXhrError(event)
    });

    xhr.addEventListener("abort", (event) => {
      EventManager.shared().safeWrapEvent(() => { this.onXhrAbort(event) }, event)
      //this.onXhrAbort(event)
    });

    //  EventManager.shared().safeWrapEvent(() => { ... })
    
    if (!this.isContinuation()) {
      this.sendDelegate("onRequestBegin");
      this.sendDelegate("onStreamStart");
    }

    //const s = JSON.stringify(options, 2, 2);
    //this.debugLog("SENDING REQUEST BODY:", options.body);
    xhr.send(options.body);

    return this.xhrPromise();
  }


  onXhrProgress (event) {
    /*
    const txt = event.currentTarget.responseText;
    const latestString = txt.substr(txt.length - event.loaded, event.loaded);
    console.log(this.typeId() + " onXhrProgress() read [" + latestString + "]");
    */
    //debugger;
    this.onXhrRead();

  }

  onXhrLoadEnd (event) {
    if (this.didAbort()) {
      return;
    }
    //console.log(this.typeId() + " onXhrLoadEnd() bytes [[" + this.fullContent() + "]]");

    //debugger
    const isError = this.xhr().status >= 300
    if (isError) {
      console.log(this.description());
      console.error(this.xhr().responseText);
      const json = JSON.parse(this.xhr().responseText);
      if (json.error) {
        this.onError(new Error(json.error.message));
      } else {
        this.onError(new Error("request error code:" + this.xhr().status + ")"));
      }
    } else {
      this.readXhrLines() // finish reading any remaining lines
    }


    if (this.stoppedDueToMaxTokens()) {
      // continue with another request
      this.continueRequest();
      return;
    } else if (this.stopError()) {
      if (!this.error()) {
        // we don't want to overwrite a custom error if it's already set
        this.onError(this.stopError());
      }
      return;
    }
    this.sendDelegate("onStreamEnd");
    this.sendDelegate("onRequestComplete")

    this.setStatus("completed " + this.responseSizeDescription());
    this.xhrPromise().callResolveFunc(this.fullContent()); 

    console.log(this.typeId() + " onXhrLoadEnd()");

    //const completionDict = this.bodyJson();
    //console.log("completionDict.usage:", JSON.stringify(completionDict.usage, 2, 2)); // no usage property!
  }

  continueMessage () {
    return { 
      role: "user", 
      content: "Your last request was truncated due to the response size limit. Please continue exactly where you left off."
    };
  }

  responseMessage () {
    return {
      role: "assistant",
      content: this.fullContent()
    }
  }

  lastMessageIsContinueRequest () {
    const messages = this.bodyJson().messages;
    const lastMessage = messages.last();
    // continueMessage is the user request for the ai to continue it's last message 
    return lastMessage && lastMessage.content === this.continueMessage().content;
  }

  retryRequest () {
    this.setError(null);
    this.setFullContent(this.fullContent().substring(0, this.continuationStartIndex()));
    this.setXhr(null);
    // TODO need to track where coninutation read index was
    this.setReadIndex(0); // this is the read index on the new xhr responseText, not the AiRequest fullContent
    this.setStopReason(null);
    this.setStatus("retrying");
    this.setXhrPromise(null);
    this.asyncSendAndStreamResponse();
  }

  copyBody () {
    this.body().copyToClipboard();
    return this;
  }

  copyMessages () {
    const messages = this.bodyJson().messages;
    const content = JSON.stringify(messages, 2, 2);
    content.copyToClipboard();
    return this;
  }

  continueRequest () {
    console.log("========================================== " + this.typeId() + " continueRequest() =====================================");
    // add a continue message to the end of the messages array if needed
    //if (this.lastMessageIsContinueRequest()) {
    const messages = this.bodyJson().messages;
    this.setContinuationStartIndex(this.fullContent().length); // clip back to here if we retry the new request
    if (this.isContinuation()) {
      messages.secondToLast().content += this.fullContent();
    } else {
      messages.push(this.responseMessage());
      messages.push(this.continueMessage());
    }

    // clear request state except fullContent
    this.setXhr(null);
    this.setReadIndex(0); // this is the read index on the responseText, not the fullContent
    this.setStopReason(null);
    this.setStatus("continuing");

    this.setIsContinuation(true); // so the fullContent isn't cleared
    // send request again to continue where we left off
    this.asyncSendAndStreamResponse();
  }

  didUpdateSlotError (oldValue, newValue) {
    //debugger
    if (newValue) {
      this.setStatus("ERROR: " + newValue.message)
    }
  }

  retryWithDelay (seconds) {
    console.log(this.typeId() + " retrying in " + seconds + " seconds");
    this.addTimeout(() => { 
      this.retryRequest();
    }, seconds*1000);
  }

  
  onError (e) {
    this.setError(e);

    if (this.isRecoverableError()) {
      const d = this.retryDelaySeconds();
      const f = 2; // exponential backoff factor
      const nd = (d*f).randomBetween(d*f*f); // random spot between the next two exponential points
      this.retryWithDelay(nd);
      this.setRetryDelaySeconds(nd);
      const ts = TimePeriodFormatter.clone().setValueInSeconds(nd).formattedValue();
      e.message = this.service().title() + " overloaded, retrying in " + ts;
    }

    console.warn(" ======================= " + this.type() + " ERROR: " + e.message + " ======================= ");
    //debugger;
    this.sendDelegate("onRequestError", [this, e]);

    if (e) {
      console.warn(this.debugTypeId() + " " + e.message);
    }
    return this;
  }

  onXhrError (event) {
    debugger;
    const xhr = this.xhr();
    // error events don't contain messages - need to look at xhr and guess at what happened
    //let s = "Error on Xhr requestId " + this.requestId() + " ";
    let s = "Xhr error: " + this.description() + " ";
    s += " status: " + this.nameForXhrStatusCode(xhr.status); // e.g. 404 = file not found
    s += ", statusText: '" + xhr.statusText + "'";
    s += ", readyState: " + this.nameForXhrReadyState(xhr.readyState); // e.g.. 4 === DONE
    const error = new Error(s);
    this.onError(error);
    this.sendDelegate("onStreamEnd");
    this.xhrPromise().callRejectFunc(error);
  }

	nameForXhrStatusCode (statusCode) {
		/**
		   * This function returns a brief description of an XHR status code.
		   * 
		   * @param {number} statusCode - The XHR status code.
		   * @returns {string} - A brief description of the status, or "Unknown status".
		   */
	
		const xhrStatuses = {
		  0: "Not started: Network Error, Request Blocked, or CORS issue",
		  100: "Continue",
		  101: "Switching protocols",
		  200: "OK - Request successful",
		  201: "Created - Resource created",
		  301: "Moved permanently",
		  304: "Not modified",
		  400: "Bad request", 
		  401: "Unauthorized",
		  403: "Forbidden",
		  404: "Not found",
		  500: "Internal server error" 
		};
	
		return statusCode + " (" + (xhrStatuses[statusCode] || "Unknown status") + ")";
	  }

  nameForXhrReadyState (readyState) {
    /**
     * This function returns a brief description of an XHR readyState.
     * 
     * @param {number} readyState - The XHR readyState value.
     * @returns {string} - A brief description of the state, or "Unknown state".
     */

    const xhrStates = {
      0: "Request not initialized",
      1: "Server connection established",
      2: "Request received",
      3: "Processing request",
      4: "Request finished"
    };

    return status + " (" + (xhrStates[readyState] || "Unknown ready state") + ")";
  }

  onXhrAbort (event) {
    this.setDidAbort(true);
    this.setStatus("aborted");
    this.sendDelegate("onStreamEnd");
    //this.sendDelegate("onStreamAbort");
    this.xhrPromise().callRejectFunc(new Error("aborted"));
  }

  unreadResponse () {
    const unread = this.xhr().responseText.substr(this.readIndex());
    return unread
  }

  readRemaining () {
    const responseText = this.xhr().responseText;

    if (this.readIndex() >= responseText.length) {
      return undefined;
    }

    const newLineIndex = responseText.length;
    const newLine = responseText.substring(this.readIndex(), newLineIndex);
    this.setReadIndex(newLineIndex); // advance the read index
    return newLine;
  }
  
  readNextXhrLine () {
    const responseText = this.xhr().responseText;
    const newLineIndex = responseText.indexOf("\n", this.readIndex());
  
    if (newLineIndex === -1) {
      return undefined; // no new line found
    }
  
    const newLine = responseText.substring(this.readIndex(), newLineIndex);
    this.setReadIndex(newLineIndex + 1); // advance the read index
  
    return newLine;
  }


  onXhrRead () {
    this.readXhrLines()
  }

  readXhrLines () {
    throw new Error(this.type() + " readXhrLines not implemented");
  }

  onStreamJsonChunk (json) {
    throw new Error(this.type() + " onStreamJsonChunk not implemented");
  }

  isActive () {
    const xhr = this.xhr();
    if (xhr) {
      const state = xhr.readyState;
      return (state >= 1 && state <= 3);
    }
    return false;
  }
  
  abort () {
    if (this.isActive()) {
      this.xhr().abort();
    }
    return this;
  }

  shutdown () {
    this.abort();
    return this;
  }

  onNewContent (newContent) {
    //console.log(this.typeId() + ".onNewContent(`" + newContent + "`)");
    this.setFullContent(this.fullContent() + newContent);
    this.sendDelegate("onStreamData", [this, newContent]);
  }

  sendDelegate (methodName, args = [this]) {
    const d = this.delegate()
    if (d) {
      const f = d[methodName]
      if (f) {
        //this.debugLog(this.typeId() + " sending " + d.typeId() + "." + methodName + "(" + (args[1]? args[1] : "") + ")")
        f.apply(d, args)
        return true
      }
    }
    return false
  }

  // --- stopping ---

  stopError () {
    if (this.stopReason() !== null && this.stopReason() !== "end_turn") { // end_turn is Anthropic's way of saying "done" (need to move this)
      return new Error(this.stopReasonDescription());
    }
    return null;
  }

  stopReasonDict () {
    return new Error(this.type() + " stopReasonDict not implemented");
  }

  stopReasonDescription () {
    const reason = this.stopReason();
    const dict = this.stopReasonDict();
    return dict[reason];
  }

  stoppedDueToMaxTokens () {
    throw new Error(this.type() + " stoppedDueToMaxTokens not implemented");
  }

  retriableStopReasons () {
    return new Set(["overloaded_error"]);
  }

  isRecoverableError () {
    const e = this.error();
    if (e) {
      return this.retriableStopReasons().has(e.name);
    }
    return false;
  }

}).initThisClass();
