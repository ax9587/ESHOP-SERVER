const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    filename : {
        type : String,
        unique : true,
        required: false
    },
    contentType : {
        type: String,
        required : false
    },
    imageBase64 : {
        type : String,
        required: false
    }
});

module.exports = mongoose.model("Image64", imageSchema);