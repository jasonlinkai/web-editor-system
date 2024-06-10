import { Application, Request, Response, NextFunction, Router } from "express";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import session from "express-session";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import ServerDatabase from "../database";
import { RequestWithAuth } from "../typing";
import { v4 as uuid } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET;

const RegisterAuthRouter = (
  app: Application,
  serverDatabase: ServerDatabase
) => {
  //
  // jwt
  //
  const authenticateJWT = expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: new RegExp("/test-server", "ig"), methods: ["GET"] },
      { url: new RegExp("/public", "ig"), methods: ["GET"] },
      { url: new RegExp("/auth", "ig"), methods: ["GET"] },
    ],
  });
  app.use(authenticateJWT);

  //
  // session
  //
  const sessionHandler = session({
    secret: process.env.GOOGLE_OAUTH2_SECRET,
    resave: false,
    saveUninitialized: true,
  });
  app.use(sessionHandler);

  //
  // passport
  //
  const GoogleOAuth2Strategy = new OAuth2Strategy(
    {
      authorizationURL: "https://accounts.google.com/o/oauth2/auth",
      tokenURL: "https://accounts.google.com/o/oauth2/token",
      clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
      callbackURL: `${process.env.SERVER_HOST}/auth/google/callback`,
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, params, profile, done) => {
      const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
      fetch(url)
        .then((response) => response.json())
        .then(async (userInfo) => {
          try {
            const [user] = await serverDatabase.userRepository.findOrCreate({
              where: { googleId: userInfo.id },
              defaults: {
                uuid: uuid(),
                username: userInfo.name,
                email: userInfo.email,
                avatarUrl: userInfo.picture,
                googleId: userInfo.id,
              },
            });
            return done(null, user);
          } catch (e) {
            console.error((e as Error).message);
            return done(e);
          }
        })
        .catch((err) => {
          done(err);
        });
    }
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(GoogleOAuth2Strategy);
  passport.serializeUser((user, done) => {
    done(null, (user as any).id);
  });
  passport.deserializeUser<number>((id, done) => {
    serverDatabase.userRepository
      .findByPk(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });
  app.use(
    (err: any, req: Request, res: Response, next: NextFunction) => {
      if (err.name === "UnauthorizedError") {
        res.status(401).json({ code: 401, message: err.name });
      } else {
        next(err);
      }
    }
  );

  const router = Router();
  router.get("/test-server", (req, res) => {
    res.send({
      code: 0,
      message: "success",
      data: "test success!",
    });
  });
  router.get(
    "/auth/google",
    passport.authenticate("oauth2", {
      scope: ["profile", "email"],
    })
  );
  router.get(
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
  router.post("/auth/logout", (req: RequestWithAuth, res) => {
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
  return router;
};

export default RegisterAuthRouter;
