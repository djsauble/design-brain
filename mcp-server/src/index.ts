import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- MCP Server Implementation ---
const server = new McpServer({
  name: "design-brain",
  version: "1.0.0",
});

const BASE_URL = "http://localhost:3000";

/**
 * Fetches all problems that have been flagged for investigation
 */
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

/**
 * Fetches a specific problem by ID
 */
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
 * Adds a new research finding to a specific problem.
 */
server.tool(
  "addResearch",
  "Adds a new research finding to a specific problem.",
  {
    problemId: z.string().describe("The ID of the problem to add research to."),
    content: z.string().describe("The content of the research finding."),
  },
  async ({ problemId, content }) => {
    const response = await fetch(`${BASE_URL}/problems/${problemId}/research`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        type: "text",
        text: `Research added for problem ${problemId}.`,
      }],
    };
  }
);

/**
 * Lists all research associated with a problem.
 */
server.resource(
  "listResearch",
  new ResourceTemplate("problems://{id}/research", { list: undefined }),
  {
    title: "Fetch Research",
    description: "Lists all research associated with a problem.",
  },
  async (uri, { id }) => {
    const response = await fetch(`${BASE_URL}/problems/${id}/research`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        uri: uri.href,
        type: "text",
        text: await response.text(),
      }],
    };
  },
);

/**
 * Fetches all research for a problem that the user has approved.
 */
server.resource(
  "getApprovedResearch",
  new ResourceTemplate("problems://{id}/research/approved", { list: undefined }),
  {
    title: "Fetch Approved Research",
    description: "Fetches all research for a problem that the user has approved.",
  },
  async (uri, { problemId }) => {
    const response = await fetch(`${BASE_URL}/problems/${problemId}/research/approved`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        uri: uri.href,
        type: "text",
        text: await response.text(),
      }],
    };
  }
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
