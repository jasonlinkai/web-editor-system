import { Application, Request, Router } from "express";
import ServerDatabase from "../database";
import {
  RequestWithAuth,
  PostPageBody,
  PutPageBody,
  DeletePageBody,
} from "../typing";

type PageGetRequest = RequestWithAuth;
type PagePostRequest = RequestWithAuth<Request<{}, {}, PostPageBody>>;
type PageDeleteRequest = RequestWithAuth<Request<{}, {}, DeletePageBody>>;
type PagePutRequest = RequestWithAuth<Request<{}, {}, PutPageBody>>;

const registerPageRouter = (
  app: Application,
  serverDatabase: ServerDatabase
) => {
  const router = Router();
  router.get("/pages", async (req: PageGetRequest, res) => {
    try {
      const pages = await serverDatabase.pageRepository.findAll({
        where: {
          userId: req.auth?.user.id,
        },
      });
      return res.send({
        code: 0,
        message: "success",
        data: pages,
      });
    } catch (e) {
      return res.status(400).send({
        code: 400,
        message: (e as Error).message,
      });
    }
  });
  router.post("/page", async (req: PagePostRequest, res) => {
    try {
      const uuid = req.body.uuid;
      const title = req.body.title;
      const ast = JSON.stringify(req.body.ast);
      await serverDatabase.pageRepository.create({
        uuid,
        title,
        ast,
        userId: req.auth?.user.id,
      });
      return res.send({
        code: 0,
        message: "success",
        data: true,
      });
    } catch (e) {
      return res.status(400).send({
        code: 400,
        message: (e as Error).message,
      });
    }
  });
  router.put("/page", async (req: PagePutRequest, res) => {
    try {
      const page = await serverDatabase.pageRepository.findOne({
        where: {
          id: req.body.id,
        },
      });
      if (page) {
        const ast = JSON.stringify(req.body.ast);
        page.update({
          title: req.body.title,
          ast,
        });
        return res.send({
          code: 0,
          message: "success",
          data: true,
        });
      } else {
        return res.status(404).send({
          code: 404,
          message: "Page isn't founded",
        });
      }
    } catch (e) {
      return res.status(400).send({
        code: 400,
        message: (e as Error).message,
      });
    }
  });
  router.delete("/page", async (req: PageDeleteRequest, res) => {
    try {
      await serverDatabase.pageRepository.destroy({
        where: {
          id: req.body.id,
          userId: req.auth?.user.id,
        },
      });
      return res.send({
        code: 0,
        message: "success",
        data: true,
      });
    } catch (e) {
      return res.status(400).send({
        code: 400,
        message: (e as Error).message,
      });
    }
  });
  app.use(router);
};

export default registerPageRouter;
