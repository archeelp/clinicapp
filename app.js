var express = require("express"),
    app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/clinicapp", { useNewUrlParser: true });
app.use(express.static('pubic'));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");

var doctorSchema = new mongoose.Schema({
	fname: String,
	lname: String,
	email: String,
	password: String,
	authenticationKey: String,
	description: String
 });	

 var newDoctor = {
	fname: String,
	lname: String,
	email: String,
	password: String,
	authenticationKey: String,
	description: String
 };
 
var patientSchema = new mongoose.Schema({
	fname: String,
	lname: String,
	email: String,
	password: String
});

var doctor = mongoose.model("doctor", doctorSchema),
	patient = mongoose.model("patient", patientSchema);

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
	newDoctor.fname = req.body.fname;
    newDoctor.lname = req.body.lname;
	newDoctor.email = req.body.email;
	newDoctor.password = req.body.password;
	newDoctor.authenticationKey = req.body.authenticationKey;
	res.redirect("/dsignup/docdes");
});

app.get("/dsignup/docdes",function(req,res){
	res.render("docdes");
});

app.post("/dsignup/docdes", function(req, res){
			newDoctor.description=req.body.description;
			doctor.create(newDoctor, function(err, newlyCreated){
				if(err){
					console.log(err);
				} else {
					res.redirect("/signin");
				}
			});
			
});

app.post("/psignup",function(req,res){
	// res.redirect("/signin");
	// console.log("a patient has signed up");
	// console.log("name : "+req.body.fname);
	// console.log("password : "+req.body.password);
	patient.create({
		fname: req.body.fname,
		lname: req.body.lname,
		email: req.body.email,
		password: req.body.password
	}, function(err, back) {
		if(err) console.log(err)
		else {
			console.log("Patient added");
			res.redirect("/signin");
		}
	});
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

app.get("/doctors/:id", function(req, res){
    doctor.findById(req.params.id, function(err, founddoctor){
        if(err){
            console.log(err);
        } else {
            res.render("show", {doctor: founddoctor});
        }
    });
})

app.listen(3000, function(){
	console.log("The Clinicapp Server Has Started!");
 });
