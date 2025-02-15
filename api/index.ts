import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";

dotenv.config();

export const app = express();
const dbUrl = process.env.MONGO_URL as string;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PATCH", "DELETE"]
	})
);
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Connection
mongoose
	.connect(dbUrl)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log("Error connecting to MongoDB", err));


// app.use("/test/instructor", instructorTestRoutes);

app.get("/", (req, res) => {
	res.json("Hello World from the server!");
});

app.get("/testing", (req, res) => {
	res.json("Testing");
});

app.get("/test2", (req, res) => {
	res.json("Testing again");
});

app.listen(4000, () => {
	console.log("Server is running on port 4000");
});
