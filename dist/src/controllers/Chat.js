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
exports.Chat = void 0;
var AWS = require("aws-sdk");
var uuid_1 = require("uuid");
var ImageKit = require("imagekit");
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
//Imagekit config
var imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
var Chat = /** @class */ (function () {
    function Chat() {
    }
    Chat.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, receiverId, conversationId, message, imageUrl, imagekit_id, viewed, senderId, conversation, chat, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, receiverId = _a.receiverId, conversationId = _a.conversationId, message = _a.message, imageUrl = _a.imageUrl, imagekit_id = _a.imagekit_id, viewed = _a.viewed;
                        senderId = req.user.id;
                        if (!receiverId || !conversationId) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Receiver ID or conversation ID is missing",
                                })];
                        }
                        if (!message && !imageUrl) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Chat cannot be empty",
                                })];
                        }
                        if (receiverId == senderId) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ message: "You can't send message to yourself" })];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, dynamoDB
                                .get({
                                TableName: "conversations",
                                Key: {
                                    id: conversationId,
                                },
                            })
                                .promise()];
                    case 2:
                        conversation = _b.sent();
                        if (!conversation.Item) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "Conversation not found",
                                })];
                        }
                        chat = {
                            chatId: (0, uuid_1.v4)(),
                            senderId: senderId,
                            receiverId: receiverId,
                            conversationId: conversationId,
                            message: message,
                            viewed: viewed ? viewed : false,
                            imageUrl: imageUrl || "",
                            imagekit_id: imagekit_id || "",
                            createdAt: new Date().toISOString(),
                        };
                        return [4 /*yield*/, dynamoDB
                                .put({
                                TableName: "chats",
                                Item: chat,
                            })
                                .promise()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: "Chat created",
                                item: chat,
                            })];
                    case 4:
                        error_1 = _b.sent();
                        console.log("error creating chat: ", error_1);
                        return [2 /*return*/, res.status(500).json({
                                message: "Something went wrong",
                            })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Chat.prototype.updateChat = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var chatId, _a, conversationId, message, imageUrl, chat, updatedChat, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        chatId = req.params.chatId;
                        _a = req.body, conversationId = _a.conversationId, message = _a.message, imageUrl = _a.imageUrl;
                        if (!conversationId || !chatId) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Conversation ID and chat ID are required",
                                })];
                        }
                        if (!message && !imageUrl) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Chat cannot be empty",
                                })];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, dynamoDB
                                .get({
                                TableName: "chats",
                                Key: {
                                    conversationId: conversationId,
                                    chatId: chatId,
                                },
                            })
                                .promise()];
                    case 2:
                        chat = _b.sent();
                        if (!chat.Item) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "Chat not found",
                                })];
                        }
                        updatedChat = __assign(__assign({}, chat.Item), req.body);
                        return [4 /*yield*/, dynamoDB
                                .update({
                                TableName: "chats",
                                Key: {
                                    conversationId: conversationId,
                                    chatId: chatId,
                                },
                                UpdateExpression: "set #message = :message, #imageUrl = :imageUrl",
                                ExpressionAttributeNames: {
                                    "#message": "message",
                                    "#imageUrl": "imageUrl",
                                },
                                ExpressionAttributeValues: {
                                    ":message": message,
                                    ":imageUrl": imageUrl,
                                },
                                ReturnValues: "UPDATED_NEW",
                            })
                                .promise()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: "Chat updated",
                                item: updatedChat,
                            })];
                    case 4:
                        error_2 = _b.sent();
                        console.log("error updating chat: ", error_2);
                        return [2 /*return*/, res.status(500).json({
                                message: "Something went wrong",
                            })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Chat.prototype.findAllByConversationId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var conversationId, chats, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conversationId = req.params.conversationId;
                        if (!conversationId) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Conversation ID is required",
                                })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dynamoDB
                                .query({
                                TableName: "chats",
                                KeyConditionExpression: "conversationId = :conversationId",
                                ExpressionAttributeValues: {
                                    ":conversationId": conversationId,
                                },
                            })
                                .promise()];
                    case 2:
                        chats = _a.sent();
                        if (chats.Count == 0) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "Chats not found",
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                message: "Chats found",
                                chats: chats.Items,
                            })];
                    case 3:
                        error_3 = _a.sent();
                        console.log("error finding chats: ", error_3);
                        return [2 /*return*/, res.status(500).json({
                                message: "Something went wrong",
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Chat.prototype.deleteChat = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var chatId, conversationId, chat, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chatId = req.params.chatId;
                        conversationId = req.body.conversationId;
                        if (!conversationId || !chatId) {
                            return [2 /*return*/, res.status(400).json({
                                    message: "Conversation ID and chat ID are required",
                                })];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, dynamoDB
                                .get({
                                TableName: "chats",
                                Key: {
                                    conversationId: conversationId,
                                    chatId: chatId,
                                },
                            })
                                .promise()];
                    case 2:
                        chat = _a.sent();
                        if (!chat.Item) {
                            return [2 /*return*/, res.status(404).json({
                                    message: "Chat not found",
                                })];
                        }
                        if (chat.Item.imagekit_id) {
                            imagekit.deleteFile(chat.Item.imagekit_id, function (error, result) {
                                if (error)
                                    console.log(error);
                                else
                                    console.log(result);
                            });
                        }
                        return [4 /*yield*/, dynamoDB
                                .delete({
                                TableName: "chats",
                                Key: {
                                    conversationId: conversationId,
                                    chatId: chatId,
                                },
                            })
                                .promise()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: "Chat deleted",
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
    return Chat;
}());
exports.Chat = Chat;
//# sourceMappingURL=Chat.js.map