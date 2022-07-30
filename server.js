"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var http_1 = require("http");
var ws_1 = require("ws");
var uuid_1 = require("uuid");
var PORT = process.env.PORT;
var server = http_1["default"].createServer();
server.listen(PORT, function () {
    console.log("> Ready on http://localhost:".concat(PORT));
});
var rooms = {};
new ws_1["default"].Server({ server: server }).on("connection", function (ws, request) {
    if (!request.url) {
        return ws.close();
    }
    var id = (0, uuid_1.v4)();
    var room = request.url;
    // Adding the client to the room
    if (!rooms[room]) {
        rooms[room] = {};
    }
    rooms[room][id] = ws;
    // Transmitting the messages
    ws.on("message", function (raw) {
        // Parsing the message and adding the sender
        var message = __assign({}, JSON.parse(raw.toString()));
        // For each client in the room
        Object.keys(rooms[room]).forEach(function (peerId) {
            // If there is no particular recipient, or if the recipient is the current client
            if (peerId !== id &&
                (!message.recipient || message.recipient === peerId)) {
                // Forward the message
                rooms[room][peerId].send(JSON.stringify(message));
            }
        });
    });
    // Cleaning up after a client has left
    ws.on("close", function () {
        delete rooms[room][id];
        if (Object.keys(rooms[room]).length === 0) {
            delete rooms[room];
        }
    });
});
