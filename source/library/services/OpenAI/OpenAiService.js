"use strict";

/* 
    OpenAiService

*/

(class OpenAiService extends BMSummaryNode {
  initPrototypeSlots () {
    {
      const slot = this.newSlot("apiKey", "")
      //slot.setInspectorPath("")
      slot.setLabel("API Key")
      slot.setShouldStoreSlot(true)
      slot.setDuplicateOp("duplicate")
      slot.setSlotType("String")
      slot.setIsSubnodeField(true)
      //slot.setValidValues(values)
    }

    {
      const slot = this.newSlot("models", null)
      slot.setFinalInitProto(OpenAiModels)
      slot.setShouldStoreSlot(true);
      slot.setIsSubnode(true);
    }

    {
      const slot = this.newSlot("conversations", null)
      slot.setFinalInitProto(OpenAiConversations)
      slot.setShouldStoreSlot(true);
      slot.setIsSubnode(true);
    }

    {
      const slot = this.newSlot("jobs", null)
      slot.setFinalInitProto(OpenAiJobs)
      slot.setShouldStoreSlot(true);
      slot.setIsSubnode(true);
    }

    this.setShouldStore(true);
    this.setShouldStoreSubnodes(false);
  }

  init () {
    super.init();
  }

  finalInit () {
    super.finalInit()
    this.setTitle("OpenAI Chat");
    this.setSubtitle("AI service");
  }

  validateKey (s) {
    return s.length === 51 && s.startsWith("sk-");
  }

}.initThisClass());