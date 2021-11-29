"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Conversations_1 = require("../controllers/Conversations");
var route = (0, express_1.Router)();
var conversations = new Conversations_1.Conversations();
route.post("/", conversations.create);
route.get("/", conversations.findAll);
route.get("/:id", conversations.findOne);
route.delete("/:id", conversations.deleteConversation);
exports.default = route;
//# sourceMappingURL=conversation.js.map