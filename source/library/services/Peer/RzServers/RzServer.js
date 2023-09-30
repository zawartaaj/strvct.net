"use strict";

/* 
    RzServer

*/

(class RzServer extends BMStorableNode {
  initPrototypeSlots() {


    /*
    {
      host: "peerjssignalserver.herokuapp.com",
      path: "/peerjs",
      secure: true,
      port: 443,
      reliable: true,
      pingInterval: 1000, // 1 second
      debug: false
    }
    */

    {
      const slot = this.newSlot("host", "peerjssignalserver.herokuapp.com");      
      slot.setInspectorPath("info")
      //slot.setLabel("prompt")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("String")
      slot.setIsSubnodeField(true)
      slot.setCanEditInspection(true)
      slot.setSummaryFormat("value")
    }

    {
      const slot = this.newSlot("path", "/peerjs");      
      slot.setInspectorPath("info")
      //slot.setLabel("prompt")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("String")
      slot.setIsSubnodeField(true)
      slot.setCanEditInspection(true)
      slot.setSummaryFormat("value")
    }

    {
      const slot = this.newSlot("port", 443);      
      slot.setInspectorPath("info")
      //slot.setLabel("prompt")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("Number")
      slot.setIsSubnodeField(true)
      slot.setCanEditInspection(true)
      slot.setSummaryFormat("value")
    }

    {
      const slot = this.newSlot("isSecure", true);      
      slot.setInspectorPath("info")
      slot.setLabel("is secure")
      slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("Boolean")
      slot.setIsSubnodeField(true)
      slot.setCanEditInspection(true)
      slot.setSummaryFormat("key value")
    }

    {
      const slot = this.newSlot("peers", null)
      slot.setFinalInitProto(RzServerPeers);
      slot.setShouldStoreSlot(true);
      slot.setIsSubnode(true);
    }

    {
      const slot = this.newSlot("serverConns", null)
      slot.setFinalInitProto(RzServerConns);
      slot.setShouldStoreSlot(true);
      slot.setIsSubnode(true);
    }

    {
      const slot = this.newSlot("refreshAction", null);
      slot.setInspectorPath("")
      slot.setLabel("Refresh Peers")
      //slot.setShouldStoreSlot(true)
      slot.setSyncsToView(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("Action")
      slot.setIsSubnodeField(true)
      slot.setActionMethodName("refreshPeers");
    }

    this.setShouldStoreSubnodes(false);
  }

  init() {
    super.init();
    //this.setPeerConnections(new Map());
    this.setIsDebugging(false)
    this.setCanDelete(true)
    return this
  }

  finalInit () {
    super.finalInit()
    this.setCanDelete(true)
    this.refreshPeers()
  }

  title () {
    return this.host() 
  }

  subtitle () {
    return this.port() + " " + (this.isSecure() ? "secure" : "");
  }

  /*
  shutdown () {
    this.peerConnections().valuesArray().forEach((conn) => {
      conn.shutdown();
    });
    return this;
  }
  */

  // --- getting peer list ----

  getPeersUrl () {
    return "https://" + this.host() + this.path() + '/api/peers';
  }


  async refreshPeers () {
    const peerIds = await this.fetchPeerIds();
    this.peers().setPeerIdArray(peerIds)
    return peerIds
  }

  async fetchPeerIds() { // Note this is a GET request, so we don't need to be connected to do this
    const url = this.getPeersUrl();
    console.log("getPeersUrl: '" + url + "'");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const peers = await response.json();
    return peers;
  }

  availablePeerIds () {
    return this.peers().subnodes().map(rzPeer => rzPeer.title())
  }

  // --- connecting to a peer ----
  /*
  connectToPeerId (peerId) {
    const conn = this.peer().connect(peerId);
    const pc = PeerConnection.clone().setConn(conn)
    this.addPeerConnection(pc);
    return pc
  }
  */


}.initThisClass());