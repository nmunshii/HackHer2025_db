import express, { Express, Request, Response } from "express";
import multer, { FileFilterCallback, File } from "multer";
import sharp from "sharp";
import Image from "../models/Image";

const router = express.Router();

interface MulterRequest extends Request {
    file?: File;
}
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

router.post("/upload", upload.single("image"), async (req: MulterRequest, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No image uploaded" });
            return;
        }

        const { buffer, mimetype, originalname } = req.file;

        // Extract image metadata using sharp
        const metadata = await sharp(buffer).metadata();

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

export default router;