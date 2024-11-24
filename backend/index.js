import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import {app, server} from './socket/socket.js';
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow requests from http://localhost:5173
const corsOptions = {
    origin: process.env.URL,
    credentials: true
};

app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);



app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'frontend','dist','index.html'));
})


// Start the server and connect to the database
server.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at http://localhost:${PORT}`);
});
