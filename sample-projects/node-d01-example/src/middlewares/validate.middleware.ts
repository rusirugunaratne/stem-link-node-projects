// src/middlewares/validate.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { ZodTypeAny } from "zod";

export const validate = (schema: ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Validate the request body, query params, or path params using our schema
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            // Everything looks pristine! Move safely to the controller
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Map the array of errors cleanly for client comprehension
                const errorMessages = error.issues.map((err: any) => ({
                    field: err.path.join(".").replace("body.", ""), // Cleans up path names like "body.title" to just "title"
                    message: err.message,
                }));

                res.status(400).json({
                    success: false,
                    message: "Validation Failed",
                    errors: errorMessages,
                });
                return;
            }

            res.status(500).json({ success: false, message: "Internal server validation error" });
        }
    };
};
