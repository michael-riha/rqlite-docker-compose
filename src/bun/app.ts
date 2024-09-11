// import { Database } from "bun:sqlite";
import {default as Database, Statements}  from "./rqliteDatabase";

const db = new Database("db/db.sqlite");
debugger;
const query = db.query("SELECT name FROM sqlite_master WHERE type='table'");
const tables = query.get(); // =>
debugger;
// tables.forEach(table => {
//   debugger;
//   console.log(table.name);
// });
// db.close(false);   