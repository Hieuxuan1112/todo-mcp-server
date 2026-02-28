# Todo MCP Server

A custom Model Context Protocol (MCP) server built using Node.js and the official MCP SDK.  
Designed as a lightweight example of a custom MCP server implementation.
## Overview

This project demonstrates how to build a custom MCP server using Node.js and the MCP SDK.  
It implements a simple Todo management system with persistent storage.

The server exposes structured MCP tools via stdio transport, and a separate client connects and invokes those tools.

## Features

- MCP tool registration
- Add todo
- List todos
- Delete todo
- Persistent storage using a JSON file
- Client-server communication via stdio transport

## Tech Stack

- Node.js
- @modelcontextprotocol/sdk
- JSON file storage

## Project Structure
```
server.js        # MCP server implementation
test-client.js   # Test client to interact with the server
package.json
```

## How to Run

### Install dependencies

npm install

### Start the MCP server

node server.js

### Run test client

node test-client.js

## Example Output
```
Available tools:
- add_todo
- list_todos
- delete_todo

Todos:
0: Finish TechNext assignment
```
## Why This Project?

This project was built to demonstrate:

- Understanding of the MCP protocol
- Tool registration and schema validation
- Client-server architecture
- Persistent state management

It was created as part of an AI engineering practice assignment.
