import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";

declare global {
  namespace Express {
    interface Request {
      validated: {
        body: any;
        query: any;
        params: any;
      };
    }
  }
}

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as any;

      req.validated = {
        body: parsed.body,
        query: parsed.query,
        params: parsed.params,
      };

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: any) => ({
          field: err.path.join(".").replace("body.", "").replace("query.", "").replace("params.", ""),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: errorMessages,
        });
        return;
      }

      next(error); // Passing to error handler
    }
  };
};
