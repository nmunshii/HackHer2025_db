import mongoose, { Schema, Document } from 'mongoose';

interface IImage extends Document {
    data: Buffer;
    contentType: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
        description: { type: String },
    },
    {
        timestamps: true,
    }
);

const Image = mongoose.model<IImage>('Image', ImageSchema);

export default Image;