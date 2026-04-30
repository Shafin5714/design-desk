# Technology Stack: Design Desk

## Frontend
- **Framework:** Next.js (React) with TypeScript
- **Styling:** Tailwind CSS (Vanilla CSS where Tailwind falls short)
- **Canvas Engine:** React Konva (A React wrapper for the Konva.js 2D canvas library).
- **State Management:** Zustand (for lightweight global state).
- **HTTP Client:** Axios or native Fetch API.

## Backend (Microservices)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM/ODM:** Mongoose

## Database & Storage
- **Primary Database:** MongoDB
- **File Storage:** ImageKit (for user uploads, templates, and exported renders).

## Infrastructure & DevOps
- **Containerization:** Docker & Docker Compose (for local multi-service orchestration).
- **Authentication:** JSON Web Tokens (JWT).

## AI Agent Notes
- **React Konva in Next.js:** Konva relies on the browser's `window` object. Any Next.js component importing `react-konva` MUST be rendered exclusively on the client. Use Next.js dynamic imports with `{ ssr: false }` for canvas components.
- **Microservice Boundaries:** Do not mix concerns. For example, the `Project Service` should not handle user password hashing; that belongs strictly in the `Auth Service`.
