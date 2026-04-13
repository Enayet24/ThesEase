import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";

dotenv.config();

const app = express();

// Connect DB
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});