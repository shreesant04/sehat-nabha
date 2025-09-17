# Sehat Nabha — Telemedicine Prototype (Hackathon)

A bilingual (English/Punjabi) telemedicine platform for rural Nabha, Punjab. Features:
- Patient web/mobile app: registration (Phone/Aadhaar), appointment booking, video consults, prescriptions, reports, SOS
- Doctor web app: dashboard, accept/reject consults, start video, digital prescriptions
- AI Chatbot (EN/PA) for basic triage
- Video: Jitsi Meet (public `meet.jit.si`)
- Backend: Node.js + Express + Firebase Admin (Firestore)
- Offline support: SMS booking webhook (Twilio)
- Hosting-ready (Vercel/Netlify for web, Render/Heroku for server, Expo for mobile)

## Monorepo
- `web/` React + Firebase client
- `server/` Node + Express + Firebase Admin
- `mobile/` React Native (Expo) app

## Prerequisites
- Node 18+
- Yarn or npm
- Firebase project with Firestore
- (Optional) Twilio account for SMS
- (Optional) Google Cloud Translate API key

## Environment Variables
Copy `.env.example` to `.env` files at root of `server/` and `web/`.

## Quick Start

### 1) Server (Express)
- In `server/`, create `serviceAccountKey.json` (Firebase Admin):
  - Download from Firebase Console > Project Settings > Service accounts.
- `cd server && npm i && npm run dev`
- Server runs on `http://localhost:4000`

### 2) Web App (React)
- `cd web && npm i && npm run dev`
- App runs on `http://localhost:5173`

### 3) Mobile App (Expo)
- Install Expo CLI: `npm i -g expo`
- `cd mobile && npm i && npx expo start`
- Run on a device/emulator. Uses the same Firestore collections and Jitsi rooms as web.

## Data Model (Firestore)
Collections:
- `users/{uid}`: { role: "patient"|"doctor"|"asha", name, phone, aadhaar? }
- `appointments/{id}`: { patientId, doctorId, status: "pending"|"accepted"|"rejected"|"completed", scheduledAt, reason, jitsiRoom, createdAt }
- `prescriptions/{id}`: { appointmentId, doctorId, patientId, drugs: [{name, dose, freq, days}], notes, createdAt }
- `reports/{id}`: { patientId, fileUrl, type, uploadedAt }
- `sos_logs/{id}`: { userId, lat, lng, createdAt }

## Jitsi Rooms
- Public `meet.jit.si`, room name = `appointment-{appointmentId}`
- Web uses Iframe API, Mobile uses WebView to same URL.

## SMS Booking (Twilio)
- Configure Twilio webhook to POST to `POST /api/sms/webhook`
- Format: "BOOK <DATE> <TIME> <REASON>"
- Server creates a pending appointment and replies with a confirmation SMS.

## i18n
- `web/src/i18n.ts`: English (`en`) and Punjabi (`pa`) strings
- Toggle language in UI.

## Security/Notes
- Do not commit real secrets. Use `.env`.
- Aadhaar integration is mocked for hackathon (format validation only).
- For production, add Firestore Security Rules, auth checks, and rate limiting.

## Deployment
- Web (Vercel/Netlify): set Firebase env in client or embed config
- Server (Render/Heroku): set Firebase Admin envs and Twilio creds
- Mobile: Expo build

## License
MIT (for hackathon/demo use)
