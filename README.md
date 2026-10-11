# BulkMail — Bulk Email Sender

BulkMail is a full-stack web application that allows users to send a message to multiple email recipients through a simple interface. It uses React for the frontend, Node.js and Express for the backend, MongoDB for database connectivity, and the Gmail API with OAuth 2.0 for email delivery.

## Live Demo

- **Frontend:** https://bulk-mail-kappa.vercel.app
- **Backend:** https://bulkmail-d9fu.onrender.com

## Features

- Send a message to multiple email recipients.
- React-based user interface.
- REST API built with Express.js.
- MongoDB integration.
- Gmail API integration using OAuth 2.0.
- Environment variables for sensitive configuration.
- Frontend and backend deployed separately.

## Tech Stack

**Frontend**
- React
- Vite
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- Google APIs (`googleapis`)
- MongoDB
- Mongoose
- dotenv
- CORS

**Email Service**
- Gmail API
- Google OAuth 2.0

**Deployment**
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

## Project Structure

```text
BulkMail/
├── backend/
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── App.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
└── README.md
```



