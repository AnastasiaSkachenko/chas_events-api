import express, { Request } from "express";
import dotenv from "dotenv";
import { db } from "./dbInstance";
import { eventsTable, attendeesTable} from "./db/schema"
import cors from "cors";
import { eq } from "drizzle-orm";


dotenv.config({ path: ".env.local" })


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json())
app.use(cors())


app.get("/health", async (req, res) => {
    res.status(200).json({status: "ok"})
})

app.post("/events", async (req, res) => {

    try {
        const {title, location, date} = req.body

        const event = await db.insert(eventsTable).values(
            { title, location, date: new Date(date) }
        ).returning()


        res.status(201).json({"message": "Event created! Boom! Roasted.", "event": event})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

app.patch("/events/:id", async (req: Request<{id: number}>, res) => {

    try {
        const { id } = req.params

        const event = await db
            .update(eventsTable)
            .set(req.body)
            .where(eq(eventsTable.id, id))
            .returning()


        res.status(200).json({"message": "Event updated! Boom! Roasted.", "event": event})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})


app.get("/events", async (req, res) => {
    try {

        const events = await db.select().from(eventsTable)


        res.status(200)

        if (events.length > 0) {
            res.json({"message": `${events.length} events found.`, "events": events})
        } else {
            res.json({"message": "No event found"})

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

app.post("/events/:id/attendees", async (req: Request<{id: number}>, res) => {
    try {
        const {name, email} = req.body;
        const { id } = req.params;

        const event = await db.select().from(eventsTable).where(eq(eventsTable.id, id))

        if (!event) {
            res.status(400).json({"error": "No event found."})
        }

        const attendee = await db.insert(attendeesTable).values(
            { event_id: id, name, email }
        ).returning()


        res.status(201).json({"message": "Attendee created! Boom! Roasted.", "attendee": attendee})

    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

app.get("/events/:id", async (req: Request<{id: number}>, res) => {
    try {
        const { id } = req.params;

        const eventWithAttendees = await db.query.eventsTable.findFirst({
            where: (eventsTable, { eq }) => eq(eventsTable.id, id),
            with: {
                attendees: true, // fetch all attendees for this event
            },
        });

        if (!eventWithAttendees) {
            res.status(400).json({"error": "No event found."})
        }


        res.status(201).json({"message": `${eventWithAttendees?.attendees.length} attendees are going to ${eventWithAttendees?.title}`, "event": eventWithAttendees})

    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})


app.use((req, res)=> {
    res.status(404).send("Page not found")
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})