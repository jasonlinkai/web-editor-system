import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import fileUpload from "express-fileupload";
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
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(fileUpload());
    this.app.use(this.auth.authenticateJWT);
  }

  private register(): void {
    registerPublicRouter(this.app, this.serverDatabase);
    registerUserRouter(this.app);
    registerUploadRouter(this.app, this.serverDatabase);
    registerImageRouter(this.app, this.serverDatabase);
    registerPageRouter(this.app, this.serverDatabase);
  }
}
