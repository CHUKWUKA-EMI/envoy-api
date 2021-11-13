import { Router } from "express";
import { Conversations } from "../controllers/Conversations";

const route = Router();
const conversations = new Conversations();

route.post("/", conversations.create);
route.get("/", conversations.findAll);
route.get("/:id", conversations.findOne);
route.delete("/:id", conversations.deleteConversation);

export default route;
