var express = require("express"),
    app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	patient = require("./models/patient"),
	doctor = require("./models/doctor"),
	appointment = require("./models/appointment"),
	days =["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

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
            console.log("you have an error");
        } else {
			founddoctor.description=req.body.description;
			//for(i=0;i<6;i++)
			//{
			//	var iden="id" + i;
			//	var f=iden +"from";
			//	var t=iden +"to";
			//	console.log(req.body.iden);
				if(req.body.id0 == "on")
				{
					founddoctor.schedule.push({
						day :days[0],
						from :req.body.id0from,
						to :req.body.id0to
				});
				}
				if(req.body.id1 == "on")
				{
					founddoctor.schedule.push({
						day :days[1],
						from :req.body.id1from,
						to :req.body.id1to
				});
				}if(req.body.id2 == "on")
				{
					founddoctor.schedule.push({
						day :days[2],
						from :req.body.id2from,
						to :req.body.id2to
				});
				}
				if(req.body.id3 == "on")
				{
					founddoctor.schedule.push({
						day :days[3],
						from :req.body.id3from,
						to :req.body.id3to
				});
				}
				if(req.body.id4 == "on")
				{
					founddoctor.schedule.push({
						day :days[4],
						from :req.body.id4from,
						to :req.body.id4to
				});
				}
				if(req.body.id5 == "on")
				{
					founddoctor.schedule.push({
						day :days[5],
						from :req.body.id5from,
						to :req.body.id5to
				});
				}
				if(req.body.id6 == "on")
				{
					founddoctor.schedule.push({
						day :days[6],
						from :req.body.id6from,
						to :req.body.id6to
				});
				}
			//}
			founddoctor.save();
			res.redirect("/signin");
        }
    });
});

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
