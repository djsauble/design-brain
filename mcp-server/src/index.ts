import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- MCP Server Implementation ---
const server = new McpServer({
  name: "design-brain",
  version: "1.0.0",
});

const BASE_URL = "http://localhost:3000";

server.resource(
  "listProblemsToInvestigate",
  "problems:///",
  {
    title: "Fetch Problems To Investigate",
    description: "Fetches the filtered list of problems that the human user has already marked for investigation.",
  },
  async (uri, extra) => {
    const response = await fetch(`${BASE_URL}/problems/investigate`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      contents: [{
        uri: uri.href,
        type: "text",
        text: await response.text(),
      }],
    };
  }
);

server.resource(
  "getProblem",
  new ResourceTemplate("problems://{id}", { list: undefined }),
  {
    title: "Fetch Problem",
    description: "Retrieves a single problem by its ID.",
  },
  async (uri, { id }) => {
    const response = await fetch(`${BASE_URL}/problems/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      contents: [{
        uri: uri.href,
        type: "text",
        text: await response.text(),
      }],
    };
  },
);

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
