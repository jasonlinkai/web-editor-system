import express, { Application } from "express";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import session from "express-session";
import { User, Page, Image } from "./database/models";
import ServerDatabase from "./database";

export default class Auth {
  private app: Application;
  private serverDatabase: ServerDatabase;
  constructor(app: Application, serverDatabase: ServerDatabase) {
    this.app = app;
    this.serverDatabase = serverDatabase;
  }
  config() {
    this.app.use(
      session({
        secret: process.env.GOOGLE_OAUTH2_SECRET,
        resave: false,
        saveUninitialized: true,
      })
    );
    // Initialize Passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());
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
              try {
                const [user] = await this.serverDatabase.userRepository.findOrCreate({
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
  register() {
    this.app.get("/", (req, res) => {
      res.send('<a href="/auth/google">Log in with Google</a>');
    });

    this.app.get("/auth/google", passport.authenticate("oauth2"));

    this.app.get(
      "/auth/google/callback",
      passport.authenticate("oauth2", {
        successRedirect: "/profile",
        failureRedirect: "/",
      })
    );

    this.app.get("/profile", (req, res) => {
      if (!req.isAuthenticated()) {
        return res.redirect("/");
      }
      res.send(`Hello ${JSON.stringify(req.user)}`);
    });

    this.app.get("/logout", (req, res) => {
      req.logout(() => {
        res.redirect("/");
      });
    });
  }
}
