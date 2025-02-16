import express, { Express, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import sharp from "sharp";
import Image from "../models/Image"; // Adjust the path as necessary

const router = express.Router();

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

// Function to validate hash
function isValidHash(hash: string): boolean {
    // Implement your hash validation logic here
    return typeof hash === 'string' && hash.length === 64; // Example: Check if it's a 64-character string
}

// Upload an image that contains a hash to the database
router.post("/upload", upload.single("image"), async (req: MulterRequest, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No image uploaded" });
            return;
        }

        const { buffer, mimetype, originalname } = req.file;

        // Extract image metadata using sharp
        const metadata = await sharp(buffer).metadata();

        if (!metadata.comments) {
            res.status(400).json({ message: "No hash found" });
            return;
        }
        // Check if the hash is already in the database
        const existingImage = await Image.findOne({ hash: metadata.comments });
        if (existingImage) {
            res.status(400).json({ message: "Hash already exists" });
            return;
        }
        // Check if the comment is a valid hash
        const comment = metadata.comments.find((comment: any) => comment.keyword === "FauxHash");
        if (!comment) { 
            res.status(400).json({ message: "No hash found" });
            return
        }
        if (!isValidHash(comment?.text)) {
            res.status(400).json({ message: "Invalid hash" });
            return;
        }
        
        const newImage = await Image.create({
            data: buffer,
            contentType: mimetype,
            name: originalname,
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            hash: metadata.comments
        });

        await newImage.save();
        res.status(201).json({ message: "Image uploaded successfully!" });
    } catch (error) {
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
        const images = await Image.find();
        if (!images) {
            res.status(404).json({ message: "No images found" });
            return;
        }
        if (images.length === 0) {
            res.status(404).json({ message: "No images found" });
            return;
        }
        res.status(200).json({ message: "Images found successfully!", images });
    } catch (error) {
        res.status(500).json({ message: "Error finding images", error });
    }
});


export default router;