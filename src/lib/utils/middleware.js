import errors from "http-errors";
import  { NextApiRequest, NextApiResponse } from "next";

 Handler = (NextApiRequest,  NextApiResponse) ;

// common middleware for all api routes
export default function middleware(handler) {
  return async (req, res) => {
    return handler(req, res).catch((error) => {
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
