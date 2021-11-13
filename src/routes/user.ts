import { Router } from "express";
import UserController from "../controllers/User";

const route = Router();
const user = new UserController();
route.post("/signup", user.create);
route.get("/activate-user/:token", user.activateEmail);
route.post("/login", user.login);
route.get("/all", user.getAllUsers);
route.get("/me", user.currentUser);
route.get("/:id", user.getOneUser);
route.patch("/update", user.updateUser);
route.patch("/reset-password", user.resetPassword);
route.patch("/change-password", user.changePassword);

export default route;
