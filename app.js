var express = require("express"),
    app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	patient = require("./models/patient"),
	doctor = require("./models/doctor"),
	appointment = require("./models/appointment");

mongoose.connect("mongodb://localhost/clinicapp", { useNewUrlParser: true });
app.use(express.static('pubic'));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");

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
    doctor.create(req.body.doctor, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/dsignup/"+newlyCreated.id);
        }
    });
});

app.get("/dsignup/:id",function(req,res){
	var pm = { id : req.params.id };
	res.render("docdes",{pm:pm});
});

app.post("/dsignup/:id", function(req, res){
    doctor.findById(req.params.id, function(err, founddoctor){
        if(err){
            console.log(err);
        } else {
			founddoctor.description=req.body.description;
			founddoctor.save();
			res.redirect("/signin");
        }
    });
})


app.post("/psignup",function(req,res){
	patient.create(req.body.patient, function(err, back) {
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
