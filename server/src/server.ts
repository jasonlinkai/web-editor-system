import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { v4 } from "uuid";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import session from "express-session";
import { User, Page, Image } from "./database/models";
import ServerDatabase from "./database";

const paths = {
  public: path.join(__dirname, "../", "./public"),
  uploads: path.join(__dirname, "../", "./public", "./uploads"),
  data: path.join(__dirname, "../", "./data"),
  index: path.join(__dirname, "../", "./public", "./index.html"),
};

export default class Server {
  private app: Application;
  private serverDatabase: ServerDatabase;
  constructor(app: Application, serverDatabase: ServerDatabase) {
    this.app = app;
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
    app.use(
      session({
        secret: process.env.GOOGLE_OAUTH2_SECRET,
        resave: false,
        saveUninitialized: true,
      })
    );
    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(
      new OAuth2Strategy(
        {
          authorizationURL: "https://accounts.google.com/o/oauth2/auth",
          tokenURL: "https://accounts.google.com/o/oauth2/token",
          clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
          clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
          callbackURL: `https://zebra-central-incredibly.ngrok-free.app/auth/google/callback`,
          scope: ["profile", "email"],
        },
        (accessToken, refreshToken, params, profile, done) => {
          const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;

          fetch(url)
            .then((response) => response.json())
            .then(async (userInfo) => {
              const userRepository =
                this.serverDatabase.sequelize.getRepository(User);
              try {
                const [user] = await userRepository.findOrCreate({
                  where: { googleId: userInfo.id },
                  defaults: {
                    username: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture,
                    googleId: userInfo.id,
                  },
                });
                return done(null, user);
              } catch (e) {
                return done(e);
              }
            })
            .catch((err) => {
              done(err);
            });
        }
      )
    );
    passport.serializeUser((user, done) => {
      done(null, (user as any).id);
    });

    passport.deserializeUser<number>((id, done) => {
      User.findByPk(id)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => done(err));
    });
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
        // this.sequelize.run(
        //   `INSERT INTO images(id, url, user_id) VALUES (?, ?, ?)`,
        //   [null, newFileName, 1],
        //   (err) => {
        //     if (err) {
        //       return res.status(500).send(err);
        //     } else {
        //       return res.send({
        //         code: 0,
        //         message: "success",
        //         data: newFileName,
        //       });
        //     }
        //   }
        // );
      });
    });

    app.get("/uploaded-images", (req, res) => {
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

    app.post("/publish", (req, res) => {
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

    app.get("/", (req, res) => {
      res.send('<a href="/auth/google">Log in with Google</a>');
    });

    app.get("/auth/google", passport.authenticate("oauth2"));

    app.get(
      "/auth/google/callback",
      passport.authenticate("oauth2", {
        successRedirect: "/profile",
        failureRedirect: "/",
      })
    );

    app.get("/profile", (req, res) => {
      if (!req.isAuthenticated()) {
        return res.redirect("/");
      }
      res.send(`Hello ${JSON.stringify(req.user)}`);
    });

    app.get("/logout", (req, res) => {
      req.logout(() => {
        res.redirect("/");
      });
    });
  }
}
