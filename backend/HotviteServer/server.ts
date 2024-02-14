import express, {Request, Response, NextFunction} from "express"
const server = express();

server.use(express.json());

server.listen(3001);

server.get("/", (req, res) => {
    res.send(200).send("Server online");
});
