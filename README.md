# Finance Dashboard UI

A frontend-only finance dashboard built with React, TypeScript, Redux Toolkit, and Tailwind CSS.

The project is designed to satisfy the assignment requirements with production-grade structure, reusable components, and clear state management.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Redux Toolkit + React Redux
- Tailwind CSS v4
- Recharts (time-based + categorical charts)
- date-fns (date formatting)

## Run Locally

```bash
npm install
npm run dev
```

Build and checks:

```bash
npm run lint
npm run build
```

## Assignment Coverage

### 1. Dashboard Overview

- Summary cards: total balance, income, expenses
- Time-based visualization: monthly balance trend (area chart)
- Categorical visualization: expense category breakdown (pie chart)

### 2. Transactions Section

- Transaction table includes: date, amount, category, type, description
- Features:
  - Search (description/category)
  - Type filter
  - Category filter
  - Sorting (date/amount/category + asc/desc)
  - Empty state when no data matches filters

### 3. Basic Role-Based UI (frontend simulation)

- Role switcher: viewer/admin
- Viewer: read-only dashboard
- Admin: add/edit transactions via modal form

### 4. Insights Section

- Highest spending category
- Monthly expense comparison
- Net savings rate and observation card

### 5. State Management

Centralized Redux slices:

- transactions slice
- filters slice
- ui slice (role + theme)

Derived data is computed with memoized selectors:

- summary metrics
- filtered/sorted transaction list
- monthly trend series
- category breakdown
- insights calculations

### 6. UI and UX

- Responsive layout across mobile/tablet/desktop
- Styled loading, empty, and error states
- Intentional visual system (custom typography, design tokens, layered background)

## Optional Enhancements Included

- Dark mode with persistence
- Local storage persistence for role, filters, theme, and edited transactions
- CSV and JSON export for current filtered transaction view
- Mock API integration with loading/error flow
- Subtle animations with reduced-motion support

## Project Structure

```text
src/
  app/                  # store and typed hooks
  components/
    common/             # reusable primitives
    controls/           # role/theme controls
    dashboard/          # summary and chart modules
    insights/           # insights cards
    layout/             # shell/layout
    transactions/       # table + modal
  data/                 # static mock dataset
  features/
    filters/            # filter/search/sort state
    selectors/          # memoized derived state
    transactions/       # async load + CRUD reducers
    ui/                 # role/theme state
  pages/                # page-level composition
  services/             # mock API layer
  types/                # domain models
  utils/                # formatting, storage, exports
```

## Mock API Notes

Transactions are fetched from a mock service with simulated latency.

To simulate an API error state for testing:

```js
localStorage.setItem('finance-dashboard:force-api-error', '1')
```

Disable it by removing/resetting the key:

```js
localStorage.removeItem('finance-dashboard:force-api-error')
```

## Assumptions and Trade-offs

- Frontend-only role simulation (no backend auth/RBAC)
- Static mock data with client-side persistence
- No server/database integration by design for assignment scope

## Potential Next Improvements

- Data virtualization for very large transaction datasets
- Route-based code splitting to reduce bundle size
- Unit tests for selectors and reducer logic
