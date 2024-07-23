

"use strict";

// get command line arguments
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).options({
  port: { type: 'number', demandOption: false, describe: 'Port number' },
  key: { type: 'string', demandOption: false, describe: 'Key file path' },
  cert: { type: 'string', demandOption: false, describe: 'Cert file path' },
  secure: { type: 'boolean', demandOption: false, default: false, describe: 'Is secure (set to true for HTTPS, false for HTTP)' }
}).argv;

//console.log(argv);

require("./StrvctHttpsServer.js");

const server = StrvctHttpsServer.clone();

// apply command line arguments
if (argv.port) {
    server.setPort(argv.port);
}

if (argv.cert) {
    server.setCertPath(argv.cert);
}

if (argv.key) {
    server.setKeyPath(argv.key);
}

server.setIsSecure(argv.secure);
//console.log("========= argv.secure:", argv.secure);
//console.log("========= server.isSecure():", server.isSecure());

server.run();


// need these to catch errors that can occur on requests, like DNS lookup failures 

process.on('unhandledRejection', (reason, promise) => {
    console.error('main.js: Unhandled Rejection at:', promise, 'reason:', reason);
    console.error('Stack trace:', reason.stack);
});

process.on('uncaughtException', (error) => {
    console.error('main.js: Uncaught Exception:', error);
    console.error('Stack trace:');
    console.error(error.stack);
});