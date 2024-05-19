import type { Database } from "sqlite3";
import _sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, '../index.db');
const sqlite3 = _sqlite3.verbose();

class ServerDatabase {
  public db: Database;
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Database is connected.");
    });
  }
}

export default ServerDatabase;