import { Router } from "express";
import ServerDatabase from "../database";
import {
  RequestWithAuth,
} from "../typing";

const registerUploadRouter = (
  serverDatabase: ServerDatabase
) => {
  const router = Router();
  router.get("/images", async (req: RequestWithAuth, res) => {
    try {
      const images = await serverDatabase.imageRepository.findAll({
        where: {
          userId: req.auth?.user.id,
        },
      });
      return res.send({
        code: 0,
        message: "success",
        data: images,
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

export default registerUploadRouter;
