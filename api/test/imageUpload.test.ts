import mongoose from "mongoose";
import * as dotenv from "dotenv";
import request from "supertest";
import { app, startServer } from "../index";
import Image from "../models/Image";
import * as fs from "fs";
import * as path from "path";
import { Server } from "http";

dotenv.config();

describe("Image Upload API Tests", () => {
    let server: Server;

    beforeAll(async () => {
        server = await startServer();
    }, 10000);

    afterAll(async () => {
        await Image.deleteMany({});
        await mongoose.connection.close();
        server.close();
    }, 10000);

    describe("POST /upload", () => {
        test("Successful image upload", async () => {
            const imagePath = path.join(__dirname, "../testphotos/munchtest.JPG");
            const response = await request(app)
                .post("/upload")
                .attach("image", fs.readFileSync(imagePath), "munchtest.JPG");

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "Image uploaded successfully!");

            const image = await Image.findOne({ name: "munchtest.JPG" });
            expect(image).toBeTruthy();
        });

        test("No image uploaded", async () => {
            const response = await request(app)
                .post("/upload")
                .send(); // No file attached

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "No image uploaded");
        });

        test("No hash found in metadata", async () => {
            const imagePath = path.join(__dirname, "../testphotos/no_hash.jpg"); // Ensure this file exists and has no hash
            const response = await request(app)
                .post("/upload")
                .attach("image", fs.readFileSync(imagePath), "no_hash.jpg");

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "No hash found");
        });

        test("Hash already exists", async () => {
            const imagePath = path.join(__dirname, "../testphotos/munchtest.JPG");
            // First upload
            await request(app)
                .post("/upload")
                .attach("image", fs.readFileSync(imagePath), "munchtest.JPG");

            // Second upload with the same image
            const response = await request(app)
                .post("/upload")
                .attach("image", fs.readFileSync(imagePath), "munchtest.JPG");

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Hash already exists");
        });

        test("Invalid hash format", async () => {
            const imagePath = path.join(__dirname, "../testphotos/invalid_hash.jpg"); // Ensure this file exists and has an invalid hash
            const response = await request(app)
                .post("/upload")
                .attach("image", fs.readFileSync(imagePath), "invalid_hash.jpg");

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Invalid hash");
        });
    });
});
