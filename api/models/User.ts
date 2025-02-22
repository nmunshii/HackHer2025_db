import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    images: [{ type: String }],
}, {
    timestamps: true,
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;