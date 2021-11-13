import { Request, Response } from "express";
import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";

AWS.config.update({
  region: "us-east-1",
  credentials: new AWS.Credentials({
    accessKeyId: process.env.aws_access_key_id!,
    secretAccessKey: process.env.aws_secret_access_key!,
  }),
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
});

export class Chat {
  async create(req: Request, res: Response) {
    const { receiverId, conversationId, message, imageUrl } = req.body;
    const senderId = (<any>req).user.id;
    if (!receiverId || !conversationId) {
      return res.status(400).json({
        message: "Receiver ID or conversation ID is missing",
      });
    }
    if (!message && !imageUrl) {
      return res.status(400).json({
        message: "Chat cannot be empty",
      });
    }

    if (receiverId == senderId) {
      return res
        .status(400)
        .json({ message: "You can't send message to yourself" });
    }
    try {
      const conversation = await dynamoDB
        .get({
          TableName: "conversations",
          Key: {
            id: conversationId,
          },
        })
        .promise();

      if (!conversation.Item) {
        return res.status(404).json({
          message: "Conversation not found",
        });
      }

      const chat = {
        chatId: uuid(),
        senderId,
        receiverId,
        conversationId,
        message,
        imageUrl: imageUrl || "",
        createdAt: new Date().toISOString(),
      };

      await dynamoDB
        .put({
          TableName: "chats",
          Item: chat,
        })
        .promise();

      return res.status(200).json({
        message: "Chat created",
        item: chat,
      });
    } catch (error) {
      console.log("error creating chat: ", error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  async updateChat(req: Request, res: Response) {
    const { chatId } = req.params;
    const { conversationId, message, imageUrl } = req.body;
    if (!conversationId || !chatId) {
      return res.status(400).json({
        message: "Conversation ID and chat ID are required",
      });
    }

    if (!message && !imageUrl) {
      return res.status(400).json({
        message: "Chat cannot be empty",
      });
    }

    try {
      const chat = await dynamoDB
        .get({
          TableName: "chats",
          Key: {
            conversationId,
            chatId,
          },
        })
        .promise();

      if (!chat.Item) {
        return res.status(404).json({
          message: "Chat not found",
        });
      }

      const updatedChat = {
        ...chat.Item,
        ...req.body,
      };

      await dynamoDB
        .update({
          TableName: "chats",
          Key: {
            conversationId,
            chatId,
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
        .promise();

      return res.status(200).json({
        message: "Chat updated",
        item: updatedChat,
      });
    } catch (error) {
      console.log("error updating chat: ", error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  async findAllByConversationId(req: Request, res: Response) {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({
        message: "Conversation ID is required",
      });
    }

    try {
      const chats = await dynamoDB
        .query({
          TableName: "chats",
          KeyConditionExpression: "conversationId = :conversationId",
          ExpressionAttributeValues: {
            ":conversationId": conversationId,
          },
        })
        .promise();

      if (chats.Count == 0) {
        return res.status(404).json({
          message: "Chats not found",
        });
      }

      return res.status(200).json({
        message: "Chats found",
        chats: chats.Items,
      });
    } catch (error) {
      console.log("error finding chats: ", error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  async deleteChat(req: Request, res: Response) {
    const { chatId } = req.params;
    const { conversationId } = req.body;
    if (!conversationId || !chatId) {
      return res.status(400).json({
        message: "Conversation ID and chat ID are required",
      });
    }

    try {
      const chat = await dynamoDB
        .get({
          TableName: "chats",
          Key: {
            conversationId,
            chatId,
          },
        })
        .promise();

      if (!chat.Item) {
        return res.status(404).json({
          message: "Chat not found",
        });
      }

      await dynamoDB
        .delete({
          TableName: "chats",
          Key: {
            conversationId,
            chatId,
          },
        })
        .promise();

      return res.status(200).json({
        message: "Chat deleted",
      });
    } catch (error) {
      console.log("error deleting conversation: ", error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
}
