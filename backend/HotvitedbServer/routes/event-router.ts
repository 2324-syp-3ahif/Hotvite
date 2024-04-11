import express from "express";
import {Event, Location} from "../model"
import {createEvent, isValidEvent} from "../logic/event-repo";
import {dbUtility} from "../utilities/db-utilities";

export const eventRouter = express.Router();

eventRouter.post("/create", async (req, res) => {
    try {
        if (!await isValidEvent(req.body)) {
            res.sendStatus(405);
            return;
        }

        const event: Event = createEvent(req.body);

        if(!await isValidEvent(event)){
            res.sendStatus(405);
            return;
        }

        await dbUtility.saveEvent(event);

        res.status(201).json(event);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({error: "Internal server error"});
    }
});
eventRouter.get("/getAll", async (req, res) => {
    const data: Event[] = await dbUtility.getAllFromTable("event");


    res.status(200).json(data);
});

eventRouter.get("/getLocationById/:id", async (req, res) => {
   const data: Location[] = await dbUtility.getAllFromTable("location");

   if(data.length <= 0){
       return res.status(204).send("no location was found by id");
   }

   const result = data.filter(location => location.id === req.params.id)[0];

   res.status(200).json({latitude: result.latitude, longitude: result.longitude });
});