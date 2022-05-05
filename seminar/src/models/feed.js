const mongoose = require("mongoose");

const OSchemaDefinition = {
    title: String,
    content: {
        type: String,
        default: "Input Content...",
    },
    itemViewCnt: {
        type: Number,
        default: 0,
    }
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const FeedModel = mongoose.model("feed", schema);

module.exports = FeedModel;

