import express from "express"
import * as sqlite3 from 'sqlite3';
import {StatusCodes} from "http-status-codes";

const server = express();
const db: sqlite3.Database = new sqlite3.Database('data/Hotvitedb.db');

server.use(express.json());

server.listen(3000, () => {
    console.log("http://localhost:3000/");
});

server.get("/", (req, res) => {
    res.sendStatus(StatusCodes.OK);
});

server.get("/db", async (req, res) => {
   db.all('SELECT UserName, Email, Age FROM users', (err, rows) => {
        if (err) {
            return res.status(500).json({error: 'Error executing query'});
        }

        res.json({users: rows});
    });
});
