import express, { Request, Response } from "express";

const configRoutes = express.Router();

configRoutes
  .route("/paypal")
  .get((req: Request, res: Response) =>
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
  );

export default configRoutes;
