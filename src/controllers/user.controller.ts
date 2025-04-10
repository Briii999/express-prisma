import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "../../prisma/generated.client";

export class UserController {


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
      const data: Prisma.UserUpdateInput = req.body;
      const user = await prisma.user.update({
        where: { id: req.user?.id },
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
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
        include: { Post: true },
      });

      res.status(200).send({ user });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
