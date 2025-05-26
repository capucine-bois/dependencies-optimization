This repo demonstrates two setups for library packaging (`shared`) and how it impacts the bundle size of the consumer (`package`) :

- `non-optimized` — **duplicated dependencies**, larger bundle
- `optimized` — **shared peerDependencies**, smaller bundle

---

## 📁 Structure

```
├── optimized/
│   └── packages/
│       ├── shared/
│       └── package/
├── non-optimized/
│   └── packages/
│       ├── shared/
│       └── package
```

---

## 🚀 Setup Instructions

### 1. Install dependencies

From root of each project (`optimized` or `non-optimized`):

```bash
npm install
```

### 2. Build packages

```bash
npm run build
```

---

# 📦 `non-optimized`

### 🔍 Problem Scenario

- Both packages depend directly on `react 18`
- No use of `external` in Rollup
- Bundle size increases due to duplicated React

### 📁 File: `packages/shared/package.json`

```json
{
  "name": "shared",
  "version": "1.0.0",
  "main": "dist/shared.mjs",
  "type": "module",
  "scripts": {
    "build": "rollup -c"
  },
  "dependencies": {
    "react-dom": "^19.0.0",
    "react": "^19.0.0"
  },
  "devDependencies": {}
}
```

### 📁 File: `packages/shared/rollup.config.js`

```jsx
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: [
    { file: "dist/shared.cjs", format: "cjs" },
    { file: "dist/shared.mjs", format: "es" },
  ],
  plugins: [resolve(), commonjs()],
  external: [],
};
```

---

# ✅ `optimized`

### ✅ Solution

- `shared` lists `react 18` as a **peerDependency**
- `react 18` is marked as **external** in Rollup
- Final consumer (`package`) provides `react 18`
- Bundle is smaller and no duplication

### 📁 File: `packages/shared/package.json`

```json
{
  "name": "shared",
  "version": "1.0.0",
  "main": "dist/shared.mjs",
  "type": "module",
  "scripts": {
    "build": "rollup -c"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  },
  "dependencies": {
    "react-dom": "^19.0.0",
    "react": "^19.0.0"
  },
  "devDependencies": {}

```

### 📁 File: `packages/shared/rollup.config.js`

```jsx
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: [
    { file: "dist/shared.cjs", format: "cjs" },
    { file: "dist/shared.mjs", format: "es" },
  ],
  plugins: [resolve(), commonjs()],
  external: ["react"],
};
```

---

## 📊 Result Comparison

| Project       | `package` Size |
| ------------- | -------------- |
| Non-Optimized | **28.85KB**    |
| Optimized     | **9.02KB 🔻**  |

Use [vite-bundle-visualizer](https://github.com/btd/vite-plugin-visualizer) under `package` and `shared`for bundle breakdowns on both projects:

```bash
npx vite-bundle-visualizer
```

<aside>
💡

You can also directly open the `**-visualization.html` files

</aside>

## Bundle result for : Non-optimized library used in `package` consumer

### `package` : 28.85KB

![image](https://github.com/user-attachments/assets/2b6cddab-a135-4925-bd77-166bf5b48b5d)

Explanation :

- **`shared` will bundle its own copy** of React 18 because it's in `dependencies`.
- **`package` will bundle its own copy** of React 18 as well (from its `node_modules`).
- Even though they use the same version **semantically**, each package treats it as **isolated**.

---

## Bundle result for : Optimized library used in `package` consumer

### `package` : 9.02KB

![image](https://github.com/user-attachments/assets/47c0ce63-e97a-492f-aced-dc7e7c0276fa)

Explanation:

- When bundling `shared`, the bundler:
  - **Does not include React in the bundle**.
  - Instead, it **assumes React will be present in the consumer environment**.
- The `package` (consumer app) already has React, so it satisfies the peer dependency of `shared`.
- Only **one copy of React** is included — the one from `package`.
- `shared` and `package` now **share the same React instance**.

---

## 🧠 Conclusion

> Every dependency you pull into a shared library must be reviewed:

- Use `peerDependencies` for shared packages like React
- Always set `external` for peer deps in Rollup
- Avoid re-bundling large libs like React
