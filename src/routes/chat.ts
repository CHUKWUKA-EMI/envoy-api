import { Router } from "express";
import { Chat } from "../controllers/Chat";

const route = Router();
const chat = new Chat();

route.post("/", chat.create);
route.get("/:conversationId", chat.findAllByConversationId);
route.put("/:chatId", chat.updateChat);
route.delete("/:chatId", chat.deleteChat);

export default route;
