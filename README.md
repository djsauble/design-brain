# Design Brain

Automate your design process, using an MCP server to let agents handle the toilsome tasks and a UI so you can track the process and provide timely feedback.

## Setup

Backend which provides persistence and serves the UI and MCP Server.

```
npm start --prefix backend
```

Frontend which allows humans to manage the design process.

```
npm start --prefix frontend
```

MCP server which lets agents persist research and run experiments.

```
npm start --prefix mcp-server
```