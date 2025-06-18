import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- MCP Server Implementation ---
const server = new McpServer({
  name: "design-brain",
  description: "Provides hooks into the design process so that a human and agent can collaborate on problem solving together.",
  version: "1.0.0",
});

const BASE_URL = "http://localhost:3000";

/**
 * Fetches all problems that have been flagged for investigation
 */
server.registerTool(
  "listProblemsToInvestigate",
  {
    description: "Fetch the list of design problems that are ready for investigation.",
    inputSchema: {},
  },
  async () => {
    const response = await fetch(`${BASE_URL}/problems/investigate`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        type: "text",
        text: await response.text(),
      }],
    };
  }
);

/**
 * Fetches a specific problem by ID
 */
server.registerTool(
  "getProblem",
  {
    description: "Retrieve a single design problem by its ID.",
    inputSchema: {
      id: z.string().describe("The ID of the problem to retrieve."),
    },
  },
  async ({ id }) => {
    const response = await fetch(`${BASE_URL}/problems/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        type: "text",
        text: await response.text(),
      }],
    };
  },
);

/**
 * Adds a new research finding to a specific problem.
 */
server.registerTool(
  "addResearch",
  {
    description: "Add a research finding to a design problem. These are a sentence or two and are intended to provide insights into possible solutions based on [simulated] user research.",
    inputSchema: {
      id: z.number().describe("The ID of the problem to add research to."),
      content: z.string().describe("The content of the research finding."),
    }
  },
  async ({ id, content }) => {
    const response = await fetch(`${BASE_URL}/problems/${id}/research`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ problem: id, content }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        type: "text",
        text: `Research added for problem ${id}.`,
      }],
    };
  }
);

/**
 * Lists all research associated with a problem.
 */
server.registerTool(
  "listResearch",
  {
    description: "List all research findings associated with a design problem.",
    inputSchema: {
      id: z.string().describe("The ID of the problem to list research for."),
    },
  },
  async ({ id }) => {
    const response = await fetch(`${BASE_URL}/problems/${id}/research`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        type: "text",
        text: await response.text(),
      }],
    };
  },
);

/**
 * Fetches all research for a problem that the user has approved.
 */
server.registerTool(
  "getApprovedResearch",
  {
    description: "List all research findings for a design problem that the user has approved. This is a way for humans to review insights before any experiments are proposed.",
    inputSchema: {
      id: z.string().describe("The ID of the problem to fetch approved research for."),
    },
  },
  async ({ id }) => {
    const response = await fetch(`${BASE_URL}/problems/${id}/research/approved`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        type: "text",
        text: await response.text(),
      }],
    };
  }
);

/**
 * Proposes a new experiment based on approved research.
 */
server.registerTool(
  "addExperiment",
  {
    description: "Propose a new experiment based on approved research. The proposal should be a sentence or two, and describe a possible solution that could be prototyped if the human approves the idea.",
    inputSchema: {
      problem: z.string().describe("The ID of the problem to add the experiment to."),
      proposal: z.string().describe("The proposal for the experiment."),
    }
  },
  async ({ problem, proposal }) => {
    const response = await fetch(`${BASE_URL}/problems/${problem}/experiments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ problem, proposal }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        type: "text",
        text: `Experiment "${proposal}" proposed for problem ${problem}.`,
      }],
    };
  }
);

/**
 * Fetches approved experiments the agent can begin work on.
 */
server.registerTool(
  "getApprovedExperiments",
  {
    description: "List approved experiments the agent can begin work on.",
    inputSchema: {
      problemId: z.string().describe("The ID of the problem to fetch approved experiments for."),
    },
  },
  async ({ problemId }) => {
    const response = await fetch(`${BASE_URL}/problems/${problemId}/experiments/approved`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        type: "text",
        text: await response.text(),
      }],
    };
  }
);

/**
 * Marks an experiment as "in progress."
 */
server.registerTool(
  "startExperiment",
  {
    description: "Mark an experiment as 'in progress'. This is to prevent other agents from picking it up, in situations where multiple experiments are being run in parallel.",
    inputSchema: {
      problem: z.string().describe("The ID of the problem the experiment belongs to."),
      experimentId: z.string().describe("The ID of the experiment to start."),
    }
  },
  async ({ problem, experimentId }) => {
    const response = await fetch(`${BASE_URL}/problems/${problem}/experiments/${experimentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "IN PROGRESS" }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        type: "text",
        text: `Experiment ${experimentId} for problem ${problem} marked as in progress.`,
      }],
    };
  }
);

/**
 * Marks an experiment as "done" and attaches a URL to the results.
 */
server.registerTool(
  "completeExperiment",
  {
    description: "Mark an experiment as 'finished' and attach a URL that the human can open in their browser to review the results of the experiment. The agent should be sure to run the prototype so that this URL doesn't result in a 404.",
    inputSchema: {
      problem: z.string().describe("The ID of the problem the experiment belongs to."),
      experimentId: z.string().describe("The ID of the experiment to complete."),
      url: z.string().url().optional().describe("The URL to the results of the experiment."),
    }
  },
  async ({ problem, experimentId, url }) => {
    const response = await fetch(`${BASE_URL}/problems/${problem}/experiments/${experimentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "FINISHED", url }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      content: [{
        type: "text",
        text: `Experiment ${experimentId} for problem ${problem} marked as finished with results at ${url}.`,
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
