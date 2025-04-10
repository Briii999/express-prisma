import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRegister } from "../middleware/validation";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", validateRegister, this.authController.register);
    this.router.post("/login", this.authController.login);

    this.router.patch(
      "/verify",
      this.authMiddleware.verifyToken,
      this.authController.verify
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
