# FileShare - P2P File Sharing Website

FileShare is a secure, peer-to-peer (P2P) file-sharing website built with modern web technologies. It allows users to upload and share files directly between devices using WebRTC, with a simple and intuitive interface. Authentication is handled via Clerk, ensuring secure user management.

## Features

- **Peer-to-Peer File Sharing**: Share files directly between users using WebRTC, minimizing server load.
- **User Authentication**: Secure login and signup with Clerk.
- **Real-Time Session Management**: Generate unique codes to connect senders and receivers.
- **Receiver Tracking**: Senders can see a list of joined receivers.
- **Manual Download**: Receivers can download files at their convenience.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation.
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) - Lightweight server for WebSocket signaling.
- **Authentication**: [Clerk](https://clerk.com/) - User management and authentication service.
- **P2P Technology**: [WebRTC](https://webrtc.org/) - Real-time communication for direct file transfers.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for a modern UI.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Clerk](https://clerk.com/) account and API keys

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/bhargav-yarlagadda/file-share.git
cd fileshare
````


### 1.Front end Setup
```bash
d front-end
npm install
````
#### create a .env.local and add your clekr keys to it.
```bash

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR PUBLIC KEY"
CLERK_SECRET_KEY="YOUR CLERK SECRECT KEY

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up


```

#### start the front end server
```bash
npm run dev
```
### 3.backend setup
```bash
cd back-end
npm install
npm start
````


### Access the Application
Open your browser to `http://localhost:3000 `  for the frontend.
The backend runs on `http://localhost:5000` for WebSocket signaling.
