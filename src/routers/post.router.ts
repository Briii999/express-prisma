import { Router } from "express";
import { uploader } from "../helpers/uploader";
import { PostController } from "../controllers/post.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class PostRouter {
  private router: Router;
  private postController: PostController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.postController = new PostController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get("/", this.postController.getPost);
    this.router.post(
      "/",
      uploader("diskStorage", "ig-").single("image"),
      this.authMiddleware.verifyToken,
      this.postController.createPost
    );

    this.router.delete("/:id", this.postController.deletePost);
  }

  getRouter(): Router {
    return this.router;
  }
}
