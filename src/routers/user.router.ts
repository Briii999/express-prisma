import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get("/", this.userController.getUsers);
    this.router.post("/", this.userController.createUser);

    this.router.get("/:id", this.userController.getUserById);
    this.router.get("/:id/posts", this.userController.getUserPosts);
    this.router.delete("/:id", this.userController.deleteUser);
    this.router.patch("/:id", this.userController.updateUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
