const { Schema, model } = require("mongoose")
const hiuserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    discordId: String,
    hiUsername: String,
    dateEdited: Date,
    serverId: String,
});

module.exports = model("Hiuser", hiuserSchema, "hiusers");