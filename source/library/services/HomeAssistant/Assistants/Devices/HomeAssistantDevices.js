"use strict";

/* 
    HomeAssistantDevices

*/

(class HomeAssistantDevices extends BMSummaryNode {
  initPrototypeSlots() {

  }

  init() {
    super.init();
    this.setTitle("devices");
    this.setShouldStore(true);
    this.setShouldStoreSubnodes(true);
    this.setSubnodeClasses([HomeAssistantDevice]);
    this.setCanAdd(true);
    this.setNodeCanReorderSubnodes(true);
  }

  finalInit() {
    super.finalInit()
    this.setNoteIsSubnodeCount(true);
  }

  /*
  didInit () {
    super.didInit()
  }
  */

  /*
  service () {
    return this.parentNode()
  }
  */

  setDevicesJson (devicesJson) {
    this.removeAllSubnodes();

    devicesJson.forEach(deviceJson => {
      const node = HomeAssistantDevice.clone();
      node.setDeviceJson(deviceJson);
      this.addSubnode(node);
      //node.setEntitiesJson(deviceEntities);
    });
    return this;
  }

}.initThisClass());
