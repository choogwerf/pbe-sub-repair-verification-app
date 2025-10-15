# PBE Sub Repair & Verification App

This Next.js application provides a simple interface for technicians and site verifiers to track and complete repair tasks for three substations: **CSS092**, **CSS068**, and **CSS023** at the T2D Precast Facility.

## Features

- Tabbed interface for each substation.
- Track tasks with descriptions, notes, and parts needed.
- Mark tasks as completed by the technician and verified by the site.
- Record names of both the technician and the site verifier.
- Add or remove parts associated with each task.
- Add new tasks as needed.
- Progress bar to visualise completion status per substation.
- State is persisted in `localStorage` so progress isn’t lost on page refresh.

## Running locally

Make sure you have **Node.js 18+** installed.

```
bash
npm install
npm run dev
```

Then visit http://localhost:3000.

## Deployment

This project is ready to deploy on Vercel. Import the repository into Vercel and deploy using the **Next.js** preset. No additional build settings are required.
