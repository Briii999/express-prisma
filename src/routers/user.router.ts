import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class UserRouter {
  private router: Router;
  private userController: UserController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.userController.getUsers
    );
    this.router.get(
      "/post",
      this.authMiddleware.verifyToken,
      this.userController.getUserPosts
    );
    this.router.patch(
      "/",
      this.authMiddleware.verifyToken,
      this.userController.updateUser
    );

    this.router.get("/:id", this.userController.getUserById);
    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      this.authMiddleware.verifyAdmin,
      this.userController.deleteUser
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
