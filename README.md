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
GEMMA_API_URL=https://api.deepinfra.com/v1/openai/chat/completions
GEMMA_API_KEY=your-provider-token
GEMMA_MODEL=google/gemma-4-E4B-it
```

The backend service uses an OpenAI-compatible chat completions payload with a base64 image data URL, so the model endpoint can be swapped for any hosted Gemma 4 vision provider that supports that format.

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
