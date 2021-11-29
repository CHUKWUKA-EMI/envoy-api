"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var authenticate = function (req, res, next) {
    var freePaths = [
        "/api/v1/user/signup",
        "/api/v1/user/signup/",
        "/api/v1/user/login",
        "/api/v1/user/login/",
        "/api/v1/user/activate-user",
        "/api/v1/user/activate-user/",
        "/api/v1/user/reset-password",
        "/api/v1/user/reset-password/",
    ];
    if (freePaths.includes(req.path) ||
        req.path.startsWith("/api/v1/user/activate-user")) {
        return next();
    }
    if (req.header("Authorization") === undefined) {
        return res.status(401).json("Authentication Failed");
    }
    var token = req.header("Authorization").split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json("Authentication Failed");
    }
    req.user = decoded;
    return next();
};
exports.default = authenticate;
//# sourceMappingURL=authenticate.js.map