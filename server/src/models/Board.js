import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema(
    {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    { _id: false }
);

const operationSchema = new mongoose.Schema(
    {
        id: { type: String, required: true }, // Not _id to preserve client-side custom IDs
        tool: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: Number, required: true },
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        
        // Polymorphic fields
        points: { type: [pointSchema], default: undefined },
        start: { type: pointSchema, default: undefined },
        end: { type: pointSchema, default: undefined },
    },
    { _id: false }
);

const boardSchema = new mongoose.Schema(
    {
        roomId: { type: String, required: true, unique: true, index: true },
        title: { type: String, required: true },
        ownerId: { type: String, default: null },
        participants: { type: Number, default: 0 },
        strokes: { type: Number, default: 0 },
        lastSnapshotId: { type: String, default: null },
        operations: { type: [operationSchema], default: [] },
    },
    {
        timestamps: true,
    }
);

export const Board = mongoose.model('Board', boardSchema);
