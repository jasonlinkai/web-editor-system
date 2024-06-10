import express, { Application } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import ServerDatabase from "./database";
import Auth from "./auth";
import registerPublicRouter from "./routes/public";
import registerUploadRouter from "./routes/upload";
import registerImageRouter from "./routes/image";
import registerPageRouter from "./routes/page";
import registerUserRouter from "./routes/user";

export default class Server {
  private app: Application;
  private serverDatabase: ServerDatabase;
  private auth: Auth;
  constructor(app: Application, serverDatabase: ServerDatabase, auth: Auth) {
    this.app = app;
    this.serverDatabase = serverDatabase;
    this.auth = auth;

    this.auth.config();
    this.config();
    this.auth.register();
    this.register();
  }

  private config(): void {
    this.app.use(
      cors({
        origin: [process.env.CLIENT_URL],
      })
    );
    this.app.use('/public/uploads', express.static(path.join(process.cwd(), "public", "uploads")));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      fileUpload({
        createParentPath: true,
      })
    );
    this.app.use(this.auth.authenticateJWT);
    const allowCrossDomain = (req, res, next) => {
      res.header("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
      res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
      res.header(`Access-Control-Allow-Headers`, `Content-Type`);
      next();
    };
    this.app.use(allowCrossDomain);
  }

  private register(): void {
    registerPublicRouter(this.app, this.serverDatabase);
    registerUserRouter(this.app);
    registerUploadRouter(this.app, this.serverDatabase);
    registerImageRouter(this.app, this.serverDatabase);
    registerPageRouter(this.app, this.serverDatabase);
  }
}
