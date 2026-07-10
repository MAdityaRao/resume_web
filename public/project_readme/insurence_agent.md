# AI Insurance Voice Agent Platform

A production-ready AI-powered insurance assistant that enables real-time voice-driven customer interactions for policy management, claims tracking, and support.

## Overview

This system provides an intelligent conversational interface for insurance services. Users can interact via voice or text to:

- Retrieve policy details
- Check claim status
- Understand insurance terms and regulations
- Get premium and payment information

The system uses LLM-based reasoning with structured tool execution, ensuring accurate responses and low latency interactions.

## Architecture

```
Client (Voice/Text)
        |
        v
Speech-to-Text (STT)
        |
        v
LLM Agent (Reasoning + Tool Selection)
        |
        +-- Database Tool (PostgreSQL - Neon)
        |
        +-- Knowledge Tool (IRDAI Regulations)
        |
        v
Text-to-Speech (TTS)
        |
        v
Client Response
```

## Core Components

### AI Agent Layer (src/agent.py)

The main agent orchestrates the conversation flow:

- Uses LiveKit Agents framework for real-time voice communication
- Implements "Arria" persona - an empathetic insurance assistant
- Manages multi-turn conversations with context awareness
- Routes queries to appropriate tools based on user intent

### Database Tool (src/search.py)

Handles all policy and customer data lookups:

- Connects to PostgreSQL database (Neon cloud)
- Fetches customer details, policies, claims, and nominees
- Normalizes spoken policy numbers into database format
- Caches customer data for escalation workflows

### Regulations Tool (src/regulations.py)

Provides Indian insurance regulatory information:

- Health insurance rules (waiting periods, cashless claims, room rent caps)
- Motor insurance regulations (third-party liability, NCB, zero depreciation)
- Term life insurance (Section 45, grace periods, suicide clause)
- General rules (free look period, ombudsman, KYC requirements)

### Escalation Tool (src/escalate.py)

Handles cases requiring human intervention:

- Triggered when customers are angry or request human support
- Updates LiveKit room metadata with escalation details
- Preserves customer context for smooth handoff

## Database Schema

The system uses a normalized PostgreSQL schema with these tables:

- **customers**: Customer contact information
- **policies**: Policy details including type, premium, sum insured
- **claims**: Claim records with status and amounts
- **nominees**: Beneficiary information linked to customers
- **call_logs**: Conversation tracking and resolution status

## Setup Instructions

### Prerequisites

- Python 3.10 or higher
- uv package manager (install via `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- LiveKit Cloud account (for voice infrastructure)
- Neon PostgreSQL database (or local PostgreSQL)
- OpenAI API key (for GPT-4o-mini LLM)

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd mvp_ins
```

### Step 2: Set Up Virtual Environment

```bash
uv venv
source .venv/bin/activate
```

### Step 3: Install Dependencies

```bash
uv pip install -e src/
```

Or install from requirements:

```bash
uv pip install -r src/MVP_INS.egg-info/requires.txt
```

### Step 4: Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
```

Example configuration file is available at `env_ex.txt` for reference.

### Step 5: Set Up LiveKit Cloud

1. Create an account at https://cloud.livekit.io
2. Create a new project
3. Navigate to Settings > API Keys
4. Generate a new API key and secret
5. Update your `.env` file with these credentials

### Step 6: Set Up the Database

The system expects a PostgreSQL database with the schema defined in `DB_schema.txt`. To set up:

1. Create a Neon database at https://neon.tech (or use local PostgreSQL)
2. Run the SQL schema from `DB_schema.txt` to create tables
3. Insert sample data for testing
4. Update connection details in `.env`

### Step 7: Run the Application

```bash
uv run src/agent.py console
```

The agent will start and wait for incoming voice calls through LiveKit.

## How It Works

### Call Flow

1. **Incoming Call**: LiveKit routes incoming voice calls to the agent
2. **Speech-to-Text**: DeepGram Nova-3 converts speech to text
3. **Intent Processing**: GPT-4o-mini analyzes user intent
4. **Tool Execution**: Agent selects and executes appropriate tools
5. **Response Generation**: LLM formulates response based on tool results
6. **Text-to-Speech**: DeepGram Aura-2 converts response to natural speech

### Tool Selection Logic

The agent follows this decision tree:

1. Ask for policy number first
2. If policy number provided -> call `search_customer`
3. If regulatory question -> call `get_regulation`
4. If customer angry or requests human -> call `escalate_to_supervisor`

### Policy Number Normalization

The system handles spoken policy numbers intelligently:

- Converts words to digits ("twenty twenty five" -> "2025")
- Removes spaces and special characters
- Formats as POL-YYYY-NNN

## API Keys and Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| LiveKit | Voice infrastructure | LIVEKIT_URL, API keys |
| DeepGram | STT/TTS | Configured in agent.py |
| OpenAI | LLM | API key via environment |
| Neon | PostgreSQL | DB connection params |

## Testing

Unit tests are located in `src/tests/`:

- `test_esc.py`: Tests escalation tool functionality
- `verify_esc.py`: Verification utilities for escalation

Run tests with:

```bash
uv run pytest src/tests/
```

## Project Structure

```
mvp_ins/
├── src/
│   ├── agent.py          # Main agent entry point
│   ├── search.py         # Database lookup tool
│   ├── regulations.py    # IRDAI rules lookup
│   ├── escalate.py       # Human escalation handler
│   └── tests/            # Test suite
├── .env                  # Environment variables (create from env_ex.txt)
├── DB_schema.txt         # Database schema definition
├── env_ex.txt            # Environment variable template
├── pyproject.toml        # Python project configuration
└── uv.lock              # Dependency lock file
```

## Troubleshooting

### Connection Issues

- Verify all environment variables are set correctly
- Check LiveKit project is active and API keys are valid
- Ensure database accepts connections from your IP

### Tool Execution Failures

- Check database connection pool status in logs
- Verify policy number format matches database records
- Review agent logs for specific error messages

### Audio Quality Issues

- Test with different network connections
- Adjust noise cancellation settings in agent.py
- Verify DeepGram service status

## Performance Characteristics

| Component | Typical Latency |
|-----------|-----------------|
| Speech-to-Text | 300-500 ms |
| LLM Processing | 700-1000 ms |
| Database Query | 50-150 ms |
| Text-to-Speech | 800-1300 ms |
| **Total** | **2-4 seconds** |

## Security Notes

- Never commit `.env` files to version control
- Rotate API keys regularly
- Use SSL for all database connections
- Implement rate limiting for production deployments
- Log and monitor escalation events

## License

This project is intended for academic and demonstration purposes. For production use, ensure compliance with applicable insurance regulations and licensing requirements.

## Author

Aditya
Focus: AI Systems, Databases, and Real-Time Applications