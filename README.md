# Enterprise Income Tracker

A small Vite + React app for registering and managing income categories. Built with functional components, hooks, and Bootstrap 5.

## Live Demo

Deployed on Vercel: **[ADD LINK HERE]**

## Features

- Add a category with a name and description
- Inline validation: checks on blur, and re-checks while typing once a field is flagged
- Delete a single category or delete all
- Empty-state message when the list is empty
- "Delete All" is disabled while the list is empty
- Gamified UI: earn 10 XP per category, level up every 50 XP, unlock badges at 1, 5 and 10 categories, with a reward toast
- Categories and game progress are saved in the browser (localStorage)

## Getting Started

Requires Node.js 18 or later.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |

## Deploying to Vercel

1. Push this folder to a GitHub repository. `package.json` and `index.html` must be at the repo root.
2. In Vercel, choose **Add New > Project** and import the repo.
3. Use these settings (Vercel normally detects them automatically):
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: the folder that contains `package.json` (leave as `./` if it is at the repo root)
4. Click **Deploy**.

## Project Structure

```
src/
├── main.jsx                  # Entry point, loads Bootstrap and styles
├── App.jsx                   # Page layout and top-level state
├── components/
│   ├── GameHud.jsx           # Level, XP bar and badges
│   ├── CategoryForm.jsx      # Registration form
│   ├── FormField.jsx         # Reusable validated input
│   ├── CategoryTable.jsx     # Table card with Delete All
│   ├── CategoryRow.jsx       # Single category row
│   └── EmptyRow.jsx          # "No categories" placeholder
├── hooks/
│   ├── useLocalStorage.js    # useState that persists to localStorage
│   ├── useGameStats.js       # XP, level, badges
│   ├── useCategories.js      # Add, delete, and clear the list
│   └── useValidatedField.js  # Field value, validation status, and focus
└── styles/style.css          # Custom styles on top of Bootstrap
```

## Notes

- Data is saved in your browser's localStorage, so it survives refreshes but is per browser and per device. It is not stored on GitHub or Vercel.

---

## AI Disclosure & Code Defense

### 1. Ideation & Architecture: 100% Human

Every feature, user workflow, UI concept, and piece of structural logic in this project was conceived, planned, and directed entirely by me, the developer. I decided what the app does, how a user moves through it, what the interface looks like, and what rules govern its behavior. This includes the category registration form, the inline validation rules, the per-row and bulk delete actions, the empty-state placeholder, and the "Delete All" disabled rule. All of these were designed and written by me in the original vanilla JavaScript version of this app.

AI did not generate ideas. AI did not decide what features to build.

### 2. Code Implementation: AI-Assisted

AI was used strictly as an execution tool. Given my original HTML, JavaScript, and CSS, plus my explicit instructions (convert to Vite + React, use functional components and hooks, replace DOM manipulation with state, split into reusable components, keep 100% feature parity), the AI generated the React code and syntax. It translated my existing logic into a different framework. It did not add, remove, or redesign any behavior.

### 3. Feature-by-Feature Technical Defense

#### Component tree and data flow

```
App                              owns list state via useCategories()
├── GameHud                      shows level, XP bar, badges (props from useGameStats)
├── CategoryForm                 owns two form fields via useValidatedField() x2
│   └── FormField (x2)           presentational controlled input
└── CategoryTable                receives categories + callbacks, derives isEmpty
    ├── EmptyRow                 shown when list is empty
    └── CategoryRow (xN)         one per category
```

Data flows down through props. Events flow up through callback props (`onAdd`, `onDelete`, `onDeleteAll`). The list lives in `App` (through `useCategories`) because both siblings need it: the form writes to it and the table reads and edits it. Form field state lives inside `CategoryForm` because nothing else needs it.

#### Feature 1: Add a Category

- **State:** `useCategories` holds `categories` in a single `useState([])`. Each item is `{ id, name, description }`.
- **Flow:** the user clicks Save, so `CategoryForm.handleAdd` runs. If both fields pass validation, it calls the `onAdd` prop with trimmed values. That prop is `addCategory` from the hook, passed down by `App`.
- **Immutable update:** `addCategory` uses the functional form `setCategories(prev => [...prev, newItem])`. It never mutates the array, so React sees a new reference and re-renders. The functional form also avoids stale-state bugs.
- **IDs:** `crypto.randomUUID()` gives each item a stable unique ID, used as the React `key` and as the delete target. (This API requires a secure context, which includes `localhost` and HTTPS.)
- **Reset after save:** `name.reset()` and `desc.reset()` clear the value and status, then `name.focus()` returns the cursor to the first field. This replaces the original `input.value = ""`, `clearValidation()`, and `.focus()` calls.
- **Security:** the original needed `escapeHTML()` because it injected strings with `insertAdjacentHTML`. In React, `{category.name}` is rendered as text, so user input can never be interpreted as HTML.

#### Feature 2: Inline Contextual Validation

- **Hook:** `useValidatedField` is a custom hook used once per field. It returns `value`, `status`, `ref`, `onChange`, `onBlur`, `validate`, `reset`, and `focus`.
- **State:** `value` is a string, and `status` is `null` (untouched), `"valid"`, or `"invalid"`. This tri-state replaces `classList.toggle("is-invalid")` and `is-valid`.
- **Rendering:** `FormField` maps `status` to a className (`form-control is-invalid`, `is-valid`, or none). Bootstrap's CSS shows or hides the `.invalid-feedback` message based on that class. No DOM edits are needed.
- **Controlled inputs:** each `<input>` has `value={value}` and `onChange`, so React state is the single source of truth.
- **When validation runs:**
  - *On blur:* `onBlur` calls `validate`, which checks `value.trim() !== ""` and sets the status.
  - *While typing:* `onChange` always updates the value, but it only re-checks when `status === "invalid"`. A field that has not been flagged yet is not nagged, and a flagged field clears its error as soon as valid text appears. This matches the original `input` listener.
  - *On save:* `handleAdd` calls `validate()` on both fields, so both errors appear together. If either fails, it focuses the first invalid field and returns (a guard clause) without adding anything.
- **Refs:** `useRef` is used only for `.focus()`, which cannot be done through state. `FormField` uses `forwardRef` so the parent hook's ref reaches the real `<input>`.
- **`useCallback`:** `validate` depends on `value`, and `onChange` depends on `status`. Their dependency arrays reflect what each function reads, so they never use stale values.

#### Feature 3: Delete a Single Row

- **Flow:** each `CategoryRow` renders a Delete button with `onClick={() => onDelete(category.id)}`. `onDelete` is `deleteCategory`, which runs `setCategories(prev => prev.filter(c => c.id !== id))`.
- **Replaces event delegation:** the original attached one listener to the `<tbody>` and used `event.target.closest("tr").remove()`. React attaches handlers per element and knows which item each row represents, so no DOM traversal is needed. React also manages its own event delegation internally.
- **Keys:** `key={c.id}` lets React match rows to items across renders, so deleting a row removes exactly that row.

#### Feature 4: "Delete All" and Its Disabled State

- **Action:** `deleteAll` calls `setCategories([])`, which replaces `innerHTML = ""`.
- **Derived state:** `CategoryTable` computes `const isEmpty = categories.length === 0` during render and uses it as `disabled={isEmpty}`. This is not stored in separate state, so it cannot get out of sync with the list. It replaces the manual `updateDeleteAllState()` function.

#### Feature 5: Dynamic Empty State

- **Logic:** the table body is `isEmpty ? <EmptyRow /> : categories.map(...)`. It is a conditional render driven by the same `isEmpty` value.
- **Replaces:** `renderEmptyState()`, `removeEmptyState()`, and the `#emptyRow` lookup. The placeholder appears when the last item is deleted, disappears when the first is added, and is correct on first load because the initial list is empty. No initial call is needed.

#### Feature 6: Gamification (XP, Levels, Badges)

- **State:** `useGameStats` keeps `{ xp, totalAdded }` in a persisted `useState`. Everything else (level, progress, badges) is derived during render: `level = floor(xp / 50) + 1`, `xpInLevel = xp % 50`, and each badge is `earned` when `totalAdded >= need`.
- **Flow:** `CategoryForm` calls `onAdd`, which is `App.handleAdd`. It adds the category, then calls `game.awardCategory()`, which updates the stats and returns a message (for example "+10 XP | Level up! You're level 2"). `App` stores it in `toast` state.
- **Progress is earned, not counted:** XP and badges come from `xp` and `totalAdded`, not from the current list length, so deleting rows does not remove progress.
- **Toast:** an effect in `App` starts a 2.5 second timer when `toast` changes and clears it on cleanup. The toast is an object with a `Date.now()` id so two identical messages in a row still re-trigger it.
- **Rendering:** `GameHud` is purely presentational. The XP bar width is `(xpInLevel / xpPerLevel) * 100`, with ARIA progressbar attributes for accessibility.
- **Persistence:** `useLocalStorage` reads once through a lazy `useState` initializer, writes in `useEffect` whenever the value changes, and wraps both in `try/catch` so the app still works if storage is blocked. Both the category list and the stats use it.
- **Styling:** Bootstrap's dark theme (`data-bs-theme="dark"`) plus custom classes in `style.css`. Motion is disabled under `prefers-reduced-motion`.

#### Things I can be asked about

- **Why a custom hook for the list?** It separates data logic from UI, keeps `App` small, and gives one place to add persistence later.
- **Why not store `isEmpty` in state?** It can be calculated from `categories`. Duplicated state can drift out of sync.
- **Is data persisted?** Yes, in the browser's localStorage (categories and game stats). It is not a database, so it does not sync between devices or visitors.
- **What does `StrictMode` do?** In development it renders components twice to surface unsafe side effects. It has no effect in production builds.
