# MNEMORIX Sentinel — FastAPI Backend

Zero-Trust AI Memory Firewall API — `v2.5.0`

## Quick Start

```bash
cd backend

# Activate the virtual environment (already created)
.\venv\Scripts\Activate.ps1      # Windows PowerShell
# or: source venv/bin/activate   # macOS / Linux

# Add your Gemini API key (optional — heuristic fallback works without it)
# Edit .env and set: GEMINI_API_KEY=your_key_here

# Start the server with hot-reload
.\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Server runs at: **http://localhost:8000**
Interactive docs: **http://localhost:8000/docs**

---

## API Endpoints

### Core Inspection
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/sentinel/inspect` | 3-layer memory threat inspection (L1+L2+L3) |

### Agents
| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/agents` | List all agents |
| `POST` | `/api/agents` | Create new agent |
| `GET`  | `/api/agents/{id}` | Get single agent |

### Memories
| Method | Path | Description |
|--------|------|-------------|
| `GET`    | `/api/memories` | List memories (`?agentId=` `?partition=` filters) |
| `POST`   | `/api/memories` | Add verified memory + Merkle block |
| `PATCH`  | `/api/memories/{id}/quarantine` | Quarantine a memory |
| `PATCH`  | `/api/memories/{id}/restore` | Restore a quarantined memory |

### Merkle Chain
| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/blocks` | List all blocks |
| `POST` | `/api/blocks/tamper` | Simulate tamper attack |
| `POST` | `/api/blocks/self-heal` | Restore canonical ledger |
| `POST` | `/api/blocks/audit-integrity` | Validate entire hash chain |
| `POST` | `/api/blocks/reset-empty` | Wipe to genesis only |
| `POST` | `/api/blocks/reset-baseline` | Restore seed data |

### Threats
| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/threats` | List all threat events |
| `POST` | `/api/threats` | Add a threat event |

### Audit Logs
| Method | Path | Description |
|--------|------|-------------|
| `GET`    | `/api/audit-logs` | List logs (`?status=` `?search=` filters) |
| `POST`   | `/api/audit-logs` | Append a log entry |
| `DELETE` | `/api/audit-logs` | Clear all logs |
| `GET`    | `/api/audit-logs/export` | Download as JSON file |

### Policies
| Method | Path | Description |
|--------|------|-------------|
| `GET`   | `/api/policies` | List policies (`?category=` filter) |
| `POST`  | `/api/policies` | Create new policy |
| `PATCH` | `/api/policies/{id}/toggle` | Enable/disable policy |
| `POST`  | `/api/policies/evaluate` | Test payload against active rules |

### Copilot & Stats
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/copilot/chat` | AI chat (Gemini 2.5 Flash + fallback) |
| `GET`  | `/api/kpis` | Aggregated dashboard statistics |

---

## 3-Layer Threat Inspection

```
POST /api/sentinel/inspect
{
  "agentId": "agent_sentinel_alpha",
  "agentName": "SENTINEL-ALPHA",
  "partition": "procedural",
  "content": "..."
}
```

**L1 — Heuristic Pattern Sentinel** (`< 1ms`)
Regex pattern matching against 5 threat categories:
- Indirect Prompt Injection
- Memory Backdoor / Trojan
- Privilege Escalation
- Exfiltration Beacons
- Semantic Drift keywords

**L2 — Vector Cosine Drift Radar** (`< 1ms`)
Simulated cosine distance score. Flags Δ > 0.08 as anomaly.

**L3 — Gemini 2.5 Flash Neural Guard** (`~500ms`)
Full LLM semantic analysis. Only active when `GEMINI_API_KEY` is set in `.env`.

---

## Environment Variables

```env
GEMINI_API_KEY=your_key_here        # Optional — enables L3 Gemini analysis
DATABASE_URL=./mnemorix.db          # SQLite path (default: project root)
FRONTEND_ORIGIN=http://localhost:5173  # CORS allowed origin
```

---

## File Structure

```
backend/
├── main.py              # FastAPI app, CORS, lifespan, router registration
├── models.py            # Pydantic v2 request/response models
├── database.py          # SQLite async layer, table creation, seed data
├── crypto_utils.py      # SHA-256, Merkle root, block signature (matches frontend)
├── presets_data.py      # Initial seed data (agents, memories, threats, policies)
├── requirements.txt     # Python dependencies
├── .env                 # Local environment variables (not committed)
├── routers/
│   ├── sentinel.py      # POST /api/sentinel/inspect
│   ├── agents.py        # GET/POST /api/agents
│   ├── memories.py      # GET/POST/PATCH /api/memories
│   ├── blocks.py        # GET/POST /api/blocks/*
│   ├── threats.py       # GET/POST /api/threats
│   ├── audit.py         # GET/POST/DELETE /api/audit-logs
│   ├── policies.py      # GET/POST/PATCH /api/policies
│   ├── copilot.py       # POST /api/copilot/chat
│   └── kpis.py          # GET /api/kpis
└── venv/                # Python virtual environment
```
