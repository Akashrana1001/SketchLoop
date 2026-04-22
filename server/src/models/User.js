import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, index: true },
        passwordHash: { type: String, required: true },
        salt: { type: String, required: true },
        lastLoginAt: { type: Date, default: null },
        lastSessionId: { type: String, default: null },
        passwordResetRequestedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model('User', userSchema);
