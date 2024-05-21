require("dotenv").config({ path: [".env.local", ".env"] });
import express, { Application } from "express";
import Server from "./server";
import sequelize from "./database";
const app: Application = express();
const server: Server = new Server(app, sequelize);
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
