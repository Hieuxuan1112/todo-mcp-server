import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["server.js"]
  });

  const client = new Client(
    { name: "todo-client", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);

  const tools = await client.listTools();
  console.log("Available tools:");
  tools.tools.forEach(t => console.log("-", t.name));

  await client.callTool({
    name: "add_todo",
    arguments: { text: "Finish TechNext assignment" }
  });

  const todos = await client.callTool({
    name: "list_todos",
    arguments: {}
  });

  console.log("\nTodos:");
  console.log(todos.content[0].text);

  process.exit();
}

main();