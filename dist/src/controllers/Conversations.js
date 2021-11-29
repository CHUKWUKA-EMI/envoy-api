"use strict";
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
exports.Conversations = void 0;
var AWS = require("aws-sdk");
var uuid_1 = require("uuid");
AWS.config.update({
    region: "us-east-1",
    credentials: new AWS.Credentials({
        accessKeyId: process.env.aws_access_key_id,
        secretAccessKey: process.env.aws_secret_access_key,
    }),
});
var dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1",
});
var Conversations = /** @class */ (function () {
    function Conversations() {
    }
    Conversations.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var friendId, userId, conversationId, timestamp, newItem, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        friendId = req.body.friendId;
                        userId = req.user.id;
                        if (!friendId) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Friend ID is required",
                                })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        conversationId = (0, uuid_1.v4)();
                        timestamp = new Date().toISOString();
                        newItem = {
                            id: conversationId,
                            members: [userId, friendId],
                            createdAt: timestamp,
                        };
                        return [4 /*yield*/, dynamoDB
                                .put({
                                TableName: "conversations",
                                Item: newItem,
                            })
                                .promise()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(201).json({
                                message: "Conversation created",
                                item: newItem,
                            })];
                    case 3:
                        error_1 = _a.sent();
                        console.log("error creating conversation: ", error_1);
                        return [2 /*return*/, res.status(500).json({
                                message: "Something went wrong",
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.prototype.findOne = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, converation, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Conversation ID is required",
                                })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dynamoDB
                                .get({
                                TableName: "conversations",
                                Key: {
                                    id: id,
                                },
                            })
                                .promise()];
                    case 2:
                        converation = _a.sent();
                        if (!converation.Item) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "Conversation not found",
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                message: "Conversation found",
                                item: converation.Item,
                            })];
                    case 3:
                        error_2 = _a.sent();
                        console.log("error finding conversation: ", error_2);
                        return [2 /*return*/, res.status(500).json({
                                message: "Something went wrong",
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.prototype.findAll = function (_, res) {
        return __awaiter(this, void 0, void 0, function () {
            var conversations, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dynamoDB
                                .scan({
                                TableName: "conversations",
                            })
                                .promise()];
                    case 1:
                        conversations = _a.sent();
                        if (conversations.Count == 0) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "Conversations not found",
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                message: "Conversations found",
                                items: conversations.Items,
                            })];
                    case 2:
                        error_3 = _a.sent();
                        console.log("error finding conversations: ", error_3);
                        return [2 /*return*/, res.status(500).json({
                                message: "Something went wrong",
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Conversations.prototype.deleteConversation = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, converation, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Conversation ID is required",
                                })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, dynamoDB
                                .get({
                                TableName: "conversations",
                                Key: {
                                    id: id,
                                },
                            })
                                .promise()];
                    case 2:
                        converation = _a.sent();
                        if (!converation.Item) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "Conversation not found",
                                })];
                        }
                        return [4 /*yield*/, dynamoDB
                                .delete({
                                TableName: "conversations",
                                Key: {
                                    id: id,
                                },
                            })
                                .promise()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: "Conversation deleted",
                            })];
                    case 4:
                        error_4 = _a.sent();
                        console.log("error deleting conversation: ", error_4);
                        return [2 /*return*/, res.status(500).json({
                                message: "Something went wrong",
                            })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Conversations;
}());
exports.Conversations = Conversations;
//# sourceMappingURL=Conversations.js.map