import { relations } from "drizzle-orm";
import { timestamp, text, pgTable, serial, integer } from "drizzle-orm/pg-core";


export const eventsTable = pgTable("events", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    location: text("location").notNull(),
    date: timestamp("date").notNull(),
    createdAt: timestamp("createdAt").defaultNow()
})


export const attendeesTable = pgTable("attendees", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    event_id: integer("event_id").references(() => eventsTable.id)
})


export const eventsRelations = relations(eventsTable, ({ many }) => ({
  attendees: many(attendeesTable),
}));

export const attendeesRelations = relations(attendeesTable, ({ one }) => ({
  event: one(eventsTable, {
    fields: [attendeesTable.event_id],
    references: [eventsTable.id],
  }),
}));