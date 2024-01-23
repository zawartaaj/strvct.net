"use strict";

require("./getGlobalThis.js")
require("./Base.js")
require("./StrvctHttpsServerRequest.js")

const https = require('https');
const fs = require('fs');
const nodePath = require('path');

(class StrvctHttpsServer extends Base {
	
	initPrototypeSlots () {
		this.newSlot("server", null);
		this.newSlot("hostname", "localhost");
		this.newSlot("port", null);
		this.newSlot("keyPath", null);
		this.newSlot("certPath", null);
	}

	init () {
		super.init();
		this.setPort(8000);
		this.setKeyPath(nodePath.join(__dirname, 'keys/server.key'));
		this.setCertPath(nodePath.join(__dirname, 'keys/server.crt'));
		return this
	}
	
	options () {
		return {
			key: fs.readFileSync(this.keyPath()),
			cert: fs.readFileSync(this.certPath())
		}
	}

	run () {
		/*
		require("../source/boot/ResourceManager.js")
		//vm.runInThisContext(fs.readFileSync(__dirname + "/mime_extensions.js"))
		//vm.runInThisContext(fs.readFileSync(__dirname + "/../source/boot/ResourceManager.js"))
		*/

		this._server = https.createServer(this.options(), (request, response) => { 
			this.onRequest(request, response) 
		})
		this._server.listen(this.port());

		const sandboxPath =  process.cwd()
		console.log(this.type() + ":")
		console.log("  cwd: '" + sandboxPath + "'")
		console.log("  port: " + this.port())
		console.log("  url: " + "https://" + this.hostname() + ":" + this.port() + "/index.html")
	}

	onRequest (request, response) {
		//console.log("got request ", request)
		const r = StrvctHttpsServerRequest.clone()
		r.setServer(this)
		r.setRequest(request)
		r.setResponse(response)
		//this.wait(10);
		r.process()
	}

	wait (ms) {
		console.log("wait(" + ms + ")");
		const start = Date.now();
		while (Date.now() - start < ms) {
			// do nothing
		}
	}

}.initThisClass());
