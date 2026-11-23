# Finora — Web Frontend

Neo-fintech personal finance command center built with React 19, TypeScript, Three.js, TailwindCSS, and Vite.

---

## 🚀 Running the Web Application

### Prerequisites
- **Node.js**: v18.0.0+ (v20+ recommended)
- **npm** (or `pnpm` / `yarn`)
- Browser with **WebGL 2.0 / Hardware Acceleration** enabled (Chrome, Edge, Brave, Firefox, Safari)

### Step-by-Step Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Local Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to **[http://localhost:5173](http://localhost:5173)**

---

## 📜 Available Scripts

- `npm run dev`: Launch development server with Hot Module Replacement (HMR).
- `npm run build`: Compile TypeScript and build for production into `dist/`.
- `npm run preview`: Locally preview the production build at `http://localhost:4173`.
- `npm run lint`: Run Oxlint checks.

---

## 🔧 Troubleshooting

- **Port in use**: Run on another port:
  ```bash
  npm run dev -- --port 3000
  ```
- **3D Canvas not rendering**: Verify WebGL & Hardware Acceleration is turned ON in browser settings (`chrome://settings/system`).
