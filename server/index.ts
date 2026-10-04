import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Serve the Vite output from dist/public after the bundled server is started.
const staticPath = path.resolve(__dirname, "public");

app.use(express.static(staticPath));

// Handle client-side routing - serve index.html for all routes.
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Vercel/serverless imports the module and manages the request lifecycle.
// Only listen when this bundle is run directly outside Vercel.
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

export default app;
