var mongoose = require("mongoose");

var feedbackSchema = mongoose.Schema({
    username: String,
    feedback: String
});

module.exports = mongoose.model("feedback", feedbackSchema);