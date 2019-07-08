var mongoose =require("mongoose");
var appointmentSchema = new mongoose.Schema({
    status: String,
    bookingdate: {type: Date, default: Date.now},
    appointmentdate :{type: Date}
});
module.exports=mongoose.model("appointment", appointmentSchema);