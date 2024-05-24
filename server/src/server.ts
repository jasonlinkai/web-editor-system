import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import fileUpload from "express-fileupload";
import { Request as JWTRequest } from "express-jwt";
import { v4 } from "uuid";
import AWS from "aws-sdk";
import ServerDatabase from "./database";
import Auth from "./auth";
import paths from "./paths";
import { User } from "./database/models";

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: "us-east-1",
  sslEnabled: false,
  s3ForcePathStyle: true,
});

// Create an S3 object
const s3 = new AWS.S3();

export default class Server {
  private app: Application;
  private serverDatabase: ServerDatabase;
  private auth: Auth;
  constructor(app: Application, serverDatabase: ServerDatabase, auth: Auth) {
    this.app = app;
    this.serverDatabase = serverDatabase;
    this.auth = auth;

    this.config();
    this.register();
    this.auth.config();
    this.auth.register();
  }

  private config(): void {
    const corsOptions: CorsOptions = {
      origin: [process.env.CLIENT_URL]
    };
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(fileUpload());
    this.app.use("/", express.static(paths.public));
  }

  private register(): void {
    this.app.post(
      "/upload-image",
      this.auth.authenticateJWT,
      async (
        req: JWTRequest<{
          user: User;
        }>,
        res
      ) => {
        try {
          if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No files were uploaded.");
          }

          const uploadedFile = req.files.file as fileUpload.UploadedFile;
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
                const image = await this.serverDatabase.imageRepository.create({
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
      }
    );

    this.app.get(
      "/uploaded-images",
      this.auth.authenticateJWT,
      async (
        req: JWTRequest<{
          user: User;
        }>,
        res
      ) => {
        try {
          const images = await this.serverDatabase.imageRepository.findAll({
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
      }
    );

    this.app.post(
      "/publish",
      this.auth.authenticateJWT,
      async (
        req: JWTRequest<{
          user: User;
        }>,
        res
      ) => {
        try {
          console.log("req.user", req.user);
          const uuid = req.body.uuid;
          const title = req.body.title;
          const ast = JSON.stringify(req.body.ast);
          let page = await this.serverDatabase.pageRepository.findOne({
            where: {
              uuid,
              userId: req.auth?.user.id,
            },
          });
          if (page) {
            page = await page.update({
              title,
              ast,
            });
          } else {
            page = await this.serverDatabase.pageRepository.create({
              uuid,
              title,
              ast,
              userId: req.auth?.user.id,
            });
          }
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
      }
    );
  }
}
