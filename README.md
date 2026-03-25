# Velozity Project Tracker

A high-performance project management UI built for the Velozity technical assessment.

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Open `http://localhost:5173` in your browser.

## Tech Stack & Decisions
- **Framework:** React + TypeScript + Vite.
- **Styling:** Tailwind CSS with a custom design system based on HSL variables for maximum flexibility and a premium feel.
- **State Management:** **Zustand** was chosen for its lightweight nature and ease of managing complex nested states like 500+ tasks and real-time collaboration indicators without the boilerplate of Redux.
- **Icons:** Lucide React for consistent, high-quality SVG icons.

## Core Implementations

### Custom Drag-and-Drop
Implemented from scratch using **Pointer Events** (`pointerdown`, `pointermove`, `pointerup`). This approach was chosen over HTML5 Drag and Drop to ensure:
- Smooth transitions and a floating "ghost" element that follows the cursor.
- Native-feeling touch support for tablets.
- Precise control over layout shift; a placeholder is rendered in the original position to maintain column height.
- Smooth "snap-back" animations on invalid drops.

### Virtual Scrolling
Built a custom **VirtualList** component to handle the 500+ task dataset in the List View.
- It calculates the visible range based on the container's `scrollTop` and `clientHeight`.
- Only items within the viewport (plus a configurable buffer) are rendered in the DOM.
- Absolute positioning is used within a relative container to maintain correct scroll height and position.
- Uses `ResizeObserver` to handle dynamic container resizing seamlessly.

### Live Collaboration
Simulated via a custom `useCollaboration` hook that periodically moves "other users" (mocked via active user IDs) between tasks in the store. The UI reflects this with floating avatars on task cards, stackable with overflow indicators when multiple users view the same task.

## Performance
- **Lighthouse Score:** Targeted 85+ on Desktop.
- Optimized rendering via custom virtual scrolling.
- Minimal re-renders through targeted Zustand selectors and memoized components.

---

*Built by Antigravity AI for Velozity Global Solutions.*
