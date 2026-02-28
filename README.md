# B.Y.T.E. — Poem Publisher

An entry-level MERN-inspired mini project where writers can sign up, log in, publish poems, and let everyone read them publicly. Built to stay simple while showcasing clean UI/UX, JWT-based auth, and a public feed.

## Features
- Login and registration with JWT sessions
- Publish poems that are instantly visible to everyone
- Public gallery with author and publish date
- Clean, responsive UI with polished spacing

## Tech Stack
- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express
- Auth: JWT

## Local Setup
1. Install Node.js (LTS recommended)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `index.html` in your browser.

## Environment
To set a secure JWT secret:
```bash
export JWT_SECRET="your-strong-secret"
```

## Project Structure
- `index.html` — UI and client-side logic
- `style2.css` — styling and responsive layout
- `server.js` — Express API with JWT auth

## Notes
This is a learning-focused mini project and uses in-memory storage. Restarting the server resets users and poems. It is a great starting point to migrate into a full MERN stack with MongoDB.
