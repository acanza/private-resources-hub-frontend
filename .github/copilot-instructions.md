# Copilot Instructions

## Project Context

This repository contains a React + Vite frontend application written in TypeScript.

Prioritize simple, maintainable, and production-ready frontend code.

---

## General Guidelines

* Use React with TypeScript.
* Prefer functional components and React hooks.
* Keep components small, focused, and reusable.
* Prefer explicit types over implicit or broad types.
* Avoid using `any` unless there is a strong reason.
* Keep business logic separate from UI rendering when practical.
* Avoid unnecessary dependencies.
* Do not introduce new frameworks or major libraries unless explicitly requested.

---

## Code Organization

Use a clear and predictable structure:

```text
src/
├── api/
├── assets/
├── components/
├── hooks/
├── pages/
├── routes/
├── styles/
├── types/
└── utils/
```

Use each folder consistently:

* `api/` for HTTP clients and API-specific functions.
* `components/` for reusable UI components.
* `hooks/` for custom React hooks.
* `pages/` for route-level components.
* `routes/` for routing configuration.
* `types/` for shared TypeScript types.
* `utils/` for generic helper functions.
* `styles/` for global or shared styles.

---

## React Guidelines

* Keep component props typed with `type` or `interface`.
* Prefer derived state over duplicated state.
* Avoid deeply nested component logic.
* Extract reusable logic into custom hooks.
* Avoid side effects during render.
* Use `useEffect` only when synchronizing with external systems.
* Keep forms controlled unless there is a clear reason not to.

---

## TypeScript Guidelines

* Use explicit types for public functions, API responses, and component props.
* Prefer `unknown` over `any` when the type is not known.
* Use union types for finite state values.
* Avoid excessive type complexity.
* Keep shared types in `src/types/` when used across multiple files.

---

## API and Data Fetching

* Keep API calls outside UI components when practical.
* Centralize base URLs and shared request logic.
* Handle loading, success, empty, and error states explicitly.
* Do not expose secrets in frontend code.
* Read environment-specific values from Vite environment variables.
* Remember that all `VITE_` variables are exposed to the browser bundle.

---

## Styling

* Keep styling simple and consistent.
* Prefer local component styles when possible.
* Avoid adding UI libraries unless explicitly requested.
* Use semantic HTML before custom abstractions.
* Ensure basic accessibility for buttons, links, forms, and navigation.

---

## Error Handling

* Show user-friendly error messages.
* Avoid exposing raw technical errors in the UI.
* Log technical details only when useful for development.
* Handle common failure states explicitly instead of silently failing.

---

## Build Quality

Before considering a task complete, make sure:

* The code is readable and maintainable.
* TypeScript types are valid.
* Components have clear responsibilities.
* Unused code and unused imports are removed.
* The app can be built with the standard Vite build command.

---

## Do Not Do

Do not:

* Add unnecessary dependencies.
* Add backend code unless explicitly requested.
* Add server-side rendering unless explicitly requested.
* Store secrets in frontend code.
* Hardcode environment-specific values.
* Use `any` as a shortcut.
* Mix unrelated responsibilities in the same component.
* Over-engineer simple features.
