# DestillationApp Frontend

This is the frontend application for DestillationApp, built with Vue 3, TypeScript, Vuex, Vuetify, Apollo Client, and Vite.  
It provides a modern UI for managing distillation processes, plants, results, and user accounts.

---

## 🚀 Features

- **Vue 3 + TypeScript**: Modern, type-safe frontend stack
- **Vuetify**: Material Design UI components
- **Vuex**: Centralized state management
- **Apollo Client**: GraphQL integration
- **Vite**: Fast development and build tooling
- **Sentry**: Error and performance monitoring
- **VitePress**: Auto-generated documentation from code

---

## 🛠️ Project Setup

```sh
npm install
```

### Compiles and Hot-Reloads for Development

```sh
npm run dev
```

### Build for Production

```sh
npm run build
```

### Lint and Fix Files

```sh
npm run lint
```

### Run Unit Tests

```sh
npx vitest run
```

---

## 📚 Documentation

- **Frontend Docs**: [View VitePress Docs](https://destillapp.github.io/destill-app-fullstack/)

To build and preview documentation locally:

```sh
npm run docs:build
npm run docs:dev
```

To generate TypeScript API docs:

```sh
npx typedoc
```

To generate Vue component docs:

```sh
npm run docs:vue
```

---

## 📦 Directory Structure

```
frontend/
  src/            # Source code (components, pages, store, etc.)
  docs/           # VitePress documentation
  public/         # Static assets
  scripts/        # Utility scripts (e.g., doc generation)
  package.json    # Project metadata and scripts
  vite.config.ts  # Vite configuration
  tsconfig.json   # TypeScript configuration

```

---

## ⚙️ Environment Variables

Create a `.env` file in the root with the following (example):

```
VITE_GRAPHQL_URI=YOUR_GRAPHQL_ENDPOINT
VITE_SENTRY_DSN=YOUR_SENTRY_DSN
```

---

## 🐞 Error Reporting

Sentry is integrated for error and performance monitoring.  
Set `VITE_SENTRY_DSN` in your `.env` to enable.

---
