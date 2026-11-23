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

##  Getting Started

### 1. Frontend Setup

Ensure you have **Node.js (v18+)** installed.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Backend MCP Server Setup

The standalone MCP server enables AI agents (Claude Desktop, Cursor, etc.) to query Finora's financial engine over standard I/O (`stdio`).

```bash
# Navigate to mcp-server directory
cd mcp-server

# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Start the MCP server
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
