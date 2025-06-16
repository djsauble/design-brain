import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- Data Structure (Hardcoded for Phase 1) ---
const designProcessState = {
  processName: "New Feature Development",
  phases: [
    { name: "Problem Definition", inputs: {}, outputs: { "PROBLEM_STATEMENT": "Not yet defined." } },
    { name: "User Research", inputs: { "PROBLEM_STATEMENT": "Required" }, outputs: { "CURRENT_APPROACH": "Not yet defined.", "SOLUTION_IDEAS": "Not yet defined." } },
    // ... other phases can be added here
  ],
  currentPhase: "Problem Definition"
};

// --- MCP Server Implementation ---
const server = new McpServer({
  name: "design-process-server",
  version: "1.0.0",
});

/**
 * Tool: get_design_process_state
 * Description: Fetches the current state of the entire design process,
 * including all phases and their inputs/outputs.
 * Arguments: None
 */
server.tool(
  "get_design_process_state",
  "Fetches the current state of the design process.",
  async () => {
    return {
      content: [{
        type: "text",
        text: JSON.stringify(designProcessState, null, 2),
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
