import express from "express";
import "dotenv/config";
import cors from "cors"; //importing cors
import job from "./lib/cron.js";

import authRoutes from "./routes/authRoutes.js"; //importing authRoutes from authRoutes.js
import bookRoutes from "./routes/bookRoutes.js"; //importing bookRoutes from bookRoutes.js
import { connectDB } from "./lib/db.js";


const app = express(); //creating new instance of express
const PORT = process.env.PORT || 3000;

job.start(); //starting the cron job
app.use(express.json()); //middleware to parse JSON data
app.use(cors()); //middleware to enable CORS


app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});