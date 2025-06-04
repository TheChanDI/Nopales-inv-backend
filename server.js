import "dotenv/config";

import express from "express";
import cors from "cors";
import inventoryRoutes from "./routes/inventory.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

//Routes
app.use("/inventory", inventoryRoutes);

app.listen(3001, () => {
  console.log("Proxy server is running on http://localhost:3001");
});
