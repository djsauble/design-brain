# Design Automator MCP

MCP server which serves as the brain for an agentic design process.
Can be used in tandem with a human designer to provide feedback to agents throughout the design process.

## Setup

Start the server:

```
npm install
npm start
```

Test the server

```
npx @modelcontextprotocol/inspector npm start
```

## Docs

- LLM-friendly MCP docs: https://modelcontextprotocol.io/llms-full.txt
- MCP TypeScript SDK repository: https://github.com/modelcontextprotocol/typescript-sdk

## Architecture

One idea is to store the state of experiments in a repo in the following format.

```
problems/
└── <id>/
    ├── problem.md
    ├── research.json
    ├── datasets.json
    └── experiments/
        └── <id>/
            ├── workflow.md
            ├── wireframes/
            │   ├── <seq_id>_wireframe.svg
            │   └── ...
            ├── prototype.json
            └── screenshots.json
```