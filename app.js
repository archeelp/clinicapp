var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/clinicapp");
app.use(express.static('pubic'));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");

var doctorSchema = new mongoose.Schema({
	fname: String,
	lname: String,
	email: String,
	password: String,
	authenticationKey: String
 });	

var doctor = mongoose.model("doctor", doctorSchema);

app.get("/",function(req,res){
		res.render("homepage");
});

app.get("/dsignup",function(req,res){
		res.render("dsignup");
});

app.get("/psignup",function(req,res){
		res.render("psignup");
});

app.get("/signin",function(req,res){
		res.render("signin");
});

app.get("/doctorhome",function(req,res){
		res.render("doctorhome");
});

app.get("/patienthome",function(req,res){
		res.render("patienthome");
});

app.get("/logout",function(req,res){
	res.redirect("/");
});

app.post("/dsignup",function(req,res){
	var fname = req.body.fname;
    var lname = req.body.lname;
	var email = req.body.email;
	var password = req.body.password;
	var authenticationKey = req.body.authenticationKey;
    var newDoctor = {
		fname: fname,
		lname: lname,
		email: email,
		password: password,
		authenticationKey: authenticationKey}
    doctor.create(newDoctor, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/signin");
        }
    });
});

app.post("/psignup",function(req,res){
	res.redirect("/signin");
	console.log("a patient has signed up");
	console.log("name : "+req.body.fname);
	console.log("password : "+req.body.password);
});

app.get("/doctors",function(req,res){
	doctor.find({}, function(err, alldoctors){
		if(err){
			console.log(err);
		} else {
		   res.render("doctors",{doctors:alldoctors});
		}
	})
});

app.listen(3000, function(){
	console.log("The Clinicapp Server Has Started!");
 });