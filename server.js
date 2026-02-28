import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

import fs from "fs";

const TODOS_FILE = "./todos.json";

/* --------------------------
   File Utilities
--------------------------- */
function ensureFile() {
  if (!fs.existsSync(TODOS_FILE)) {
    fs.writeFileSync(TODOS_FILE, JSON.stringify([]));
  }
}

function readTodos() {
  try {
    return JSON.parse(fs.readFileSync(TODOS_FILE));
  } catch {
    return [];
  }
}

function writeTodos(todos) {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));
}

ensureFile();

/* --------------------------
   MCP Server Init
--------------------------- */
const server = new Server(
  {
    name: "todo-mcp-server",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

/* --------------------------
   Tool Definitions
--------------------------- */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "add_todo",
      description: "Add a new todo item",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string", minLength: 1 }
        },
        required: ["text"]
      }
    },
    {
      name: "list_todos",
      description: "List all todo items",
      inputSchema: {
        type: "object",
        properties: {}
      }
    },
    {
      name: "delete_todo",
      description: "Delete a todo by index",
      inputSchema: {
        type: "object",
        properties: {
          index: { type: "number", minimum: 0 }
        },
        required: ["index"]
      }
    }
  ]
}));

/* --------------------------
   Tool Logic
--------------------------- */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const todos = readTodos();

  try {
    switch (name) {
      case "add_todo":
        if (!args.text?.trim()) {
          throw new Error("Todo text cannot be empty.");
        }
        todos.push(args.text.trim());
        writeTodos(todos);
        return success("Todo added successfully.");

      case "list_todos":
        return success(
          todos.length
            ? todos.map((t, i) => `${i}: ${t}`).join("\n")
            : "No todos found."
        );

      case "delete_todo":
        if (args.index >= todos.length) {
          throw new Error("Invalid index.");
        }
        todos.splice(args.index, 1);
        writeTodos(todos);
        return success("Todo deleted successfully.");

      default:
        throw new Error("Unknown tool.");
    }
  } catch (err) {
    return error(err.message);
  }
});

/* --------------------------
   Response Helpers
--------------------------- */
function success(message) {
  return {
    content: [{ type: "text", text: message }]
  };
}

function error(message) {
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}

/* --------------------------
   Start Server
--------------------------- */
const transport = new StdioServerTransport();
await server.connect(transport);

console.log("Todo MCP Server running...");