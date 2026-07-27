# The Multimodal Track

React + Express whiteboard analyzer for messy Bangla-English board photos.

## Structure

- `frontend`: Vite React app with Tailwind CSS, drag-drop/camera upload, markdown summary, syntax-highlighted code, and flip flashcards.
- `backend`: Express API with `controllers`, `routes`, `services`, and multer image upload middleware.

## Setup

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

Create environment files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Set these backend values:

```bash
GEMMA_API_URL=https://generativelanguage.googleapis.com/v1beta
GEMMA_API_KEY=your-provider-token
GEMMA_MODEL=gemma-4-31b-it
DATABASE_URL=postgresql://user:password@host:6543/postgres
```

`DATABASE_URL` is optional locally. When set, the backend creates a `board_analyses` table and saves each analysis result with image metadata and mock user details.

For Render, add `DATABASE_URL` to the backend service environment variables. Use the Supabase pooler URI, and keep the value out of Git.
If the database password contains special characters, percent-encode them in the URI. For example, `@` becomes `%40`.

## Run

Run both modules:

```bash
npm run dev
```

Or run independently:

```bash
npm run dev:backend
npm run dev:frontend
```

API endpoint:

```http
POST http://localhost:5000/api/v1/analyze-board
Content-Type: multipart/form-data

image=<jpg|png|webp file>
```

Recent saved analyses:

```http
GET http://localhost:5000/api/v1/analyses
```
