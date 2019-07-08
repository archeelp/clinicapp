var mongoose=require("mongoose");
var patientSchema = new mongoose.Schema({
	fname: String,
	lname: String,
	email: String,
    password: String,
    appointments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "appointment"
        }
     ]
});
module.exports=mongoose.model("patient", patientSchema);

