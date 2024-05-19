import 'dotenv/config'
import express, { Application } from "express";
import Server from "./server";
import ServerDatabase from './db';

const app: Application = express();
const serverDatabase: ServerDatabase = new ServerDatabase();
const server: Server = new Server(app, serverDatabase);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
app
  .listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });