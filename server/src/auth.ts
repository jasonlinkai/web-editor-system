import { Application, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import session from "express-session";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import ServerDatabase from "./database";
import { RequestWithAuth } from "./typing";

const JWT_SECRET = process.env.JWT_SECRET;

export default class Auth {
  private app: Application;
  private serverDatabase: ServerDatabase;
  public authenticateJWT: ReturnType<typeof expressjwt>;
  constructor(app: Application, serverDatabase: ServerDatabase) {
    this.app = app;
    this.serverDatabase = serverDatabase;
    this.authenticateJWT = expressjwt({
      secret: JWT_SECRET,
      algorithms: ["HS256"],
    }).unless({
      path: [
        { url: "/test-server", methods: ["GET"] },
        { url: "/public/render-datas", methods: ["GET"] },
        { url: "/public/page", methods: ["GET"] },
        { url: "/auth/google", methods: ["GET"] },
        { url: "/auth/google/callback", methods: ["GET"] },
      ],
    });
  }
  config() {
    this.app.use(
      session({
        secret: process.env.GOOGLE_OAUTH2_SECRET,
        resave: false,
        saveUninitialized: true,
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passport.use(
      new OAuth2Strategy(
        {
          authorizationURL: "https://accounts.google.com/o/oauth2/auth",
          tokenURL: "https://accounts.google.com/o/oauth2/token",
          clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
          clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
          callbackURL: `${process.env.SERVER_HOST}:${process.env.PORT}/auth/google/callback`,
          scope: ["profile", "email"],
        },
        (accessToken, refreshToken, params, profile, done) => {
          const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
          fetch(url)
            .then((response) => response.json())
            .then(async (userInfo) => {
              try {
                const [user] =
                  await this.serverDatabase.userRepository.findOrCreate({
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
      this.serverDatabase.userRepository.findByPk(id)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => done(err));
    });
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err.name === "UnauthorizedError") {
          res.status(401).json({ code: 401, message: err.name });
        } else {
          next(err);
        }
      }
    );
  }
  register() {
    this.app.get("/test-server", (req, res) => {
      res.send({
        code: 0,
        message: "success",
        data: "test success!",
      });
    });
    this.app.get(
      "/auth/google",
      passport.authenticate("oauth2", {
        scope: ["profile", "email"],
      })
    );
    this.app.get(
      "/auth/google/callback",
      passport.authenticate("oauth2", {
        failureRedirect: `${process.env.CLIENT_URL}/backend/login`,
      }),
      (req, res) => {
        const token = jwt.sign({ user: req.user }, JWT_SECRET);
        res.redirect(
          `${process.env.CLIENT_URL}/backend/redirect?credential=${token}`
        );
      }
    );
    this.app.post("/auth/logout", (req: RequestWithAuth, res) => {
      req.logout((err) => {
        if (err) {
          console.error(err.message);
          res.send({
            code: 400,
            message: err.message,
          });
        } else {
          console.log("logout success: ", req.auth?.user.username);
          res.send({
            code: 0,
            message: "success",
            data: true,
          });
        }
      });
    });
  }
}
