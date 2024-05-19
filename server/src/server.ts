import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { v4 } from "uuid";
import ServerDatabase from "./db";

const paths = {
  public: path.join(__dirname, "../", "./public"),
  uploads: path.join(__dirname, "../", "./public", "./uploads"),
  data: path.join(__dirname, "../", "./data"),
};

export default class Server {
  private serverDatabase: ServerDatabase;
  constructor(app: Application, serverDatabase: ServerDatabase) {
    this.serverDatabase = serverDatabase;
    this.config(app);
    this.register(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "http://localhost:3000",
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(fileUpload());
    app.use("/public", express.static(paths.public));
  }

  private register(app: Application): void {
    app.post("/upload-image", (req, res) => {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      const uploadedFile = req.files.file as fileUpload.UploadedFile;
      const ext = uploadedFile.name.split(".")[1];
      const newFileName = v4() + `.${ext}`;
      const savePath = `${paths.uploads}/${newFileName}`;
      uploadedFile.mv(savePath, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        this.serverDatabase.db.run(
          `INSERT INTO images(id, url, user_id) VALUES (?, ?, ?)`,
          [null, newFileName, 1],
          (err) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              return res.send({
                code: 0,
                message: "success",
                data: newFileName,
              });
            }
          }
        );
      });
    });

    app.get("/uploaded-images", (req, res) => {
      this.serverDatabase.db.all(
        `SELECT * FROM images WHERE user_id = ?`,
        [1],
        (err, rows) => {
          if (err) {
            return res.status(500).send(err);
          } else {
            return res.send({
              code: 0,
              message: "success",
              data: rows,
            });
          }
        }
      );
    });

    app.post("/publish", (req, res) => {
      const uuid = req.body.uuid;
      const title = req.body.title;
      const ast = JSON.stringify(req.body.ast);
      this.serverDatabase.db.run(
        `INSERT INTO pages(id, uuid, title, ast, user_id) VALUES (?, ?, ?, ?, ?)`,
        [null, uuid, title, ast, 1],
        (err) => {
          if (err) {
            return res.status(500).send(err);
          } else {
            return res.send({
              code: 0,
              message: "success",
              data: true,
            });
          }
        }
      );
    });
  }
}
