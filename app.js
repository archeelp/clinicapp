var express = require("express"),
    app = express(),
	bodyParser = require("body-parser"),
	session = require("express-session"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	user = require("./models/user"),
	review = require("./models/review"),
	appointment = require("./models/appointment"),
	days =["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

mongoose.connect("mongodb://localhost/clinicapp", { useNewUrlParser: true });
app.use(express.static('pubic'));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use("user",new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(function(req, res, next){
res.locals.currentuser = req.user;
next();
});

app.get("/",function(req,res){
		res.render("homepage");
});

app.get("/signup",nouser,function(req,res){
		res.render("signup");
});

app.get("/signin",nouser,function(req,res){
		res.render("signin");
});

app.get("/aplist",isLoggedIn,isdoctor,function(req,res){
            res.render("aplist");
});

app.get("/doctorhome/date/:id",isLoggedIn,isdoctor,function(req,res){
	user.findById(req.user._id).populate("appointments").exec(function(err, founddoctor){
        if(err){
            console.log(err);
        } else {
			var appo =[];
			founddoctor.appointments.forEach(function(appointment)
			{
				var t=new Date();
				t.setTime(req.params.id);
				if(t.getDate()==appointment.appointmentdate.getDate()
				&&t.getMonth()==appointment.appointmentdate.getMonth()
				&&t.getFullYear()==appointment.appointmentdate.getFullYear())
				{
					appo.push(appointment);
				}
			});
            res.render("doctorhome", {appointments: appo});
        }
    });
});

app.get("/patienthome",isLoggedIn,ispatient,function(req,res){
	user.findById(req.user._id).populate("appointments").exec(function(err, foundpatient){
        if(err){
            console.log(err);
        } else {
            res.render("patienthome", {patient: foundpatient});
        }
    });
});

app.get("/logout",isLoggedIn,function(req,res){
	req.logout();
	res.redirect("/");
});

app.post("/signup",function(req,res){
	var suser = {
		username: req.body.username,
		type: req.body.type,
		fname: req.body.fname,
		lname: req.body.lname,
		email: req.body.email,
		contactnumber: req.body.contactnumber
	};
    user.register(suser, req.body.password ,function(err, newlyCreated){
        if(err){
			console.log(err);
			return res.render("signup");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/signin");
		});
    });
});

app.get("/details/:id",isLoggedIn,isdoctor,nodoctordes,function(req,res){
	var pm = { id : req.params.id };
	res.render("docdes",{pm:pm});
});

app.post("/details/:id",isLoggedIn,isdoctor,nodoctordes ,function(req, res){
    user.findById(req.params.id, function(err, founddoctor){
        if(err){
            console.log("you have an error");
        } else {
			founddoctor.description=req.body.description;
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
			founddoctor.save();
			res.redirect("/doctorhome");
        }
    });
});

app.get("/doctors",function(req,res){
	user.find({}, function(err, alldoctors){
		if(err){
			console.log(err);
		} else {
		   res.render("doctors",{doctors:alldoctors});
		}
	})
});

app.get("/doctors/:id", function(req, res){
	user.findById(req.params.id).populate("reviews").populate("appointments").exec(function(err, founddoctor){
        if(err){
            console.log(err);
        } else {
            res.render("show", {doctor: founddoctor});
        }
    });
});

app.get("/doctors/:id/newreview",isLoggedIn,ispatient, function(req, res){
    // find doctor by id
		user.findById(req.params.id, function(err, doctor){
        if(err){
            console.log(err);
        } else {
             res.render("newreview", {doctor: doctor});
        }
    })
});

app.post("/doctors/:id/newreview",isLoggedIn,ispatient, function(req, res){
	user.findById(req.params.id, function(err, doctor){
		if(err){
			console.log(err);
			res.redirect("/doctors");
		} else {
		 review.create(req.body.review, function(err, review){
			if(err){
				console.log(err);
			} else {
				review.author.id = req.user._id;
			   review.author.username = req.user.username;
			   review.text=req.body.text;
               review.save();
				doctor.reviews.push(review);
				doctor.save();
				res.redirect("/doctors/" + doctor._id);
			}
		 });
		}
	});
 });

 app.get("/doctors/:id/bookappointment",isLoggedIn,ispatient, function(req, res){
		user.findById(req.params.id, function(err, doctor){
        if(err){
            console.log(err);
        } else {
             res.render("bookappointment", {doctor: doctor});
        }
    })
});

app.post("/doctors/:id/bookappointment",isLoggedIn,ispatient, function(req, res){
	user.findById(req.params.id, function(err, doctor){
		if(err){
			console.log(err);
			res.redirect("/doctors");
		} else {
		 appointment.create(
			 {
				patientname : req.user.fname,
				doctorname : doctor.fname,
				patientcn : req.user.contactnumber,
				doctorcn : doctor.contactnumber,
				appointmentdate :req.body.appointmentdate,
				doctorid : doctor._id,
				patientid : req.user._id
				}, function(err, appointment){
			if(err){
				console.log(err);
			} else {
				appointment.save();
				doctor.appointments.push(appointment);
				doctor.save();
				req.user.appointments.push(appointment);
				req.user.save();
				res.render("booked");
			}
		 });
		}
	});
 });
 
 app.post("/signin",nouser, passport.authenticate("user", 
    {
        successRedirect: "/",
        failureRedirect: "/signin"
    }), function(req, res){
});

app.get("/doctorhome/:id",isLoggedIn,isdoctor, function(req, res){
	var pm = { id : req.params.id };
	appointment.findById(req.params.id,function(err, foundappointment){
        if(err){
            console.log(err);
        } else {
            res.render("appointmentdetails", {appointment: foundappointment,pm : pm });
        }
    });
});

app.post("/doctorhome/:id",isLoggedIn,isdoctor, function(req, res){
	appointment.findById(req.params.id,function(err, foundappointment){
        if(err){
            console.log(err);
        } else {
			if(req.body.status=="C")
			{
				foundappointment.status="C";
				foundappointment.time=req.body.time;
				foundappointment.save();
				res.redirect("/aplist");
			}
			if(req.body.status=="R")
			{
				foundappointment.status="R";
				foundappointment.save();
				user.findById(req.user.id,function(err, founddoctor){
       				 if(err){
           				 console.log(err);
       					 } else {
						  founddoctor.appointments.pop(foundappointment);
						  founddoctor.save();
          				  res.redirect("/aplist");
       					 }
   					 });
			}
			if(req.body.status=="CNF")
			{
				foundappointment.status="CNF";
				foundappointment.description=req.body.description;
				foundappointment.prescription=req.body.prescription;
				foundappointment.billamount=req.body.billamount;
				foundappointment.save();
				res.redirect("/aplist");
			}
        }
    });
});

app.get("/patienthome/:id",isLoggedIn,ispatient, function(req, res){
	appointment.findById(req.params.id,function(err, foundappointment){
        if(err){
            console.log(err);
        } else {
            res.render("adp", {appointment: foundappointment });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin");
}

function nouser(req, res, next){
    if(!req.user){
        return next();
    }
    res.redirect("/");
}

function isdoctor(req, res, next){
    if(req.isAuthenticated()){
		if(req.user.type=="doctor"){
        return next();}
    }
    res.redirect("/signin");
}

function nodoctordes(req, res, next){
    if(req.isAuthenticated()){
		if(req.user.type=="doctor"&&!req.user.description){
        return next();}
    }
    res.redirect("/signin");
}

function ispatient(req, res, next){
    if(req.isAuthenticated()){
		if(req.user.type=="patient"){
        return next();}
    }
    res.redirect("/signin");
}

app.listen(3000, function(){
	console.log("The Clinicapp Server Has Started!");
 });
