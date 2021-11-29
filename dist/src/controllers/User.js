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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("../entity/User");
var jwt = require("jsonwebtoken");
var class_validator_1 = require("class-validator");
var email_1 = require("../utilities/email");
var bcrypt = require("bcryptjs");
var ImageKit = require("imagekit");
//Imagekit config
var imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
var UserController = /** @class */ (function () {
    function UserController() {
    }
    //create user
    UserController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, firstName, lastName, email, password, existingUser, user, errors, token, url, emailClass, message, userData, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, User_1.User.findOne({ email: email })];
                    case 2:
                        existingUser = _b.sent();
                        if (existingUser) {
                            return [2 /*return*/, res.status(409).json({ message: "User already exists" })];
                        }
                        user = User_1.User.create({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            password: password,
                            role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
                        });
                        return [4 /*yield*/, (0, class_validator_1.validate)(user)];
                    case 3:
                        errors = _b.sent();
                        if (errors.length > 0) {
                            return [2 /*return*/, res.status(400).json({ errors: errors })];
                        }
                        return [4 /*yield*/, user.save()];
                    case 4:
                        _b.sent();
                        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                            expiresIn: "24h",
                        });
                        url = process.env.BACKEND_URL + "/user/activate-user/" + token;
                        emailClass = new email_1.default();
                        message = emailClass.constructWelcomeEmail(user.firstName, url, "Email Confirmation");
                        return [4 /*yield*/, emailClass.sendEmail(email, "Email Confirmation", message)];
                    case 5:
                        _b.sent();
                        userData = __assign({}, user);
                        delete userData.password;
                        return [2 /*return*/, res.status(201).json({ user: userData, access_token: token })];
                    case 6:
                        error_1 = _b.sent();
                        console.log(error_1);
                        return [2 /*return*/, res.status(500).json({
                                message: "Oops! Something went wrong. Try again later",
                                meta: error_1,
                            })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.activateEmail = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var token, decoded, id, user, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = req.params.token;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        decoded = jwt.verify(token, process.env.JWT_SECRET);
                        id = decoded.id;
                        if (!id) {
                            throw new Error("Invalid token");
                        }
                        return [4 /*yield*/, User_1.User.findOne(id)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("User does not exist. Register again");
                        }
                        return [4 /*yield*/, User_1.User.update(user.id, { accountEnabled: true })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.redirect(process.env.FRONTEND_URL)];
                    case 4:
                        error_2 = _a.sent();
                        throw new Error(error_2);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, user, validPassword, token, userData, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, User_1.User.findOne({ email: email })];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(400).json({ message: "Invalid email or password" })];
                        }
                        return [4 /*yield*/, bcrypt.compare(password, user.password)];
                    case 3:
                        validPassword = _b.sent();
                        if (!validPassword) {
                            return [2 /*return*/, res.status(400).json({ message: "Invalid email or password" })];
                        }
                        //Check if the email has been verified
                        if (!user.accountEnabled) {
                            return [2 /*return*/, res.status(400).json({ message: "Please verify your email" })];
                        }
                        token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
                            expiresIn: "7d",
                        });
                        //assign token to response header
                        res.header("Authorization", token);
                        userData = __assign({}, user);
                        delete userData.password;
                        return [2 /*return*/, res.status(200).json({
                                message: "Login successful",
                                user: userData,
                                refresh_token: token,
                            })];
                    case 4:
                        error_3 = _b.sent();
                        console.log(error_3);
                        return [2 /*return*/, res.status(500).json({
                                message: "Oops! Something went wrong. Try again later",
                                meta: error_3,
                            })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.getAllUsers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, userData_1, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (req.user.role !== "admin") {
                            return [2 /*return*/, res.status(403).json({
                                    message: "User does not have sufficient permission to access this route",
                                })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, User_1.User.findAndCount({
                                order: { createdAt: "ASC" },
                                cache: true,
                            })];
                    case 2:
                        user = _a.sent();
                        userData_1 = [];
                        user[0].map(function (u) {
                            delete u.password;
                            userData_1.push(u);
                        });
                        return [2 /*return*/, res.status(200).json({ users: userData_1, count: user[1] })];
                    case 3:
                        error_4 = _a.sent();
                        console.log(error_4);
                        return [2 /*return*/, res.status(500).json({
                                message: "Oops! Something went wrong. Try again later",
                                meta: error_4,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.currentUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_1.User.findOne({
                                where: { email: req.user.email },
                            })];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            user.password = "";
                            return [2 /*return*/, res.status(200).json({ user: user })];
                        }
                        return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                    case 2:
                        error_5 = _a.sent();
                        console.log(error_5);
                        return [2 /*return*/, res.status(500).json({
                                message: "Oops! Something went wrong. Try again later",
                                meta: error_5,
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.getOneUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (req.user.role !== "admin") {
                            return [2 /*return*/, res.status(403).json({
                                    message: "User does not have sufficient permission to access this route",
                                })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, User_1.User.findOne({ where: { id: id } })];
                    case 2:
                        user = _a.sent();
                        if (user) {
                            user.password = "";
                            return [2 /*return*/, res.status(200).json({ user: user })];
                        }
                        return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                    case 3:
                        error_6 = _a.sent();
                        console.log(error_6);
                        return [2 /*return*/, res.status(500).json({
                                message: "Oops! Something went wrong. Try again later",
                                meta: error_6,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, update, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.user.id;
                        if (req.body.hasOwnProperty("password")) {
                            return [2 /*return*/, res.status(403).json({
                                    message: "Password cannot be updated. Please remove password from payload",
                                })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, User_1.User.findOne({ where: { id: userId } })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                        }
                        if (user.imagekit_id) {
                            imagekit.deleteFile(user.imagekit_id, function (error, result) {
                                if (error)
                                    console.log(error);
                                else
                                    console.log(result);
                            });
                        }
                        return [4 /*yield*/, User_1.User.update(req.body, { id: userId })];
                    case 3:
                        update = _a.sent();
                        if (update) {
                            return [2 /*return*/, res.status(200).json({ message: "User updated successfully" })];
                        }
                        return [2 /*return*/, res.status(402).json({ message: "User update faailed" })];
                    case 4:
                        error_7 = _a.sent();
                        console.log(error_7);
                        console.log(error_7);
                        return [2 /*return*/, res.status(500).json({
                                message: "Oops! Something went wrong. Try again later",
                                meta: error_7,
                            })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.resetPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, newPassword, user, emailClass, message, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = req.body.email;
                        newPassword = "emeltexUser" + Math.random().toString().split(".")[1];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, User_1.User.findOne({ where: { email: email } })];
                    case 2:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 6];
                        user.password = newPassword;
                        return [4 /*yield*/, user.hashPassword()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.save()];
                    case 4:
                        _a.sent();
                        emailClass = new email_1.default();
                        message = "Your password has been reset. Your temporary password is <b>" + newPassword + "</b>. Make sure you change it once you login.";
                        return [4 /*yield*/, emailClass.sendEmail(email, "Password Reset", message)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: "Password reset successfully. Please check your email for your new password",
                            })];
                    case 6: return [2 /*return*/, res.status(402).json({ message: "Password reset failed" })];
                    case 7:
                        error_8 = _a.sent();
                        console.log(error_8);
                        return [2 /*return*/, res.status(500).json({
                                message: "Oops! Something went wrong. Try again later",
                                meta: error_8,
                            })];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.changePassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, oldPassword, newPassword, user, validPassword, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, User_1.User.findOne({
                                where: { email: req.user.email },
                            })];
                    case 2:
                        user = _b.sent();
                        if (!user) return [3 /*break*/, 7];
                        return [4 /*yield*/, bcrypt.compare(oldPassword, user.password)];
                    case 3:
                        validPassword = _b.sent();
                        if (!validPassword) return [3 /*break*/, 6];
                        user.password = newPassword;
                        return [4 /*yield*/, user.hashPassword()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, user.save()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, res
                                .status(200)
                                .json({ message: "Password changed successfully" })];
                    case 6: return [2 /*return*/, res.status(403).json({ message: "Old password is incorrect" })];
                    case 7: return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                    case 8:
                        error_9 = _b.sent();
                        console.log(error_9);
                        return [2 /*return*/, res.status(500).json({
                                message: "Oops! Something went wrong. Try again later",
                                meta: error_9,
                            })];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return UserController;
}());
exports.default = UserController;
//# sourceMappingURL=User.js.map