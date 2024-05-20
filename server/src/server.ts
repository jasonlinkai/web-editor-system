import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { v4 } from "uuid";
import ServerDatabase from "./db";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import session from "express-session";

const paths = {
  public: path.join(__dirname, "../", "./public"),
  uploads: path.join(__dirname, "../", "./public", "./uploads"),
  data: path.join(__dirname, "../", "./data"),
  index: path.join(__dirname, "../", "./public", "./index.html"),
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
          console.log("accessToken", accessToken);
          console.log("refreshToken", refreshToken);
          console.log("params", params);
          console.log("profile", profile);
          const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;

          fetch(url)
            .then((response) => response.json())
            .then((userInfo) => {
              console.log("User Info:", userInfo);
              // Use userInfo here
              // Here you would find or create a user in your database
              const user = { googleId: profile.id, accessToken };
              return done(null, user);
            })
            .catch((err) => {
              done(err, false);
            });
        }
      )
    );
    passport.serializeUser((user, done) => {
      console.log("serializeUser", JSON.stringify(user));
      done(null, user);
    });

    // Deserialize user from the sessions
    passport.deserializeUser<number>((user, done) => {
      console.log("deserializeUser", JSON.stringify(user));
      done(null, user);
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
