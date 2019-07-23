var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: String,
    fname: String,
	lname: String,
    email: String,
    contactnumber: String,
	authenticationKey: String,
    description: String,
    schedule : [
        {
            day : String,
            from : String,
            to : String
        }
    ],
    reviews: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "review"
        }
     ],
    appointments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "appointment"
        }
     ]
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("user", userSchema);