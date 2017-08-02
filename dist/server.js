"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var app_1 = require("./app");
var port = 8005;
var server = http.createServer(app_1.default);
server.listen(port);
server.on('listening', function () {
    console.log('listening!');
});
//# sourceMappingURL=server.js.map