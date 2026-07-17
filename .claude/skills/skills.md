---
name: ui-ux-pro-max
description: Elevates frontend components to a premium, modern SaaS aesthetic (like Stripe or Vercel) while ensuring flawless mobile responsiveness and preserving existing functionality.
---

# UI/UX Pro Max Skill

When the user invokes `/ui-ux-pro-max`, your mission is to completely redesign the requested UI components according to the following strict guidelines.

### 1. Functional Preservation (CRITICAL)
* DO NOT alter any existing state management, `zod` schemas, `react-hook-form` registers, `onSubmit` handlers, or `SWR`/API mutation logic.
* The data payloads sent to the backend must remain exactly the same.
* All existing features must work exactly as they do currently without regressions.

### 2. Premium Desktop UI/UX
* Replace cluttered, boxed-in layouts with clean, breathable spacing (e.g., `gap-6`, `p-8`).
* Group related fields into logical visual cards or sections with subtle borders (`border-zinc-200`) and soft shadows (`shadow-sm`).
* Upgrade all input fields to use sleek, modern styling (e.g., Shadcn UI standards). Focus on clear focus states (`focus:ring-2 focus:ring-indigo-500`) and smooth transitions.
* Ensure buttons have clear visual hierarchy (Primary vs. Secondary/Ghost).

### 3. Mobile-First Optimization
* Ensure all grids (e.g., `grid-cols-2`) gracefully collapse to `flex-col` or `grid-cols-1` on mobile screens (`< sm`).
* Ensure all touch targets (buttons, dropdowns, inputs) are at least `44px` tall (`h-11`) to prevent mobile tap-target issues.
* For any center-screen Modals, implement responsive behavior: they should remain center modals on desktop, but stretch to bottom-anchored sheets (or full-width/full-height overlays) on mobile for better thumb reachability.
* Prevent iOS Safari input auto-zooming by ensuring all text inputs and selects use `text-base` (16px) on mobile.

### 4. Micro-Interactions & Feedback
* Add subtle hover and active states to all clickable elements using Tailwind (e.g., `hover:bg-zinc-50 active:scale-[0.98] transition-all`).
* Ensure all form submissions have clear, disabled loading states with a spinner on the primary action button to prevent double-clicks.
* Use beautiful, modern skeleton loaders for any loading states.

Please output the fully refactored, beautiful, and mobile-responsive `.tsx` code for the requested components when this skill is invoked.
