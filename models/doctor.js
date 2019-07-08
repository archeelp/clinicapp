var mongoose =require("mongoose");
var doctorSchema = new mongoose.Schema({
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
    appointments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "appointment"
        }
     ]
 });	
 module.exports=mongoose.model("doctor", doctorSchema);
