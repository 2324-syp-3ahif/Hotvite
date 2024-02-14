import express, {Request, Response, NextFunction} from "express"
import * as sqlite3 from 'sqlite3';

const server = express();

server.use(express.json());

server.listen(3000);

let db: sqlite3.Database;
server.all('*', (req: Request, res: Response, next: NextFunction) => {
    db = new sqlite3.Database('data/Hotvitedb.db');

    if (!db) {
        res.sendStatus(400);
    }

    next();
});

server.get("/", (req, res) => {
    res.send(200).send("Server online");
});

server.get("/db", (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            return res.status(500).json({error: 'Error executing query'});
        }

        res.json({users: rows});
    });
});
