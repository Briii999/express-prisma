import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.authController.register);
    this.router.post("/login", this.authController.login);
  }

  getRouter(): Router {
    return this.router;
  }
}
