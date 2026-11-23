# FINORA Model Context Protocol (MCP) Server

FINORA's official Model Context Protocol (MCP) server provides autonomous LLM agents with structured, read-only and simulation-safe interfaces into user financial telemetries.

## Architecture

```
Agent (Claude / Gemini) ──[MCP over Stdio]──▶ FINORA MCP Server ──▶ Controlled Ledger Sandbox
```

### Safety Principles
1. **Zero Financial Execution:** The MCP server strictly forbids automated debit, wire, or fund-movement capabilities.
2. **Explicit Parameter Validation:** JSON schema constraints protect against malicious input patterns.
3. **Auditable Simulation:** Sensitive state manipulations (such as payment reminders) are labeled with human-in-the-loop audit logs.

## Available MCP Tools

| Tool Name | Parameters | Description |
|-----------|------------|-------------|
| `get_monthly_spending` | `month: number, year: number` | Returns total inflow, outflow, and net balance |
| `get_subscription_list` | `status?: 'all'\|'active'\|'cancelled'` | Lists recurring subscriptions with cost summary |
| `get_upcoming_payments` | `days?: number` (default 30) | Scans renewals scheduled within N days |
| `analyse_spending` | `month: number, year: number` | Evaluates category shares and top outlays |
| `compare_monthly_expenses` | `month1, year1, month2, year2` | Calculates month-over-month expenditure velocity |
| `get_budget_status` | _none_ | Checks category budget utilization and breach warnings |
| `create_payment_reminder` | `service: string, reminder_date: string` | Registers simulated alert without real banking transfers |

## Running the Server

```bash
cd mcp-server
npm install
npm run build
npm start
```
