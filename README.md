# osu! Web Application

React + TypeScript frontend with Express backend for osu! API integration.

## Prerequisites

- Node.js 18+
- osu! OAuth Application ([Create one here](https://osu.ppy.sh/home/account/edit#oauth))

## Setup

### 1. Environment Variables

**Frontend** (`frontend/.env`):

```env
VITE_OSU_CLIENT_ID=your_client_id
VITE_OSU_CLIENT_SECRET=your_client_secret
VITE_API_URL=http://localhost:3001
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
```

**Backend** (`backend/.env`):

```env
OSU_CLIENT_ID=your_client_id
OSU_CLIENT_SECRET=your_client_secret
OSU_REDIRECT_URI=http://localhost:5173/auth/callback
PORT=3001
```

### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 3. Run

```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3001`

## Build

```bash
cd frontend
npm run build
```

## Tech Stack

- Frontend: React 18 + TypeScript + Vite
- Backend: Express + ES Modules + rosu-pp-js
