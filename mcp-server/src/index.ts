import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- MCP Server Implementation ---
const server = new McpServer({
  name: "design-brain",
  version: "1.0.0",
});

/**
 * Main function to start the server.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Design Process MCP Server running on stdio...");
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
