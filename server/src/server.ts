import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import fileUpload from "express-fileupload";
import ServerDatabase from "./database";
import Auth from "./auth";
import paths from "./paths";
import registerUploadRouter from "./routes/upload";
import registerImageRouter from "./routes/image";
import registerPageRouter from "./routes/page";

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
    const corsOptions: CorsOptions = {
      origin: [process.env.CLIENT_URL],
    };
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(fileUpload());
    this.app.use("/", express.static(paths.public));
    this.app.use(this.auth.authenticateJWT);
  }

  private register(): void {
    registerUploadRouter(this.app, this.serverDatabase);
    registerImageRouter(this.app, this.serverDatabase);
    registerPageRouter(this.app, this.serverDatabase);
  }
}
