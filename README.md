# Mosaic Minds Web

A full-stack web platform for a virtual psychotherapy clinic — built as a portfolio project.

Mosaic Minds is an online-only psychotherapy clinic. Clients can browse therapists and specialties, book a therapy session online, and join the session by video. There are two separate dashboards: one for therapists and one for the admin.

> **Status:** Portfolio project — not live anywhere yet.

## What it does

### For clients
- Browse therapists, their specialties, experience and session fees
- Book a therapy session with a therapist, choosing a date and time slot
- Look up a booking with its confirmation code
- Join the therapy session by video (Jitsi video meeting, in the browser)
- Send a message through the contact form

### For therapists — Therapist Dashboard
- Log in with a therapist account (JWT authentication)
- Manage their weekly schedule / availability
- View their appointments
- Write private session notes for their appointments

### For the admin — Admin Dashboard
- Log in with an admin account (JWT authentication)
- Manage therapists and specialties
- View appointments, stats and contact messages

The admin dashboard is reached at `/admin` — there is no link to it in the navigation.

### Specialties included
Anxiety & Stress, Depression, Couples Therapy, Child Psychology, Trauma & PTSD, Addiction Counseling, Family Therapy, Grief Counseling and Sleep Disorders.

## Tech stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Framer Motion, Jitsi video (`@jitsi/react-sdk`) |
| Backend | Node.js, Express 5 |
| Database | MySQL / MariaDB (`mysql2`) |
| Auth | JSON Web Tokens (`jsonwebtoken`), passwords hashed with `bcryptjs` |

## Project structure

```
Mosaic-Minds-Web/
├── client/      # React + Vite frontend
├── server/      # Express API
└── database/    # MySQL schema (schema.sql)
```

## Getting started

### 1. Database

Create the database and import the schema:

```bash
mysql -u root -p -e "CREATE DATABASE mosaic_minds_db;"
mysql -u root -p mosaic_minds_db < database/schema.sql
```

`schema.sql` contains the table structure and the specialty list only. Sample client, appointment and therapist data was removed for privacy.

### 2. Server

```bash
cd server
npm install
cp .env.example .env   # then fill in your own values
npm run dev            # runs on http://localhost:5000
```

To create demo accounts, run `node utils/createAccounts.js` — it creates a demo admin and a demo therapist. Change the demo passwords in that file before using it for anything real.

### 3. Client

```bash
cd client
npm install
npm run dev            # runs on http://localhost:5173
```

## Video sessions

Video sessions use Jitsi (`@jitsi/react-sdk`). When a client looks up a booking, they can join the session room from the lookup page at `/session/:roomName`.

## API

Base URL: `http://localhost:5000`

| Route | Purpose |
| --- | --- |
| `GET /` | Health check |
| `/api/auth` | Therapist / admin login |
| `/api/therapists` | Therapists |
| `/api/specialties` | Specialties |
| `/api/appointments` | Book / look up appointments |
| `/api/availability` | Therapist availability and time slots |
| `/api/session-notes` | Private therapist session notes |
| `/api/contact` | Contact messages |
| `/api/stats` | Dashboard stats |

## Notes

- This is a portfolio / demo project for a virtual psychotherapy clinic. It is not a real clinic and has no physical location.
- Never commit a real `.env` file, passwords or login tokens to GitHub. Use `.env.example` as the template.
- The `client/src/assets/hero.png` image is not included in the first upload — add your own image there if you want it in the repo.
