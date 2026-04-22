import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
    {
        token: { type: String, required: true, unique: true, index: true },
        userEmail: { type: String, required: true, index: true },
        rememberMe: { type: Boolean, default: false },
        expiresAt: { type: Date, required: true, index: { expires: 0 } },
    },
    {
        timestamps: true,
    }
);

export const Session = mongoose.model('Session', sessionSchema);
