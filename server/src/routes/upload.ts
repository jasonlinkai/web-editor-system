import { v4 } from "uuid";
import { Application, Router, Request } from "express";
import AWS from "aws-sdk";
import ServerDatabase from "../database";
import type { RequestWithAuth } from "../typing";
import {
  PostUploadRequestQueryTypeEnum,
  PostUploadRequestQuery,
} from "../../../shared/http-types";

type UploadPostRequest = RequestWithAuth<Request<{}, {}, {}, PostUploadRequestQuery>>;
const registerUploadRouter = (
  app: Application,
  serverDatabase: ServerDatabase
) => {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: "us-east-1",
    sslEnabled: false,
    s3ForcePathStyle: true,
  });
  const s3 = new AWS.S3();
  const router = Router();
  router.post("/upload", async (req: UploadPostRequest, res) => {
    try {
      if (!Object.keys(PostUploadRequestQueryTypeEnum).includes(req.query.type)) {
        throw Error("We don't support this upload type.");
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        throw Error("No files were uploaded.");
      }

      const uploadedFile = req.files.file;

      if (Array.isArray(uploadedFile)) {
        throw Error("We don't support multiple upload now.");
      }

      const ext = uploadedFile.name.split(".")[1];
      const newFileName = v4() + `.${ext}`;

      s3.upload(
        {
          Bucket: "jacky-web-editor",
          Key: newFileName,
          Body: uploadedFile.data,
          Tagging: "public=yes",
        },
        async (err) => {
          if (err) {
            throw err;
          } else {
            const image = await serverDatabase.imageRepository.create({
              url: newFileName,
              userId: req.auth?.user.id,
            });
            return res.send({
              code: 0,
              message: "success",
              data: image.url,
            });
          }
        }
      );
    } catch (e) {
      return res.status(400).send({
        code: 400,
        message: (e as Error).message,
      });
    }
  });
  app.use(router);
};

export default registerUploadRouter;