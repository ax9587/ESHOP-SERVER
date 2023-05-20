const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    imageBase64 : {
        type : String,
        required: false
    }
});

module.exports = mongoose.model("Image64", imageSchema);