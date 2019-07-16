var mongoose = require("mongoose");

var reviewSchema = mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model("review", reviewSchema);
