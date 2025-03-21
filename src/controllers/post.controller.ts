import { Request, Response } from "express";
import prisma from "../prisma";

export class PostController {
  async getPost(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany({
        // include: { user: true },
        select: {
          id: true,
          imageUrl: true,
          caption: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              email: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
      res.status(200).send({ message: "Posts fetched successfully", posts });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const { imageUrl, caption, userId } = req.body;
      await prisma.post.create({ data: { imageUrl, caption, userId } });

      res.status(201).send({ message: "Post created successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.post.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).send({ message: "Post deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
