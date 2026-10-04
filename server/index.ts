import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

<<<<<<< HEAD
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
=======
async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

>>>>>>> da8d273950ec5bcae361e14f90862b772d079047
  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

<<<<<<< HEAD
export default app;
=======
startServer().catch(console.error);
>>>>>>> da8d273950ec5bcae361e14f90862b772d079047
