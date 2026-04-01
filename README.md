# Finance Dashboard UI

An evaluation-focused finance dashboard built with React, TypeScript, Redux Toolkit, and Tailwind CSS.

This project demonstrates production-style frontend architecture with reusable components, centralized state management, role-aware interactions, interpreted insights, and polished UI behavior.

## Why This Submission Stands Out

- Insight intelligence instead of raw metrics only
  - Interprets spending change month-over-month
  - Compares savings versus previous month in human-readable language
  - Recommends focus areas based on spending concentration and savings health
- Meaningful RBAC simulation on the frontend
  - Admin can add transactions, edit inline, and delete records
  - Viewer sees action controls but they are disabled with clear explanations
- Professional UX polish
  - Intentional spacing and typography system
  - Animated charts and hover transitions
  - Responsive layout and graceful empty/error/loading states

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Redux Toolkit + React Redux
- Tailwind CSS v4
- Recharts
- date-fns
- lucide-react

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL shown in terminal (typically http://localhost:5173).

## Quality Checks

```bash
npm run lint
npm run build
```

## Feature Matrix (Assignment Mapping)

### 1) Dashboard Overview

- Summary cards for:
  - Total Balance
  - Income
  - Expenses
- Time-based visualization:
  - Monthly balance trend area chart
- Categorical visualization:
  - Expense category breakdown pie chart

### 2) Transactions Section

- Table fields:
  - Date
  - Description
  - Category
  - Type
  - Amount
- Interactions:
  - Search by description/category
  - Filter by type/category
  - Sort by date/amount/category + direction toggle
  - Reset filters
  - Export filtered view to CSV and JSON
  - Graceful empty result state

### 3) Role-Based UI (Simulated)

- Role switcher: Viewer / Admin
- Viewer:
  - Read-only mode
  - Add/Edit/Delete controls remain visible but disabled
  - Explanation messages clarify permission constraints
- Admin:
  - Add new transaction (modal form)
  - Edit transactions inline directly in table rows
  - Delete transactions with confirmation

### 4) Insights Section (Interpreted Data)

Not just display, but interpretation:

- Spending intelligence:
  - "Your spending increased/decreased by X% (amount) vs last month"
- Savings intelligence:
  - "You saved X more/less compared to last month"
- Category risk signal:
  - Highest spending category and share of total spend
- Recommendation engine:
  - Contextual focus suggestion based on current financial behavior

### 5) State Management

Redux store slices:

- transactions
- filters
- ui

Memoized selectors drive derived UI and analytics:

- Summary totals
- Filtered/sorted transaction list
- Monthly trend series
- Category breakdown
- Insight intelligence fields and recommendations

### 6) UI/UX Expectations

- Responsive desktop/tablet/mobile layout
- Design tokens for spacing, typography, and color system
- Interactive card and table hover states
- Animated chart rendering + reduced-motion fallback
- Loading skeletons, empty states, and API error retry handling

## Optional Enhancements Included

- Dark mode with persistence
- localStorage persistence for role, theme, filters, and transactions
- Mock API integration with simulated latency and optional forced failure
- CSV and JSON export of current filtered data
- Subtle motion and micro-interactions

## Architecture

```text
src/
  app/
    hooks.ts
    store.ts
  components/
    common/         # primitives (Card, Button, states, headers)
    controls/       # role + theme controls
    dashboard/      # summary cards + charts
    insights/       # interpreted intelligence panels
    layout/         # app shell
    transactions/   # filterable table + inline edit + add modal
  data/
    mockTransactions.ts
  features/
    filters/
    selectors/
    transactions/
    ui/
  pages/
  services/
  types/
  utils/
```

## RBAC Demo Flow

1. Start in Viewer role.
2. Go to Transactions section.
3. Observe Add/Edit/Delete controls are disabled and explained.
4. Switch to Admin role.
5. Add a transaction, edit a row inline, then delete one row.
6. Refresh page and confirm persistence.

## Mock API Behavior

Transactions are fetched from a mocked async service.

Force API failure for testing:

```js
localStorage.setItem('finance-dashboard:force-api-error', '1')
```

Restore normal behavior:

```js
localStorage.removeItem('finance-dashboard:force-api-error')
```

## Assumptions and Trade-offs

- Frontend-only RBAC simulation (no backend auth enforcement)
- Static seeded mock data + client persistence
- Optimized for assignment evaluation, architecture clarity, and UX quality

## Future Improvements

- Unit tests for selectors and reducers
- Integration tests for role-based interaction flows
- Transaction pagination/virtualization for large datasets
- Optional backend sync mode
