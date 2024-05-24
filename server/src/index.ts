require("dotenv").config({ path: [".env.local", ".env"] });
import express, { Application } from "express";
import Server from "./server";
import ServerDataBase from "./database";
import Auth from "./auth";

const initDb = async (serverDatabase: ServerDataBase) => {
  try {
    await serverDatabase.sync();
    await serverDatabase.connect();
  } catch (e) {
    await initDb(serverDatabase);
  }
};

const main = async () => {
  const serverDatabase = new ServerDataBase();
  await initDb(serverDatabase);
  const app: Application = express();
  const auth = new Auth(app, serverDatabase);
  const server: Server = new Server(app, serverDatabase, auth);
  const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

  app
    .listen(PORT, "0.0.0.0", function () {
      console.log(`Server is running on port ${PORT}.`);
    })
    .on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.log("Error: address already in use");
      } else {
        console.log(err);
      }
    });
};

main();
