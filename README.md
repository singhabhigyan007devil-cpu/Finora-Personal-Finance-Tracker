# FINORA — Futuristic 3D Personal Finance & Subscription Tracker

> **Finora** is an intelligent, neo-fintech financial command center with cinematic 3D environments, spatial interfaces, holographic data visualizations, and an integrated **Model Context Protocol (MCP)** backend server.

---

##  Features

- **Cinematic 3D WebGL Background**: Continuous real-time 3D rendered financial core featuring an interactive minted currency medallion (`₹` & `$`) and orbiting world coins (`€`, `£`, `₿`, `¥`) with smooth mouse parallax and scroll tracking.
- **Neo-Fintech Design System**: Emerald holographic accents (`#70E0A0`), deep space background (`#070B09`), Space Grotesk / Inter typography, and layered spatial panels.
- **Financial Operating System**:
  - **Dynamic Dashboard**: Net worth tracking, income vs. expense cash flow, recent activity, and quick actions.
  - **Expense Tracker**: Categorized outlays, search & filtering, real-time modal transaction entry.
  - **Subscription Command Center**: Renewal timeline countdowns, monthly burn rate analysis, and one-click smart optimization to cancel zombie services.
  - **Smart Budgets**: Category threshold tracking with live visual progress indicators and budget health alerts.
  - **Deep Analytics**: Category donut breakdowns, monthly spending trajectory bars, and savings rate metrics.
- **In-App AI Assistant**: Intelligent financial assistant capable of analyzing spending trends, detecting recurring bill spikes, and simulating financial advice with zero bank-execution risk.
- **Standalone MCP Server (Backend)**: Built with `@modelcontextprotocol/sdk` to expose secure, read-only tools to LLM interfaces like Claude Desktop, Cursor, or external AI agents.

---

##  Architecture & Project Structure

```text
Finora-Personal-Finance-Tracker/
├── frontend/                     # Modern React + Vite + Three.js application
│   ├── src/
│   │   ├── components/           # UI elements, spatial cards, navigation & charts
│   │   ├── pages/                # LandingPage, Dashboard, Expenses, Subscriptions, AI, etc.
│   │   ├── store/                # Zustand persistent client store
│   │   ├── data/                 # Financial models and initial dataset
│   │   └── utils/                # Currency formatters and date helpers
│   ├── index.html                # Entry HTML with Space Grotesk typography
│   └── vite.config.ts            # Vite build configuration
│
├── mcp-server/                   # Backend Model Context Protocol (MCP) Server
│   ├── src/
│   │   └── index.ts              # MCP server with 7 registered financial tools
│   ├── package.json              # MCP SDK dependencies
│   └── tsconfig.json             # TypeScript configuration
│
└── README.md                     # Project documentation
```

---

## 🚀 How to Run the Web Application

Follow these step-by-step instructions to get the Finora web application up and running on your local machine.

### 📋 Prerequisites

Before starting, ensure your system meets the following requirements:

- **Node.js**: Version **18.0.0 or higher** (Node.js 20+ LTS recommended). Check with:
  ```bash
  node -v
  ```
- **Package Manager**: **npm** (comes with Node.js), **pnpm**, or **yarn**. Check with:
  ```bash
  npm -v
  ```
- **Modern Web Browser**: Chrome, Edge, Firefox, Brave, or Safari with **WebGL 2.0 / Hardware Acceleration** enabled to render the cinematic 3D currency core.

---

### ⚡ Quick Start (Step-by-Step)

#### Step 1: Open Terminal & Navigate to Project
Open your preferred terminal (PowerShell, Command Prompt, Bash, or VS Code integrated terminal) and navigate to the project directory:

```bash
# From the project root, navigate into the frontend folder
cd frontend
```

#### Step 2: Install Dependencies
Install all required Node dependencies (React 19, Three.js, Lucide, TailwindCSS, Zustand, Framer Motion, etc.):

```bash
npm install
```
> **Tip:** If you encounter any dependency conflict warnings, you can also use `npm install --legacy-peer-deps`.

#### Step 3: Launch the Development Server
Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Once launched, you will see a console output similar to:

```text
  VITE v8.3.6  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### Step 4: Open in Your Browser
Click or navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

The application will load with the interactive 3D WebGL currency core, responsive dashboard metrics, smart budgets, and live subscription trackers.

---

### 📦 Production Build & Preview

To test or deploy the optimized production bundle:

```bash
# 1. Typecheck and build the production bundle
npm run build

# 2. Preview the built application locally
npm run preview
```
The preview server will run at `http://localhost:4173/` by default.

---

### 📜 Available Web Scripts

Run these scripts from inside the `frontend/` directory:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server at `http://localhost:5173` with instant HMR. |
| `npm run build` | Compiles TypeScript and creates an optimized production build in `dist/`. |
| `npm run preview` | Spins up a local static server to preview the `dist/` production build. |
| `npm run lint` | Runs ultra-fast Oxlint checks across the codebase. |

---

### 🔧 Troubleshooting & FAQs

- **Port `5173` is already in use:**
  If another process is using port 5173, specify an alternate port:
  ```bash
  npm run dev -- --port 3000
  ```
  Or allow Vite to automatically switch to the next open port.

- **3D Canvas appears blank or lagging:**
  Ensure hardware acceleration is enabled in your browser:
  - **Chrome / Edge / Brave**: Settings → System → Enable *"Use graphics acceleration when available"*.
  - Verify your GPU driver is up to date and WebGL is active via [get.webgl.org](https://get.webgl.org/).

- **Corrupted dependencies or install issues:**
  Clear cache and reinstall cleanly:
  ```bash
  # Windows PowerShell
  Remove-Item -Recurse -Force node_modules, package-lock.json; npm install

  # macOS / Linux
  rm -rf node_modules package-lock.json && npm install
  ```

---

## 🤖 Running the MCP Server (Optional Backend)

If you wish to run the standalone Model Context Protocol (MCP) server alongside the web app for AI agent integration (Claude Desktop, Cursor, etc.):

```bash
# In a separate terminal tab, navigate to the MCP server
cd mcp-server

# Install dependencies & build
npm install
npm run build

# Start the MCP server over stdio
npm start
```

---

##  MCP Server Tools

The MCP backend exposes 7 formal tools:

| Tool Name | Parameters | Purpose |
| :--- | :--- | :--- |
| `get_monthly_spending` | `month, year` | Returns total income, expenses, and net savings. |
| `get_subscription_list` | `status?: 'all' \| 'active'` | Lists active subscriptions, renewal dates, and monthly costs. |
| `get_upcoming_payments` | `days?: number` | Finds bills and renewals due in the next *N* days. |
| `analyse_spending` | `month, year` | Categorizes expenses to find top spending categories. |
| `compare_monthly_expenses`| `month1, year1, month2, year2` | Analyzes month-over-month variances and trends. |
| `get_budget_status` | *(none)* | Checks budget category thresholds and overage alerts. |
| `create_payment_reminder` | `service, reminder_date` | Creates safe simulated bill payment reminders. |

---

##  Tech Stack

- **Frontend**: React 18, Vite, Three.js, Lucide Icons, Zustand, TailwindCSS styling
- **Backend / MCP**: Node.js, TypeScript, `@modelcontextprotocol/sdk`
- **Typography**: Space Grotesk & Inter

---

##  License

MIT License.
