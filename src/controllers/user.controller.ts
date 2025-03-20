import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "../../prisma/generated.client";

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { email, password, username } = req.body;
      await prisma.user.create({ data: { email, password, username } });

      res.status(201).send({ message: "User created successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const filter: Prisma.UserWhereInput = {};
      if (search) {
        filter.username = { contains: search as string };
      }
      const users = await prisma.user.findMany({
        where: filter,
        orderBy: { id: "asc" },
      });

      const stats = await prisma.user.aggregate({
        _count: { username: true },
        _max: { createdAt: true },
        _min: { createdAt: true },
      });
      res
        .status(200)
        .send({ message: "Users fetched successfully", users, stats });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      res.status(200).send({ message: "User fetched successfully", user });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).send({ message: "User deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: Prisma.UserUpdateInput = req.body;
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data,
      });
      res.status(200).send({ message: "User updated successfully", user });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getUserPosts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const posts = await prisma.post.findMany({
        include: { user: true },
        where: {
          userId: Number(id),
        },
      });

      const stats = { totalPosts: posts.length };

      res.status(200).send({
        message: "Posts fetched successfully",
        posts,
        stats,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
