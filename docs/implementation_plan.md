# Detailed Implementation Plan: Design Desk

This document breaks down the development of Design Desk into a step-by-step actionable roadmap. 

## Phase 1: Project Initialization & Infrastructure

**Goal:** Set up the foundational repository structure, tooling, and database environments.

*   **Step 1.1: Monorepo Setup (Optional but Recommended)**
    *   Initialize a root `package.json`.
    *   Set up a workspace (e.g., using npm workspaces, Yarn, or Turborepo) to manage the frontend and multiple backend services in one repository.
*   **Step 1.2: Frontend Initialization**
    *   Initialize the Next.js application: `npx create-next-app@latest frontend --typescript --tailwind --app --eslint`
    *   Install core frontend dependencies: `zustand`, `react-konva`, `konva`, `lucide-react`, `axios`.
*   **Step 1.3: Local Environment Setup**
    *   Create a `docker-compose.yml` in the root to spin up a local MongoDB instance.
    *   Set up baseline `.env` templates for the frontend and upcoming backend services.

## Phase 2: Frontend Foundation (The Canvas Editor)

**Goal:** Build the core client-side rendering engine without relying on the backend yet.

*   **Step 2.1: UI Shell & Layout**
    *   Create the main editor layout: Left Sidebar (Tools), Top Header (Actions/Export), Right Sidebar (Properties/Settings), and the central Canvas Container.
*   **Step 2.2: Zustand State Architecture**
    *   Create a `useEditorStore` to manage:
        *   `canvasNodes`: Array of discriminated union objects representing shapes/text/images.
        *   `selectedNodeId`: Currently selected element for transformation.
        *   `activeTool`: Current tool selected (cursor, shape, text).
*   **Step 2.3: React Konva Integration**
    *   Implement the `CanvasEditor` component using `next/dynamic` with `{ ssr: false }`.
    *   Set up the Konva `Stage` and `Layer` dynamically mapping over `canvasNodes` from the store.
*   **Step 2.4: Core Drawing Tools**
    *   Implement adding basic shapes (Rectangle, Circle).
    *   Implement adding Text elements.
    *   Ensure added elements append to the Zustand store.
*   **Step 2.5: Selection & Transformation**
    *   Implement the Konva `Transformer` component.
    *   Bind click events to nodes to set `selectedNodeId`.
    *   Update node properties (x, y, width, height, rotation) in the Zustand store when dragged or transformed.

## Phase 3: Backend Core Services

**Goal:** Build the independent microservices required for authentication and project saving.

*   **Step 3.1: API Gateway (BFF)**
    *   Initialize an Express.js project.
    *   Set up basic routing/proxying rules (e.g., routing `/api/auth` to the Auth service).
    *   Implement CORS and rate limiting.
*   **Step 3.2: Auth Service**
    *   Initialize an Express.js project with Mongoose.
    *   Create `User` schema.
    *   Implement `POST /register` and `POST /login` endpoints.
    *   Implement JWT generation and validation middleware.
*   **Step 3.3: Project Service**
    *   Initialize an Express.js project with Mongoose.
    *   Create `Project` schema (must include `canvasState` as JSON and `userId`).
    *   Implement CRUD endpoints: `POST /projects` (Create), `GET /projects` (List user projects), `GET /projects/:id` (Load project), `PUT /projects/:id` (Update canvas state).

## Phase 4: Integration & Data Persistence

**Goal:** Connect the Next.js frontend to the microservices.

*   **Step 4.1: Frontend Authentication**
    *   Create Login and Registration pages in Next.js.
    *   Create an `useAuthStore` in Zustand to hold the JWT and User data.
    *   Implement Axios interceptors to attach the JWT to all outward requests.
*   **Step 4.2: The Dashboard**
    *   Build a dashboard UI to display the user's saved designs.
    *   Fetch data from the Project Service via the API Gateway.
*   **Step 4.3: Saving & Loading Canvas State**
    *   Wire up the "Save" button in the editor to send the current Zustand `canvasNodes` array to the Project Service.
    *   When opening a project from the dashboard, fetch the project data and hydrate the Zustand store.

## Phase 5: Media, Assets, and Export

**Goal:** Implement image handling and final export capabilities.

*   **Step 5.1: Asset Service & ImageKit Integration**
    *   Initialize the Asset Service (Express.js).
    *   Integrate the ImageKit Node.js SDK.
    *   Implement a `POST /upload` endpoint that receives an image (via Multer), uploads it to ImageKit, and returns the optimized URL.
*   **Step 5.2: Frontend Image Implementation**
    *   Add an "Upload Image" tool to the editor sidebar.
    *   Send the selected file to the Asset Service.
    *   Upon receiving the ImageKit URL, add a new `ImageNode` to the Zustand canvas store.
    *   Render the image on the Konva layer using the `useImage` hook.
*   **Step 5.3: Client-Side Export**
    *   Implement an "Export" button.
    *   Use Konva's `stage.toDataURL()` method to generate a PNG/JPEG of the canvas.
    *   Trigger a browser download of the generated file.

## Phase 6: Polish & Advanced Features (Post-MVP)

*   **Step 6.1:** Add "Undo/Redo" functionality to the Zustand store (using history states).
*   **Step 6.2:** Implement advanced text editing (fonts, alignment, colors) via the Properties sidebar.
*   **Step 6.3:** Integrate the Template Service to allow users to start from pre-designed layouts.
