import mongoose, { Schema, Document } from "mongoose";



const ImageSchema: Schema = new Schema({
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    name: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    hash: { type: String, required: true }
},
    { timestamps: true });


const ImageModel = mongoose.model("Image", ImageSchema);

// async function storeImage(filePath: string, contentType: string) {
//     const imageBuffer = fs.readFileSync(filePath);
//     const metadata = await sharp(imageBuffer).metadata();

//     const newImage = new ImageModel({
//         data: imageBuffer,
//         contentType,
//         width: metadata.width,
//         height: metadata.height,
//         format: metadata.format,
//     });

//     await newImage.save();
//     console.log("Image saved successfully!");
// }

export default ImageModel;