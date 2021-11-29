import { createServer } from "http";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { RedisClient } from "redis";
const ImageKit = require("imagekit");
import config from "../ormconfig";
import userRoutes from "./routes/user";
import conversationRoutes from "./routes/conversation";
import chatRoutes from "./routes/chat";
import authentication from "./middlewares/authenticate";
import { IChatUser } from "./interfaces/ChatUser";
import { User } from "./entity/User";
import { IChat } from "./interfaces/chat";

dotenv.config();

const pubClient = new RedisClient({
  url: process.env.REDIS_URL,
  retry_strategy: (times: any) => Math.min(times * 50, 2000),
});
const subClient = pubClient.duplicate();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

io.adapter(createAdapter(pubClient, subClient));

//Imagekit config
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

createConnection(config)
  .then(async (connection) => {
    console.log(`DB Connection established: ${connection.name}`);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false, limit: "50mb" }));
    app.use(cors());

    const port = process.env.PORT || 5000;

    //auth middleware
    app.use(authentication);

    //routes
    app.use("/api/v1/user", userRoutes);
    app.use("/api/v1/conversation", conversationRoutes);
    app.use("/api/v1/chat", chatRoutes);

    //Imagekit auth endpoint
    app.get("/imagekitAuth", (_, res) => {
      const result = imagekit.getAuthenticationParameters();
      return res.json(result);
    });

    ///[START] Live chat section
    let users: IChatUser[] = Array<IChatUser>();
    const addUser = (userId: string, socketId: string, isOnline: boolean) => {
      !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId, isOnline });
    };

    const disconnectUser = (socketId: string) => {
      users = users.map((user: IChatUser) => {
        if (user.socketId === socketId) {
          user.isOnline = false;
        }
        return user;
      });
    };

    const getUser = (userId: string) => {
      return users.find((user) => user.userId === userId);
    };
    io.on("connection", (socket) => {
      console.log("a user connected", socket.id);
      //take userId and socketId from user
      socket.on("addUser", async ({ userId }) => {
        console.log("userId", userId);
        await User.update({ isOnline: true }, { id: userId });
        addUser(userId, socket.id, true);
        io.emit("getUsers", users);
      });

      //send and get message
      socket.on("sendMessage", (data: IChat) => {
        const receiver = getUser(data.receiverId)!;
        io.to(receiver.socketId).emit("getMessage", data);
      });

      //when a user disconnects
      socket.on("disconnect", () => {
        console.log("a user disconnected!");
        const user = users.find((u) => u.socketId === socket.id);
        if (user && user.userId) {
          // User.update({ isOnline: false }, { id: user?.userId });
          disconnectUser(socket.id);
          io.emit("getUsers", users);
        }
      });
    });
    /// [END] Live chat section

    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
      try {
        pubClient.PING((err, resply) => {
          if (err) {
            console.log(err);
          } else {
            console.log("redis-server response:", resply);
          }
        });
      } catch (e) {
        console.log(e);
      }
    });
  })
  .catch((error) => console.log(error));
