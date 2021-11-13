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

export class Conversations {
  async create(req: Request, res: Response) {
    const { friendId } = req.body;
    const userId = (<any>req).user.id;
    if (!friendId) {
      return res.status(400).json({
        message: "Friend ID is required",
      });
    }
    try {
      const conversationId = uuid();
      const timestamp = new Date().toISOString();
      const newItem = {
        id: conversationId,
        members: [userId, friendId],
        createdAt: timestamp,
      };
      await dynamoDB
        .put({
          TableName: "conversations",
          Item: newItem,
        })
        .promise();

      return res.status(201).json({
        message: "Conversation created",
        item: newItem,
      });
    } catch (error) {
      console.log("error creating conversation: ", error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Conversation ID is required",
      });
    }

    try {
      const converation = await dynamoDB
        .get({
          TableName: "conversations",
          Key: {
            id,
          },
        })
        .promise();

      if (!converation.Item) {
        return res.status(404).json({
          message: "Conversation not found",
        });
      }

      return res.status(200).json({
        message: "Conversation found",
        item: converation.Item,
      });
    } catch (error) {
      console.log("error finding conversation: ", error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  async findAll(_: Request, res: Response) {
    try {
      const conversations = await dynamoDB
        .scan({
          TableName: "conversations",
        })
        .promise();

      if (conversations.Count == 0) {
        return res.status(404).json({
          message: "Conversations not found",
        });
      }

      return res.status(200).json({
        message: "Conversations found",
        items: conversations.Items,
      });
    } catch (error) {
      console.log("error finding conversations: ", error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  async deleteConversation(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Conversation ID is required",
      });
    }

    try {
      const converation = await dynamoDB
        .get({
          TableName: "conversations",
          Key: {
            id,
          },
        })
        .promise();

      if (!converation.Item) {
        return res.status(404).json({
          message: "Conversation not found",
        });
      }

      await dynamoDB
        .delete({
          TableName: "conversations",
          Key: {
            id,
          },
        })
        .promise();

      return res.status(200).json({
        message: "Conversation deleted",
      });
    } catch (error) {
      console.log("error deleting conversation: ", error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
}
