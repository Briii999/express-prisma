import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../helpers/cloudinary";

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
        orderBy: { createdAt: "desc" },
      });
      res.status(200).send({ message: "Posts fetched successfully", posts });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "Image empty" };
      const { caption } = req.body;
      const imageUrl = `http://localhost:8000/api/public/${req.file.filename}`;

      await prisma.post.create({
        data: { imageUrl, caption, userId: req.user?.id! },
      });

      res.status(201).send({
        message: "Post created successfully",
        data: req.file,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createPostCloud(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "image empty" };
      const { caption } = req.body;
      const { secure_url } = await cloudinaryUpload(req.file, "ig");

      await prisma.post.create({
        data: { imageUrl: secure_url, caption, userId: req.user?.id! },
      });

      res.status(201).send({
        message: "Post created",
        secure_url,
      });
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

  async likePost(req: Request, res: Response) {
    try {
      const { postId } = req.body;

      const isLike = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId,
            userId: req.user?.id!,
          },
        },
      });

      if (isLike) {
        await prisma.like.delete({
          where: {
            postId_userId: {
              postId,
              userId: req.user?.id!,
            },
          },
        });
        res.status(200).send({ liked: false });
      } else {
        await prisma.like.create({
          data: {
            postId,
            userId: req.user?.id!,
          },
        });
        res.status(200).send({ liked: true });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
