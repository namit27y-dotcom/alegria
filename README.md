# Alegria 2027 — Rise of Olympus (Full Stack)

A complete Node.js full-stack festival website with the supplied Olympus artwork, event illustrations, event discovery UI, registration API, persistent database file, JWT-protected admin dashboard and check-in management.

## Stack
- Frontend: HTML5, CSS3, vanilla JavaScript
- Backend: Node.js HTTP server + REST API (no third-party runtime dependencies)
- Persistence: JSON database at `data/db.json` (created automatically)
- Admin authentication: signed HS256 JWT with an 8-hour expiry

## Run locally
1. Install Node.js 18 or newer.
2. Extract the ZIP and open the project folder in VS Code.
3. In the terminal run:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000`.
5. Admin dashboard: `http://localhost:3000/admin.html`.

## Default admin login
- Email: `admin@alegria.local`
- Password: `Olympus@2027!`

**Change these before publishing.** Copy `.env.example` to `.env` and set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a long random `JWT_SECRET`. This project intentionally has no dotenv dependency; export environment variables in your shell or configure them in your hosting provider. Do not commit real secrets.

## API routes
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Server health |
| GET | `/api/events` | Event catalogue |
| POST | `/api/registrations` | Validate and create attendee registration |
| GET | `/api/registrations/:passCode` | Look up a pass |
| POST | `/api/admin/login` | Admin login; returns JWT |
| GET | `/api/admin/registrations` | List registrations (admin JWT required) |
| PATCH | `/api/admin/registrations/:id` | Update status: `confirmed`, `checked-in`, `cancelled` |

### Registration request example
```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "phone": "9876543210",
  "college": "Pillai College of Engineering",
  "year": "2nd",
  "pass": "Mortal",
  "events": [1]
}
```
Mortal allows one event, Hero allows up to five, and Immortal allows all twelve.

## Project structure
```text
alegria-rise-of-olympus-fullstack/
├── server.js
├── package.json
├── .env.example
├── README.md
├── data/                 # created automatically; registrations stored here
└── public/
    ├── index.html
    ├── admin.html
    └── assets/           # hero background, logo and 12 event PNGs
```

## Deployment
Deploy to a Node.js host that supports persistent writable storage (for example a VPS or persistent-volume service). Set environment variables in the host dashboard. A serverless host with ephemeral filesystem will lose JSON database changes between instances; use a managed database or persistent volume for production. Add HTTPS and configure regular backups of `data/db.json`.

## Notes
- The registration form sends data to the backend; it no longer relies on browser local storage.
- Admin can search attendees, refresh records, mark attendees checked in, confirm or cancel registrations.
- This starter does not integrate payment collection, email/SMS notifications, or a managed SQL database.
