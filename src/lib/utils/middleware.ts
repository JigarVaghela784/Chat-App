import errors from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

// common middleware for all api routes
export default function middleware(handler: Handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    return handler(req, res).catch((error: Error) => {
      if (errors.isHttpError(error)) {
        return res.status(error.statusCode).send({
          message: error.message,
        });
      }

      // catch default errors
      return res.status(500).send({
        message: "Internal Server Error",
        description: error?.message,
      });
    });
  };
}
