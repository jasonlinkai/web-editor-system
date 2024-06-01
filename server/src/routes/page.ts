import { Application, Request, Router } from "express";
import ServerDatabase from "../database";
import type { RequestWithAuth } from "../typing";
import type {
  PostPageRequestBody,
  PutPageRequestBody,
  DeletePageRequestBody,
} from "../../http-types";

type PageGetRequest = RequestWithAuth;
type PagePostRequest = RequestWithAuth<Request<{}, {}, PostPageRequestBody>>;
type PageDeleteRequest = RequestWithAuth<
  Request<{}, {}, DeletePageRequestBody>
>;
type PagePutRequest = RequestWithAuth<Request<{}, {}, PutPageRequestBody>>;

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
        include: [{
          model: serverDatabase.metaRepository,
          as: "meta",
        }],
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
      serverDatabase.sequelize.transaction(async (t) => {
        const uuid = req.body.uuid;
        const title = req.body.title;
        const ast = JSON.stringify(req.body.ast);
        const page = await serverDatabase.pageRepository.create(
          {
            uuid,
            title,
            ast,
            userId: req.auth?.user.id,
          },
          { transaction: t }
        );
        const meta = await serverDatabase.metaRepository.create(
          {
            pageId: page.id,
            description: "",
            keywords: "",
            author: "",
            theme: "",
            ogTitle: "",
            ogType: "",
            ogImage: "",
            ogUrl: "",
            ogDescription: "",
            twitterCard: "",
            twitterTitle: "",
            twitterDescription: "",
            twitterImage: "",
            canonical: "",
          },
          { transaction: t }
        );
        return res.send({
          code: 0,
          message: "success",
          data: {
            ...page.dataValues,
            meta,
          },
        });
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
      serverDatabase.sequelize.transaction(async (t) => {
        const page = await serverDatabase.pageRepository.findOne({
          where: {
            id: req.body.id,
          },
        });
        if (!page) throw new Error("Page isn't founded");
        const meta = await serverDatabase.metaRepository.findOne({
          where: {
            pageId: page.id,
          },
        });
        if (!meta) throw new Error("Meta isn't founed");
        const ast = JSON.stringify(req.body.ast);
        await page.update(
          {
            title: req.body.title,
            ast,
          },
          { transaction: t }
        );
        await meta.update(req.body.meta, { transaction: t });
        return res.send({
          code: 0,
          message: "success",
          data: true,
        });
      });
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
