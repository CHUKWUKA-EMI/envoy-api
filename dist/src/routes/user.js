"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var User_1 = require("../controllers/User");
var route = (0, express_1.Router)();
var user = new User_1.default();
route.post("/signup", user.create);
route.get("/activate-user/:token", user.activateEmail);
route.post("/login", user.login);
route.get("/all", user.getAllUsers);
route.get("/me", user.currentUser);
route.get("/:id", user.getOneUser);
route.patch("/update", user.updateUser);
route.patch("/reset-password", user.resetPassword);
route.patch("/change-password", user.changePassword);
exports.default = route;
//# sourceMappingURL=user.js.map