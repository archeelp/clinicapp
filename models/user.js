var mongoose =require("mongoose");
var userSchema = new mongoose.Schema({
	fname: String,
	lname: String,
	email: String,
	password: String,
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
 module.exports=mongoose.model("user", userSchema);