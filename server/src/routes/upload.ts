import path from "path";
import { v4 } from "uuid";
import { Router, Request } from "express";
import AWS from "aws-sdk";
import ServerDatabase from "../database";
import type { RequestWithAuth } from "../typing";
import {
  PostUploadRequestQueryTypeEnum,
  PostUploadRequestQuery,
} from "../../http-types";

type UploadPostRequest = RequestWithAuth<
  Request<{}, {}, {}, PostUploadRequestQuery>
>;
const registerUploadRouter = (
  serverDatabase: ServerDatabase
) => {
  const router = Router();
  // AWS.config.update({
  //   accessKeyId: process.env.ACCESS_KEY_ID,
  //   secretAccessKey: process.env.SECRET_ACCESS_KEY,
  //   region: "us-east-1",
  //   sslEnabled: false,
  //   s3ForcePathStyle: true,
  // });
  // const s3 = new AWS.S3();
  // router.post("/upload", async (req: UploadPostRequest, res) => {
  //   try {
  //     if (!Object.keys(PostUploadRequestQueryTypeEnum).includes(req.query.type)) {
  //       throw Error("We don't support this upload type.");
  //     }

  //     if (!req.files || Object.keys(req.files).length === 0) {
  //       throw Error("No files were uploaded.");
  //     }

  //     const uploadedFile = req.files.file;

  //     if (Array.isArray(uploadedFile)) {
  //       throw Error("We don't support multiple upload now.");
  //     }

  //     const ext = uploadedFile.name.split(".")[1];
  //     const newFileName = v4() + `.${ext}`;
  //     s3.upload(
  //       {
  //         Bucket: "jacky-web-editor",
  //         Key: newFileName,
  //         Body: uploadedFile.data,
  //         ContentType: uploadedFile.mimetype,
  //         Tagging: "public=yes",
  //       },
  //       async (err) => {
  //         if (err) {
  //           throw err;
  //         } else {
  //           const image = await serverDatabase.imageRepository.create({
  //             url: newFileName,
  //             userId: req.auth?.user.id,
  //           });
  //           return res.send({
  //             code: 0,
  //             message: "success",
  //             data: image.url,
  //           });
  //         }
  //       }
  //     );
  //   } catch (e) {
  //     return res.status(400).send({
  //       code: 400,
  //       message: (e as Error).message,
  //     });
  //   }
  // });

  router.post("/upload", async (req: UploadPostRequest, res) => {
    try {
      if (
        !Object.keys(PostUploadRequestQueryTypeEnum).includes(req.query.type)
      ) {
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
      const uploadPath = path.join(process.cwd(), "public", "uploads", newFileName);
      uploadedFile.mv(uploadPath, async (err) => {
        if (err) {
          throw Error("Move file failed!");
        }
        const image = await serverDatabase.imageRepository.create({
          url: newFileName,
          userId: req.auth?.user.id,
        });
        return res.send({
          code: 0,
          message: "success",
          data: image.url,
        });
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
