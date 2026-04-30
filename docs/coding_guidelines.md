# Coding Guidelines for AI Agents

When contributing to **Design Desk**, AI agents must adhere to the following rules to maintain code quality, avoid common pitfalls, and respect the architecture.

## 1. Frontend (Next.js & React Konva)

### Server vs. Client Components
- By default, Next.js App Router uses Server Components.
- The Canvas editor is heavily interactive. Mark any file containing interactive canvas state with `"use client";` at the top.
- **CRITICAL:** `react-konva` cannot be server-side rendered. You must dynamically import the wrapper component that contains `Stage` and `Layer` to avoid `window is not defined` errors.
  ```javascript
  // Example of correct dynamic import in Next.js
  import dynamic from 'next/dynamic';
  const CanvasEditor = dynamic(() => import('./CanvasEditor'), { ssr: false });
  ```

### Styling
- Use **Tailwind CSS** for layout, typography, and standard UI components (sidebars, toolbars).
- Ensure a premium, modern aesthetic. Use subtle shadows, rounded corners, and consistent color palettes.

### State Management
- Use Zustand for global state (e.g., currently selected tool, user session).
- Keep the Konva state (the nodes on the canvas) separate from standard React UI state to avoid unnecessary re-renders. Use Konva's internal state where appropriate or a dedicated store for the canvas JSON tree.

## 2. Backend (Microservices with Express.js)

### Service Independence
- Do not import models from one service into another. If Service A needs data from Service B, it must make an HTTP request to Service B (or via the API Gateway).
- Each service should have its own `.env` file and independent configuration.

### Error Handling
- Use a consistent JSON error response format across all microservices:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Human readable message"
    }
  }
  ```

### Routing
- Prefix all microservice routes with a version and identifier, e.g., `/api/v1/projects/...` or `/api/v1/auth/...`.

## 3. General Development Rules

- **Do not use placeholders:** If implementing a UI, use valid mock data or icons (e.g., Lucide-react) rather than empty `div`s.
- **Always Verify:** After writing code, ensure you check for syntax errors or missing imports, particularly when wiring up new microservices.

## 4. TypeScript Best Practices

- **Strict Mode:** Always ensure `strict: true` is enabled in `tsconfig.json`.
- **No `any`:** Never use the `any` type. If a type is truly unknown, use `unknown` and perform type narrowing before usage.
- **Explicit Interfaces:** Define explicit `interface` or `type` aliases for all:
  - React Component Props
  - API Request Payloads and Responses
  - Zustand Store States
- **Discriminated Unions:** Use discriminated unions for handling the different types of elements on the canvas. 
  ```typescript
  type BaseShape = { id: string; x: number; y: number; };
  type RectShape = BaseShape & { type: 'rect'; width: number; height: number; };
  type TextShape = BaseShape & { type: 'text'; text: string; fontSize: number; };
  type CanvasNode = RectShape | TextShape;
  ```
- **Utility Types:** Utilize TypeScript utility types (`Pick`, `Omit`, `Partial`) instead of duplicating type definitions.
- **Strict Null Checks:** Always account for `null` or `undefined` returns, especially when fetching items from the database or searching for elements in the canvas tree.
