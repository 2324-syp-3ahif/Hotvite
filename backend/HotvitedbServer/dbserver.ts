import express from "express"
import cors from "cors";
import {userRouter} from "./routes/user-router";
import {dbUtility} from "./utilities/db-utilities";
import {eventRouter} from "./routes/event-router";

const server = express();

// Options
server.use(express.json({limit: '50mb'}));
server.use(express.json());
server.use(cors());


//Routes
server.use("/api/user/", userRouter);
server.use("/api/event/", eventRouter);

server.listen(3000, () => {
    console.log("http://localhost:3000/");
});

server.get("/", (req, res) => {
    res.send("Server online");
});

//test query
server.get("/db", async (req, res) => {
    res.json(await dbUtility.getAllFromTable("user"));
});
