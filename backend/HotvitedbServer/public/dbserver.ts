import express from "express"
import * as sqlite3 from 'sqlite3';

const server = express();


// Options
server.use(express.json());

//Routes


const db: sqlite3.Database = new sqlite3.Database('../data/Hotvitedb.db');

server.listen(3000, () => {
    console.log("http://localhost:3000/");
});

server.get("/", (req: any, res: any) => {
    res.send(200).send("Server online");
});

//test query
server.get("/db", (req, res) => {
   db.all('SELECT UserName, Email FROM user', (err, rows) => {
        if (err) {
            return res.status(500).json({error: 'Error executing query'});
        }

        res.json({users: rows});
    });
});
