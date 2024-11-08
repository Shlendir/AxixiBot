const { Schema, model } = require("mongoose")
const breedlistSchema = new Schema({
    _id: Schema.Types.ObjectId,
    discordId: String,
    breed: String,
    wilds: Boolean,
    statsPersona: { type: String, required: false },
    color: { type: String, required: false },
    markings: { type: String, required: false },
    notes: { type: String, required: false },
    dateEdited: Date,
});

module.exports = model("Breedlist", breedlistSchema, "breedlists");