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
var http_1 = require("http");
var express = require("express");
var cors = require("cors");
var dotenv = require("dotenv");
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var socket_io_1 = require("socket.io");
var redis_adapter_1 = require("@socket.io/redis-adapter");
var redis_1 = require("redis");
var ImageKit = require("imagekit");
var ormconfig_1 = require("../ormconfig");
var user_1 = require("./routes/user");
var conversation_1 = require("./routes/conversation");
var chat_1 = require("./routes/chat");
var authenticate_1 = require("./middlewares/authenticate");
dotenv.config();
var pubClient = new redis_1.RedisClient({
    url: process.env.REDIS_URL,
    retry_strategy: function (times) { return Math.min(times * 50, 2000); },
});
var subClient = pubClient.duplicate();
var app = express();
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    },
});
io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
//Imagekit config
var imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
(0, typeorm_1.createConnection)(ormconfig_1.default)
    .then(function (connection) { return __awaiter(void 0, void 0, void 0, function () {
    var port, users, addUser, removeUser, getUser;
    return __generator(this, function (_a) {
        console.log("DB Connection established: " + connection.name);
        app.use(express.json());
        app.use(express.urlencoded({ extended: false, limit: "50mb" }));
        app.use(cors());
        port = process.env.PORT || 5000;
        //auth middleware
        app.use(authenticate_1.default);
        //routes
        app.use("/api/v1/user", user_1.default);
        app.use("/api/v1/conversation", conversation_1.default);
        app.use("/api/v1/chat", chat_1.default);
        //Imagekit auth endpoint
        app.get("/imagekitAuth", function (_, res) {
            var result = imagekit.getAuthenticationParameters();
            return res.json(result);
        });
        users = Array();
        addUser = function (userId, socketId) {
            !users.some(function (user) { return user.userId === userId; }) &&
                users.push({ userId: userId, socketId: socketId });
        };
        removeUser = function (socketId) {
            users = users.filter(function (user) { return user.socketId !== socketId; });
        };
        getUser = function (userId) {
            return users.find(function (user) { return user.userId === userId; });
        };
        io.on("connection", function (socket) {
            console.log("a user connected", socket.id);
            //take userId and socketId from user
            socket.on("addUser", function (user) {
                addUser(user.userId, socket.id);
                io.emit("getUsers", users);
            });
            //send and get message
            socket.on("sendMessage", function (_a) {
                var senderId = _a.senderId, receiverId = _a.receiverId, message = _a.message, imageUrl = _a.imageUrl;
                var receiver = getUser(receiverId);
                io.to(receiver.socketId).emit("getMessage", {
                    senderId: senderId,
                    message: message,
                    imageUrl: imageUrl,
                });
            });
            //when a user disconnects
            socket.on("disconnect", function () {
                console.log("a user disconnected!");
                removeUser(socket.id);
                io.emit("getUsers", users);
            });
        });
        /// [END] Live chat section
        server.listen(port, function () {
            console.log("Server started on port " + port);
            try {
                pubClient.PING(function (err, resply) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("redis-server response:", resply);
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
        return [2 /*return*/];
    });
}); })
    .catch(function (error) { return console.log(error); });
//# sourceMappingURL=server.js.map