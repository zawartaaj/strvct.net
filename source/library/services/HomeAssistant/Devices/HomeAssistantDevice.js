"use strict";

/* 
    HomeAssistantDevice


   HomeAssistantDevice:{
  "area_id": null,
  "configuration_url": null,
  "config_entries": [
    "a8bc13c525dbdcf6e0bbcd6b8693dadc"
  ],
  "connections": [],
  "disabled_by": null,
  "entry_type": "service",
  "hw_version": null,
  "id": "6cdcb91bb251ccd6ba6828d4b56c761b",
  "identifiers": [
    [
      "sun",
      "a8bc13c525dbdcf6e0bbcd6b8693dadc"
    ]
  ],
  "manufacturer": null,
  "model": null,
  "name_by_user": null,
  "name": "Sun",
  "serial_number": null,
  "sw_version": null,
  "via_device_id": null
}

*/

(class HomeAssistantDevice extends HomeAssistantObject {
  initPrototypeSlots() {
    /*
    {
      const slot = this.newSlot("entitiesNode", null)
      slot.setFinalInitProto(HomeAssistantEntities);
      slot.setShouldStoreSlot(true);
      slot.setIsSubnode(true);
    }
    */

    {
      const slot = this.newSlot("entitiesNode", null)
      slot.setFinalInitProto(HomeAssistantEntities);
      slot.setShouldStoreSlot(false);
      slot.setIsSubnode(true);
    }
  }

  init() {
    super.init();
  }
  
  finalInit () {
    super.finalInit();
    this.setNodeCanEditTitle(true);
    this.setNodeSubtitleIsChildrenSummary(true);
  }

  updateSubtitle () {
    const s = [
      this.id(), 
      this.entitiesNode().subnodeCount() + " entities",
      this.statesCount() + " states"
    ].join("\n");
    this.setSubtitle(s);
    return this;
  }

  statesCount () {
    return this.entitiesNode().subnodes().sum(entity => entity.statesCount());
  }

  id () {
    return this.haJson().id;
  }

  areaId () {
    return this.haJson().area_id;
  }

  didUpdateSlotHaJson (oldValue, newValue) {
    const json = newValue;
    //console.log(this.type() + ":" + JSON.stringify(newValue, 2, 2));
    this.setTitle(json.name);
    this.setSubtitle(json.id);
    return this;
  }

  completeSetup () {
    //    this.removeAllSubnodes();
    this.updateSubtitle();
  }

  addEntity (entity) {
    entity.removeFromParentNode();
    this.entitiesNode().addSubnode(entity);
    return this;
  }

}).initThisClass();
