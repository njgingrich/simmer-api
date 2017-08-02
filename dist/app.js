"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var index_1 = require("./index");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
index_1.installEndpoints(app);
exports.default = app;
//# sourceMappingURL=app.js.map