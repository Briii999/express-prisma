import "express";

export type UserPayLoad = {
  id: number;
  role: "admin" | "user";
};

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayLoad;
    }
  }
}
