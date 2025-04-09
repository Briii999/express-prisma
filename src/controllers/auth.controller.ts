import { Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, username, fullname } = req.body;
      const salt = await genSalt(10);
      const hashedPass = await hash(password, salt);

      await prisma.user.create({
        data: { email, password: hashedPass, username, fullname },
      });

      res.status(201).send({ message: "User created successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email: email } });
      if (!user) throw { message: "User not found" };

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) throw { message: "Password incorrect" };

      const payload = { id: user.id, role: "user" };
      const access_token = sign(payload, process.env.KEY_JWT!, {
        expiresIn: "1h",
      });

      res.status(200).send({
        message: "Logged in successfully",
        data: user,
        access_token,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
