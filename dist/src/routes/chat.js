"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Chat_1 = require("../controllers/Chat");
var route = (0, express_1.Router)();
var chat = new Chat_1.Chat();
route.post("/", chat.create);
route.get("/:conversationId", chat.findAllByConversationId);
route.put("/:chatId", chat.updateChat);
route.delete("/:chatId", chat.deleteChat);
exports.default = route;
//# sourceMappingURL=chat.js.map