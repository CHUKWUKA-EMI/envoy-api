import { Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import Email from "../utilities/email";
import * as bcrypt from "bcryptjs";

class UserController {
  //create user
  async create(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      const user = User.create({
        firstName,
        lastName,
        email,
        password,
        role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
      });
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
      }

      await user.save();
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "24h",
      });
      const url = `${process.env.BACKEND_URL}/user/activate-user/${token}`;
      const emailClass = new Email();
      const message = emailClass.constructWelcomeEmail(
        user.firstName,
        url,
        "Email Confirmation"
      );
      await emailClass.sendEmail(email, "Email Confirmation", message);
      const userData = { ...user };
      delete (<any>userData).password;
      return res.status(201).json({ user: userData, access_token: token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async activateEmail(req: Request, res: Response) {
    const token = req.params.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const id = (<any>decoded).id;
      if (!id) {
        throw new Error("Invalid token");
      }
      const user = await User.findOne(id);
      if (!user) {
        throw new Error("User does not exist. Register again");
      }

      await User.update(user.id, { accountEnabled: true });
      return res.redirect(process.env.FRONTEND_URL!);
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      //validate email and password
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      //Check if the email has been verified
      if (!user.accountEnabled) {
        return res.status(400).json({ message: "Please verify your email" });
      }
      //generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );
      //assign token to response header
      res.header("Authorization", token);

      //remove password from response payload
      const userData = { ...user };
      delete (<any>userData).password;

      return res.status(200).json({
        message: "Login successful",
        user: userData,
        refresh_token: token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "User does not have sufficient permission to access this route",
      });
    }
    try {
      const user = await User.findAndCount({
        order: { createdAt: "ASC" },
        cache: true,
      });
      const userData: User[] = [];

      user[0].map((u) => {
        delete (<any>u).password;
        userData.push(u);
      });
      return res.status(200).json({ users: userData, count: user[1] });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async currentUser(req: Request, res: Response) {
    try {
      const user = await User.findOne({
        where: { email: (<any>req).user.email },
      });
      if (user) {
        user.password = "";
        return res.status(200).json({ user: user });
      }
      return res.status(404).json({ message: "User not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async getOneUser(req: Request, res: Response) {
    const { id } = req.params;
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "User does not have sufficient permission to access this route",
      });
    }

    try {
      const user = await User.findOne({ where: { id } });
      if (user) {
        user.password = "";
        return res.status(200).json({ user: user });
      }

      return res.status(404).json({ message: "User not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    const userId = (<any>req).user.id;
    if (req.body.hasOwnProperty("password")) {
      return res.status(403).json({
        message:
          "Password cannot be updated. Please remove password from payload",
      });
    }

    try {
      const update = await User.update(req.body, { id: userId });
      if (update) {
        return res.status(200).json({ message: "User updated successfully" });
      }

      return res.status(402).json({ message: "User update faailed" });
    } catch (error) {
      console.log(error);
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { email } = req.body;
    const newPassword = "emeltexUser" + Math.random().toString().split(".")[1];
    try {
      const user = await User.findOne({ where: { email: email } });
      if (user) {
        user.password = newPassword;
        await user.hashPassword();
        await user.save();
        const emailClass = new Email();
        const message = `Your password has been reset. Your temporary password is <b>${newPassword}</b>. Make sure you change it once you login.`;
        await emailClass.sendEmail(email, "Password Reset", message);
        return res.status(200).json({
          message:
            "Password reset successfully. Please check your email for your new password",
        });
      }
      return res.status(402).json({ message: "Password reset failed" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await User.findOne({
        where: { email: (<any>req).user.email },
      });
      if (user) {
        //compare passwords
        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (validPassword) {
          user.password = newPassword;
          await user.hashPassword();
          await user.save();
          return res
            .status(200)
            .json({ message: "Password changed successfully" });
        }
        return res.status(403).json({ message: "Old password is incorrect" });
      }

      return res.status(404).json({ message: "User not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }
}

export default UserController;
