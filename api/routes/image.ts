import express, { Express, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import sharp from "sharp";
import ExifTool from "exiftool-kit";
import UserModel from "../models/User";
const exiftool = new ExifTool()

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Function to validate hash
function isValidHash(hash: string): boolean {
    // Implement your hash validation logic here
    return typeof hash === 'string' && hash.length === 64; // Example: Check if it's a 64-character string
}

router.get("/", (req: Request, res: Response) => {
    res.json("Hello World from the image route!");
});

// Upload an image that contains a hash to the database
router.post("/upload", async (req: Request, res: Response) => {
    const { tx, email } = req.body;
    try {
        if (!tx) {
            res.status(400).json({ message: "No image uploaded" });
            return;
        }
        // Check if the email exists in the UserModel
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Check if the hash is already in the database
        const users = await UserModel.find({}, 'hashes'); // Retrieve only the hashes field
        const allHashes = users.flatMap(user => user.hashes);
        if (allHashes.includes(tx)) {
            console.log("IMAGE EXISTS")
            res.status(400).json({ message: "Hash already exists" });
            return;
        }

        await UserModel.updateOne({ email }, { $push: { hashes: tx } });
        res.status(201).json({ message: "Image hashed successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error uploading image", error });
    }
});

// Get all hashes from the database
router.get("/getAllHashes", async (req: Request, res: Response) => {
    if (!req.query.hash) {
        res.status(400).json({ message: "Hash is required" });
        return;
    }
    try {
        res.status(200).json({ message: "Images found successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error finding images", error });
    }
});


export default router;