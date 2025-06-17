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
server.registerTool(
  "addResearch",
  {
    description: "Adds a new research finding to a specific problem.",
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
      contents: [{
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
  async (uri, { id }) => {
    const response = await fetch(`${BASE_URL}/problems/${id}/research/approved`);
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
 * Main function to start the server.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Design Process MCP Server running on stdio...");
}

/**
 * Fetches approved experiments the agent can begin work on.
 */
server.resource(
  "getApprovedExperiments",
  new ResourceTemplate("problems://{problemId}/experiments/approved", { list: undefined }),
  {
    title: "Fetch Approved Experiments",
    description: "Fetches approved experiments the agent can begin work on.",
  },
  async (uri, { problemId }) => {
    const response = await fetch(`${BASE_URL}/problems/${problemId}/experiments/approved`);
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
 * Proposes a new experiment based on approved research.
 */
server.registerTool(
  "addExperiment",
  {
    description: "Proposes a new experiment based on approved research.",
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
 * Marks an experiment as "in progress."
 */
server.registerTool(
  "startExperiment",
  {
    description: "Marks an experiment as 'in progress.'",
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
    description: "Marks an experiment as 'done' and attaches a URL to the results.",
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

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
