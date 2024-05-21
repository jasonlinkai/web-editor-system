import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { v4 } from "uuid";
import ServerDatabase from "./database";
import Auth from "./auth";
import { User } from "./database/models";

const paths = {
  public: path.join(__dirname, "../", "./public"),
  uploads: path.join(__dirname, "../", "./public", "./uploads"),
  data: path.join(__dirname, "../", "./data"),
  index: path.join(__dirname, "../", "./public", "./index.html"),
};

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
      origin: "http://localhost:3000",
    };
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(fileUpload());
    this.app.use("/public", express.static(paths.public));
  }

  private register(): void {
    this.app.post("/upload-image", (req, res) => {
      console.log('req', req);
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      const uploadedFile = req.files.file as fileUpload.UploadedFile;
      const ext = uploadedFile.name.split(".")[1];
      const newFileName = v4() + `.${ext}`;
      const savePath = `${paths.uploads}/${newFileName}`;
      uploadedFile.mv(savePath, async (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        const image = await this.serverDatabase.imageRepository.create({
          url: newFileName,
          userId: (req.user as User).id,
        });
        return res.send({
          code: 0,
          message: "success",
          data: image.url,
        });
      });
    });

    this.app.get("/uploaded-images", (req, res) => {
      // this.sequelize.all(
      //   `SELECT * FROM images WHERE user_id = ?`,
      //   [1],
      //   (err, rows) => {
      //     if (err) {
      //       return res.status(500).send(err);
      //     } else {
      //       return res.send({
      //         code: 0,
      //         message: "success",
      //         data: rows,
      //       });
      //     }
      //   }
      // );
    });

    this.app.post("/publish", (req, res) => {
      const uuid = req.body.uuid;
      const title = req.body.title;
      const ast = JSON.stringify(req.body.ast);
      // this.sequelize.run(
      //   `INSERT INTO pages(id, uuid, title, ast, user_id) VALUES (?, ?, ?, ?, ?)`,
      //   [null, uuid, title, ast, 1],
      //   (err) => {
      //     if (err) {
      //       return res.status(500).send(err);
      //     } else {
      //       return res.send({
      //         code: 0,
      //         message: "success",
      //         data: true,
      //       });
      //     }
      //   }
      // );
    });
  }
}
