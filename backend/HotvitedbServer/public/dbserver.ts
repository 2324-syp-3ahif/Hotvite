import express from "express"
import * as sqlite3 from 'sqlite3';
import cors from "cors";
import {userRouter} from "./routes/user-router";

const server = express();


// Options
server.use(express.json());
server.use(cors());

//Routes
server.use("/api/user/", userRouter);


export const db: sqlite3.Database = new sqlite3.Database('../data/Hotvitedb.db');

server.listen(3000, () => {
    console.log("http://localhost:3000/");
});

server.get("/", (req, res) => {
    res.send("Server online");
});

//test query
server.get("/db", (req, res) => {
    db.all('SELECT username, password, aboutme, email FROM user', (err, rows) => {
        if (err) {
            return res.status(500).json({error: 'Error executing query'});
        }

        res.json({users: rows});
    });
});
