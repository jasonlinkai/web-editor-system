import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import ServerDatabase from "./database";
import registerAuthRouter from "./routes/auth";
import registerPublicRouter from "./routes/public";
import registerUploadRouter from "./routes/upload";
import registerImageRouter from "./routes/image";
import registerPageRouter from "./routes/page";
import registerUserRouter from "./routes/user";

export default class Server {
  private app: Application;
  private serverDatabase: ServerDatabase;
  constructor(app: Application, serverDatabase: ServerDatabase) {
    this.app = app;
    this.serverDatabase = serverDatabase;

    this.config();
    this.register();
  }

  private config(): void {
    this.app.use(
      cors({
        origin: [process.env.CLIENT_URL],
      })
    );
    this.app.use('/api/public/uploads', express.static(path.join(process.cwd(), "public", "uploads")));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      fileUpload({
        createParentPath: true,
      })
    );
    const allowCrossDomain = (req, res, next) => {
      res.header("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
      res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
      res.header(`Access-Control-Allow-Headers`, `Content-Type`);
      next();
    };
    this.app.use(allowCrossDomain);
  }

  private register(): void {
    this.app.use("/api", registerAuthRouter(this.app, this.serverDatabase));
    this.app.use("/api", registerPublicRouter(this.serverDatabase));
    this.app.use("/api", registerUserRouter());
    this.app.use("/api", registerUploadRouter(this.serverDatabase));
    this.app.use("/api", registerImageRouter(this.serverDatabase));
    this.app.use("/api", registerPageRouter(this.serverDatabase));
  }
}
