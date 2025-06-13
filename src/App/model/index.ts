import { model, Schema } from "mongoose";
import { ETeamColor } from "../types";

const participantSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    hotKey: {
        type: String,
        required: true,
    },
    team: {
        type: String,
        enum: Object.values(ETeamColor),
        required: true,
    },
}, {
    _id: false,
    timestamps: false,
    versionKey: false,
})

const dataSchema = new Schema({
    validatorKey: {
        type: String,
        required: true,
        unique: true,
    },
    participants: {
        type: [participantSchema],
        required: true,
    },
    gameWinner: {
        type: String,
        enum: Object.values(ETeamColor),
        // required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
})

const GameStateModel = model("gameState", dataSchema);

export default GameStateModel;