import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import imageRoutes from "./routes/image"; // Correct the path to the routes file

dotenv.config();

export const app = express();
const dbUrl = process.env.MONGO_URL as string;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"]
}));
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/", imageRoutes);

app.get("/", (req, res) => {
    res.json("Hello World from the server!");
});

export const startServer = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to MongoDB");
        const server = app.listen(4000, () => {
            console.log("Server is running on port 4000");
        });
        return server;
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}
