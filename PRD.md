# Product Requirements Document (PRD): Design Desk

## 1. Product Overview
**Name:** Design Desk
**Description:** A lightweight, Canva-inspired design editor for creating graphics, presentations, and templates directly in the browser. It allows users to drag and drop elements, add text, shapes, and images, and export their designs in various formats.
**Architecture:** Microservices
**Tech Stack:** MERN (MongoDB, Express.js, React, Node.js) with TypeScript

## 2. Target Audience
- Content creators needing quick social media graphics.
- Small business owners designing marketing materials.
- Students and educators creating presentations.
- Anyone looking for an accessible, no-install graphic design tool.

## 3. Architecture Design (MERN Microservices)

To ensure scalability, maintainability, and independent deployment, the system will be built using a microservice architecture.

### 3.1. Services Breakdown

1.  **Frontend App (Client)**
    *   **Tech:** Next.js (React), Zustand (State Management), React Konva (Canvas rendering), TypeScript.
    *   **Role:** The user interface, handling the canvas, drag-and-drop, and interactions.

2.  **API Gateway (BFF - Backend for Frontend)**
    *   **Tech:** Node.js, Express.js, Nginx (optional routing).
    *   **Role:** Single entry point for the frontend. Handles request routing, rate limiting, and aggregating responses from multiple microservices.

3.  **Authentication & User Service**
    *   **Tech:** Node.js, Express.js, MongoDB.
    *   **Role:** Handles user registration, login (JWT/OAuth), profile management, and session validation.
    *   **Database:** `Users` DB.

4.  **Project (Design) Service**
    *   **Tech:** Node.js, Express.js, MongoDB.
    *   **Role:** Manages design documents, saving canvas state (JSON format), retrieving user projects, and handling project metadata (title, dimensions, timestamps).
    *   **Database:** `Projects` DB.

5.  **Asset & Media Service**
    *   **Tech:** Node.js, Express.js, ImageKit (Storage).
    *   **Role:** Handles uploading, storing, and retrieving images, icons, and fonts. Generates thumbnails.
    *   **Database:** `Assets` DB (metadata only, files in ImageKit).

6.  **Template Service**
    *   **Tech:** Node.js, Express.js, MongoDB.
    *   **Role:** Serves predefined templates to users. Manages categories and template search.
    *   **Database:** `Templates` DB.

7.  **Export/Render Service (Optional/Phase 2)**
    *   **Tech:** Node.js, Puppeteer/Playwright or native canvas drawing libraries.
    *   **Role:** Handles high-quality background rendering of designs to PDF, high-res PNG/JPEG, taking the load off the client-side for complex exports.

## 4. Core Features

### 4.1. User Management
- Sign up / Log in (Email & Password, Google OAuth).
- Password reset.
- User profile (Name, Avatar).

### 4.2. Workspace & Dashboard
- View recent designs.
- Create new design (custom dimensions or preset sizes like "Instagram Post").
- Folders/Organization for designs.
- Browse template library.

### 4.3. Canvas Editor (The Core)
- **Interactive Canvas:** A central work area to construct designs.
- **Element Manipulation:**
    - Drag, drop, resize, rotate, and delete elements.
    - Layer management (Bring to front, send to back).
    - Grouping/Ungrouping elements.
- **Text Tool:**
    - Add text boxes.
    - Change fonts, sizes, colors, alignment, and styles (bold, italic, underline).
- **Shapes Tool:**
    - Add basic shapes (rectangles, circles, lines).
    - Customize fill color, stroke color, and stroke width.
- **Image Tool:**
    - Upload personal images.
    - Browse a library of stock photos/icons (via Asset Service).
    - Apply basic filters or crop (MVP: simple resizing).
- **Background Tool:**
    - Set solid colors or background images.

### 4.4. Saving & Export
- **Auto-save:** Periodically save the canvas state (JSON) to the backend.
- **Manual Save:** Explicit save button.
- **Export:** Download design as PNG, JPEG, or PDF (handled client-side for MVP, server-side later).

## 5. Technology Stack Details

-   **Frontend:**
    -   Next.js (React framework for the application and landing pages)
    -   Tailwind CSS (Styling)
    -   React Konva (Canvas Engine)
    -   Axios (API requests)
    -   Zustand (State Management)
    -   TypeScript (Strict typing)
-   **Backend:**
    -   Node.js with Express.js (for all microservices)
    -   Mongoose (ODM for MongoDB)
    -   JWT (JSON Web Tokens) for auth
    -   Multer (File uploads)
-   **Database:**
    -   MongoDB (Atlas recommended)
-   **Storage:**
    -   ImageKit for user uploads and template thumbnails.
-   **Infrastructure (DevOps):**
    -   Docker (Containerization of services)
    -   Docker Compose (Local orchestration)

## 6. High-Level Database Schema (MongoDB)

### User Service (`users` collection)
- `_id`: ObjectId
- `name`: String
- `email`: String (Unique)
- `passwordHash`: String
- `createdAt`: Date

### Project Service (`projects` collection)
- `_id`: ObjectId
- `userId`: ObjectId (Ref to User)
- `title`: String
- `dimensions`: { width: Number, height: Number }
- `canvasState`: JSON (The serialized React Konva node tree)
- `thumbnailUrl`: String
- `updatedAt`: Date

### Asset Service (`assets` collection)
- `_id`: ObjectId
- `userId`: ObjectId (Ref to User, null if public/system asset)
- `type`: String ('image', 'icon', 'font')
- `url`: String (ImageKit URL)
- `tags`: [String]

## 7. Inter-Service Communication

-   **Synchronous:** API Gateway communicates with underlying services via REST/HTTP for standard CRUD operations.
-   **Asynchronous (Future):** Implement a message broker (RabbitMQ or Kafka) for events like `UserCreated` (to initialize default projects) or `ProjectExportRequested` (to trigger the background render service).

## 8. MVP Implementation Phases

**Phase 1: Foundation & The Editor (Client-side heavy)**
- Setup Next.js frontend with Canvas library (React Konva).
- Implement basic shapes, text, and local image insertion.
- Client-side export to PNG.

**Phase 2: Backend Integration & Persistence**
- Setup API Gateway, Auth Service, and Project Service.
- Implement User Login/Registration.
- Implement saving and loading `canvasState` JSON to/from MongoDB.
- Build the user dashboard.

**Phase 3: Assets & Templates**
- Build Asset Service with ImageKit integration for user uploads.
- Implement the Template Service and populate initial templates.

**Phase 4: Advanced Features**
- Advanced canvas tools (grouping, locking layers, custom fonts).
- Export Service for high-fidelity PDFs.
