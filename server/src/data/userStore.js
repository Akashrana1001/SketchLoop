import { User } from '../models/User.js';

export async function getUserByEmail(email) {
    return User.findOne({ email }).lean();
}

export async function createUser({ name, email, passwordHash, salt }) {
    const user = new User({
        name,
        email,
        passwordHash,
        salt,
    });
    await user.save();
    return user.toObject();
}

export async function updateUser(email, patch) {
    const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: patch },
        { new: true, lean: true }
    );
    return updatedUser;
}

export function sanitizeUser(user) {
    if (!user) {
        return null;
    }

    const safeUser = { ...user };
    
    // Mongoose specific field
    if (safeUser._id) {
        safeUser.id = safeUser._id.toString();
        delete safeUser._id;
    }
    delete safeUser.__v;
    delete safeUser.passwordHash;
    delete safeUser.salt;

    return safeUser;
}
