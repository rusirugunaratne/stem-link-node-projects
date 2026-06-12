import type { Request, Response, NextFunction } from "express";

export const catchAsync = (
  fn: (req: any, res: any, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
