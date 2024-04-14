import express from "express"
import cors from "cors";
import {userRouter} from "./routes/user-router";
import {eventRouter} from "./routes/event-router";
import dotenv from "dotenv";

const server = express();

dotenv.config();
export const secret_key = process.env.SECRET_KEY as String;


// Options
server.use(express.json({limit: '50mb'}));
server.use(express.json());
server.use(cors());


//Routes
server.use("/api/user/", userRouter);
server.use("/api/event/", eventRouter);

server.listen(3000, () => {
    console.log("http://localhost:3000/");
    console.log(secret_key);
});
server.get("/", (req, res) => {
    res.send("Server online");
});
