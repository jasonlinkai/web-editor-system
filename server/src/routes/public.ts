import { Application, Request, Router } from "express";
import ServerDatabase from "../database";
import Page from "../database/models";
import { GetPublicPageRequestQuery } from "../../http-types";

const registerPublicRouter = (
  app: Application,
  serverDatabase: ServerDatabase
) => {
  const router = Router();
  router.get("/public/render-datas", async (req, res) => {
    try {
      const usersWithPages = await serverDatabase.userRepository.findAll({
        include: [Page],
      });
      return res.send({
        code: 0,
        message: "success",
        data: usersWithPages,
      });
    } catch (e) {
      return res.status(400).send({
        code: 400,
        message: (e as Error).message,
      });
    }
  });
  router.get(
    "/public/page",
    async (req: Request<{}, {}, {}, GetPublicPageRequestQuery>, res) => {
      try {
        const page = await serverDatabase.pageRepository.findOne({
          where: {
            id: req.query.id,
          },
        });
        return res.send({
          code: 0,
          message: "success",
          data: page,
        });
      } catch (e) {
        return res.status(400).send({
          code: 400,
          message: (e as Error).message,
        });
      }
    }
  );
  app.use(router);
};

export default registerPublicRouter;
