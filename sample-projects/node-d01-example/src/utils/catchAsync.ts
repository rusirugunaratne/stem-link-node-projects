import type { Request, Response, NextFunction } from "express";

// This higher-order function interceptor catches errors from promises and passes them to next()
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
