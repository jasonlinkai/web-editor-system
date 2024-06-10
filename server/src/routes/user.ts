import { Router } from "express";
import { RequestWithAuth } from "../typing";

const registerUserRouter = () => {
  const router = Router();
  router.get("/user", async (req: RequestWithAuth, res) => {
    try {
      return res.send({
        code: 0,
        message: "success",
        data: req.auth?.user,
      });
    } catch (e) {
      return res.status(400).send({
        code: 400,
        message: (e as Error).message,
      });
    }
  });
  return router;
};

export default registerUserRouter;
