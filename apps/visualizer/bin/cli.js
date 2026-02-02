#!/usr/bin/env node

import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist", "app");

const args = process.argv.slice(2);
let port = 3000;
let chartFile = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--port" || arg === "-p") {
    port = parseInt(args[++i] || "3000", 10);
  } else if (!arg.startsWith("-")) {
    chartFile = arg;
  }
}

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  let filePath = join(distDir, req.url === "/" ? "index.html" : req.url);

  if (!existsSync(filePath)) {
    filePath = join(distDir, "index.html");
  }

  try {
    const content = await readFile(filePath);
    const ext = filePath.substring(filePath.lastIndexOf("."));
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(port, () => {
  let url = `http://localhost:${port}`;

  if (chartFile) {
    const absolutePath = resolve(process.cwd(), chartFile);
    url += `?chart=file://${absolutePath}`;
  }

  console.log(`Statechart Visualizer running at ${url}`);

  const open =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";

  import("node:child_process").then(({ exec }) => {
    exec(`${open} ${url}`);
  });
});
