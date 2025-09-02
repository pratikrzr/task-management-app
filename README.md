# 📖 Task Manager AI (MVP)

A minimal Jira-like task management system powered by **MongoDB + Express + Inngest + Google Gemini + React (Vite)**.  
Users create tasks with just a **title**, and an AI agent (Gemini) automatically generates **descriptions, subtasks, and story points**.

---

## 🚀 Features

- Create tasks (title only).
- AI agent generates:
  - Detailed description
  - 3–5 subtasks (title, description, story points from Fibonacci sequence).
  - Total story points.
- Jira-style board grouped by status: **todo, in-progress, done**.
- Add comments to tasks.
- Polling updates every 5s until AI fills in details.

---

## 🛠️ Tech Stack

- **Database**: MongoDB (Mongoose)
- **Backend**: Node.js + Express
- **Async Processing**: Inngest
- **AI**: Google Gemini API
- **Frontend**: React + Vite + TailwindCSS

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- [Node.js](https://nodejs.org/en/download) v18+
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- (Optional) [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Google Gemini API Key](https://aistudio.google.com/)

---

### 2. Install and Run MongoDB locally

#### Linux/macOS:

```bash
sudo systemctl start mongod
# or (if installed via brew)
brew services start mongodb-community
```

#### Windows:

- Start **MongoDB Server** from Services  
  OR run:

```powershell
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

👉 Default connection string:

```
mongodb://127.0.0.1:27017/taskdb
```

---

### 3. Backend Setup

1. Open terminal:

```bash
cd backend
npm install
```

2. Create `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskdb
GEMINI_API_KEY=your_google_gemini_api_key
```

3. Run backend:

```bash
node server.js
```

or

```bash
npm run dev
```

👉 Backend will run at: [http://localhost:5000](http://localhost:5000)

---

### 4. Frontend Setup

1. Open terminal:

```bash
cd frontend
npm install
```

2. Create `.env` file inside `frontend/`:

```
VITE_API_URL=http://localhost:5000
```

3. Run frontend:

```bash
npm run dev
```

👉 Frontend will run at: [http://localhost:3000](http://localhost:3000)

---

## ✅ Usage

1. Open frontend at `http://localhost:5173`.
2. Click **+ Create Task** → enter a title.
3. Task is created in MongoDB with just the title.
4. AI (Inngest + Gemini) generates description + subtasks asynchronously.
5. Frontend polls backend every 5s until details appear.
6. Tasks display in Jira-style board grouped by status (**todo, in-progress, done**).

---

## 📝 API Endpoints

### 1. Create a Task

**Request:**

```
POST /tasks
Content-Type: application/json

{
  "title": "Build login page"
}
```

**Response:**

```json
{
  "_id": "64f2a23c1a23bc...",
  "title": "Build login page",
  "status": "todo",
  "subtasks": [],
  "comments": [],
  "__v": 0
}
```

---

### 2. Get All Tasks

**Request:**

```
GET /tasks
```

**Response:**

```json
[
  {
    "_id": "64f2a23c1a23bc...",
    "title": "Build login page",
    "description": "A user login page with form validation...",
    "status": "todo",
    "storyPoints": 8,
    "subtasks": [
      {
        "title": "Design UI",
        "description": "Create wireframes",
        "storyPoints": 3,
        "status": "todo"
      },
      {
        "title": "Implement auth",
        "description": "Add JWT-based login",
        "storyPoints": 5,
        "status": "todo"
      }
    ],
    "comments": [
      {
        "author": "Alice",
        "content": "Check accessibility",
        "createdAt": "2025-09-01T12:00:00Z"
      }
    ]
  }
]
```

---

### 3. Add Comment to Task

**Request:**

```
POST /tasks/:id/comments
Content-Type: application/json

{
  "author": "Alice",
  "content": "This needs UI review."
}
```

**Response:**

```json
{
  "_id": "64f2a23c1a23bc...",
  "title": "Build login page",
  "description": "A user login page with form validation...",
  "status": "todo",
  "storyPoints": 8,
  "subtasks": [...],
  "comments": [
    { "author": "Alice", "content": "This needs UI review.", "createdAt": "2025-09-01T12:00:00Z" }
  ]
}
```

---

## 📌 Notes

- This is an **MVP** → no authentication, no advanced error handling.
- AI subtasks rely on Gemini API returning valid JSON. If parsing fails, you may see an empty subtasks list.
- MongoDB must be running before starting backend.

---

## 👨‍💻 Development Commands

Backend:

```bash
cd backend
node server.js
```

Frontend:

```bash
cd frontend
npm run dev
```

---

---

## 📜 License

MIT
