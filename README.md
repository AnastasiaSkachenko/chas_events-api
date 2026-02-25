# Workshop: Event Manager API med Drizzle

## Mål

Bygg ett litet backend-API för att hantera **event och deltagare** med:

- Node + Express
- PostgreSQL
- Drizzle ORM
- Migrationer med Drizzle Kit

Fokus är:

- Relationer (1-Många)
- Joins
- Foreign keys
- Partial updates
- Filtrering och enklare aggregationer

---

# Scenario

Du ska bygga backend till en enkel **Event Manager**.

En användare ska kunna:

- Skapa events
- Lista alla events
- Registrera deltagare till ett event
- Se vilka deltagare som är registrerade
- Uppdatera ett event

---

# Datamodell

## 1️⃣ events

| fält      | typ         |
| --------- | ----------- |
| id        | serial (pk) |
| title     | text        |
| location  | text        |
| date      | timestamp   |
| createdAt | timestamp   |

---

## 2️⃣ attendees

| fält    | typ                      |
| ------- | ------------------------ |
| id      | serial (pk)              |
| name    | text                     |
| email   | text                     |
| eventId | integer (fk → events.id) |

Relation:

- Ett event har många attendees
- En attendee tillhör exakt ett event

---

# 🧩 Del 1 – Setup

### 1. Skapa projekt

- `npm init`
- Installera:
  - express
  - drizzle-orm
  - drizzle-kit
  - pg
  - dotenv

### 2. Skapa filer

- `db.ts`
- `schema.ts`
- `drizzle.config.ts`

### 3. Definiera tabellerna i `schema.ts`

- Använd `pgTable`
- Lägg till primary keys
- Lägg till foreign key
- Lägg till `notNull()` där det är rimligt

---

# 🛠 Del 2 – Migration

### 1. Generera migration

```bash
npx drizzle-kit generate
```

### 2. Kör migration

```bash
npx drizzle-kit migrate
```

### 3. Kontrollera i databasen

Använd t.ex. pgWeb

Kontrollera att:

- Primary keys finns
- Foreign key mellan `attendees.eventId` → `events.id` finns
- NOT NULL är korrekt satt

---

# Del 3 – API Endpoints

Skapa följande endpoints:

---

## 1️⃣ Skapa event

**POST /events**

Body:

```json
{
  "title": "JavaScript Meetup",
  "location": "Stockholm",
  "date": "2026-03-10"
}
```

Ska:

- Insert i events
- Returnera det skapade eventet

---

## 2️⃣ Hämta alla events

**GET /events**

Ska:

- Returnera alla events
- Sortera på datum (äldst först)

---

## 3️⃣ Registrera deltagare

**POST /events/:id/attendees**

Body:

```json
{
  "name": "David",
  "email": "david@test.se"
}
```

Ska:

- Kontrollera att eventet finns
- Insert i attendees med rätt `eventId`

---

## 4️⃣ Hämta ett event med deltagare

**GET /events/:id**

Ska:

- Returnera eventet
- Samt alla attendees
- Använd `leftJoin`

---

## 5️⃣ Uppdatera event (partial update)

**PATCH /events/:id**

Body:

```json
{
  "location": "Göteborg"
}
```

Ska:

- Uppdatera endast fälten som skickas in
- Använd `.set()` i Drizzle

---

# 🔎 Del 4 – Queries att träna på

När API:t fungerar ska du även kunna:

- Hämta alla events i framtiden
- Räkna antal deltagare per event
- Hämta events som har fler än 5 deltagare

---

# Extrauppgift - Lägg till users

Skapa en users tabell med email och username. Hur ska users kopplas till attendees?

# Reflektionsfrågor

1. Vad är skillnaden mellan:
   - `.findMany()` och `.select()`?
2. När är `leftJoin` bättre än `innerJoin`?
3. Vad händer om man försöker skapa en attendee med fel `eventId`?
4. Hur skulle du lägga till:
   - Unik email per event?
   - Cascade delete?

---

# Slutmål

Efter workshopen ska du:

- Förstå relationer i Drizzle
- Kunna skapa migrationer
- Förstå joins
- Kunna göra partial updates
- Känna sig trygg med backend-struktur + ORM
