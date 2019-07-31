var express = require("express"),
    app = express(),
	bodyParser = require("body-parser"),
	session = require("express-session"),
	mongoose = require("mongoose"),
	expressSanitizer = require("express-sanitizer"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	user = require("./models/user"),
	review = require("./models/review"),
	appointment = require("./models/appointment"),
	days =["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],
	faker = require("faker"),
    databaseURL = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';

mongoose.connect(databaseURL, { useNewUrlParser: true });
app.use(express.static('pubic'));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(expressSanitizer());

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

//PASSPORT CONFIGURATION COMPLETE

//MULTER AND CLOUDINARY CONFIGURATION

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dp71ux6po', 
  api_key: '373788194924911', 
  api_secret: '5Lvzuy5445yWBYP0HlyyF8b3EPI'
});

//MULTER AND CLOUDINARY CONFIGURATION COMPLETE

//FAKER
var imgurl =[
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVV2C9Wd4dmYbsUCn_H5I4BMn9UYZsKmwvQcKVcaKMCMuXJB58",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz3WNCwhrhQPga14FTBfxLHWNRTgdHq8ahRNt5JT-1XtuYPtNp",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyNRmjP2FnYIhyfAY3Uk_SpTVPaPWhSfRb_f3z598ER0dxIFuw",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpZALWesbqageji2LOzFXRMPJ1LHGGf9_LzIsy3FlXW4-ZgW4B",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmJarQHXhA2Ia_wFdP7BcAigP6XYOodfJW2HIrWMKcZs90Do9MXA",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW_0LaX5oFL0sTR_lD7dkGkYfiQbgjM3wf64VMbz3N7TjZDUPS",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpzEMKsQO9Dp0p6ucQaGs24-8GNGfELL9V1lLKeJ8pTmGV3KcB",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpxkNYJ6KtsKx6WjV9qvAk4coqMzyy16HEL2JRQGeAxROXEIBv_A",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcdIp72bafvZvjZ8Ox23FVTLiknOUQYQtjcKKM-K4AUpYArT6d",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa_RWfFQvBdKuh09_xc1FIiINdbaevnMgECXuPTliIOXKcdLc3lw",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4MhB5szikoYS2O4wrSxf7Uv1ozK3g7Jvv9hMpVd1DWAjfO1rV",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyysKeS9tA8M9aMGM16Z2JoLGJw1FEcFazeBkvbb5hVjUXHszK",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG7nfyANOL6bnpWAM7t8Wa_qexZAv0Qbh4ZtytvimzeOCBEJCWBg",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFbW8Nchl9FZYzoViR6HfrX0CKxlOt25pcZXRMvQWHDnbF7vrl",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRonlKSi2v_FRMsiqTacpliFialJ-cKYDPaDsn2Fe4nihLCD6A60w",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlhnl6GNOZMtYiBZjBN8MhZsem7lY--ixyfIsZvsP2spik2X-U6Q"
];
for(i=0;i<16;i++){
	var suser = {
		username: faker.internet.userName(),
		type: "doctor",
		fname: faker.name.firstName(),
		lname: faker.name.lastName(),
		email: faker.internet.email(),
		contactnumber: faker.phone.phoneNumber(),
		image: imgurl[i],
		address: faker.address.streetAddress(),
		description: faker.lorem.paragraph()
	};
    user.register(suser, "Arch1234" ,function(err, newlyCreated){
        if(err){
			console.log(err);
			return res.render("signup");
		}
		else{
				newlyCreated.schedule.push({
				day :"monday",
				from :"10",
				to :"12"
				});
				newlyCreated.schedule.push({
					day :"tuesday",
					from :"11",
					to :"13"
				});
				newlyCreated.save();
		}
    });
}
//COMPLETE

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

app.get("/stats",isLoggedIn,isdoctor,function(req,res){
	user.findById(req.user._id).populate("appointments").exec(function(err, founddoctor){
        if(err){
            console.log(err);
        } else {
			var appo=[];
			var days =["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
			var d = new Date();
			var c = new Date();
			var sub=30-Number(d.getDate());
			d.setTime(c.getTime()+sub*24*60*60*1000);
			for(i=-1;d.getMonth()==c.getMonth();i--)
			{
				req.user.schedule.forEach(function(schedule){ 
				if(schedule.day == days[d.getDay()])
				{
					var j=0;
					founddoctor.appointments.reverse();
					founddoctor.appointments.forEach(function(appointment)
					{
						if(d.getDate()==appointment.appointmentdate.getDate()
						&&d.getMonth()==appointment.appointmentdate.getMonth()
						&&d.getFullYear()==appointment.appointmentdate.getFullYear())
						{
							j++;
						}
					});
					var month=d.getMonth()+1;
					var t=d.getDate()+"/"+month+"/"+d.getFullYear();
					appo.push({label:t,y:j});
				}
				});
				d.setTime(c.getTime()+sub*24*60*60*1000+i*24*60*60*1000);
			}
			res.render("stats",{appointmentdata:appo});
		}
});
});

app.get("/doctorhome/date/:id",isLoggedIn,isdoctor,function(req,res){
	user.findById(req.user._id).populate("appointments").exec(function(err, founddoctor){
        if(err){
            console.log(err);
        } else {
			var appo1 =[];
			var appo2=[];
			var addappo=false;
			founddoctor.appointments.forEach(function(appointment)
			{
				var t=new Date();
				t.setTime(req.params.id);
				if(t.getDate()==appointment.appointmentdate.getDate()
				&&t.getMonth()==appointment.appointmentdate.getMonth()
				&&t.getFullYear()==appointment.appointmentdate.getFullYear())
				{
					if(appointment.time){
						appo1.push(appointment);
					}
					else {
						appo2.push(appointment);
					}
				}
			});
			appo1.sort(function(a,b){
				var temp1=60*Number(a.time[0]+a.time[1])+Number(a.time[3]+a.time[4]);
				var temp2=60*Number(b.time[0]+b.time[1])+Number(b.time[3]+b.time[4]);
				return temp1-temp2;
			})
			var t1=new Date();
			t1.setTime(req.params.id);
			var t2=new Date();
			t2.setTime(Date.now());
			if(t1.getDate()>=t2.getDate()){
				addappo=true;
			}
			else if(t1.getMonth()>t2.getMonth()){
				addappo=true;
			}
			res.render("doctorhome", {appointments: appo1,
			oappointments:appo2,
			addappo:addappo,T:t1});
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
		username: req.sanitize(req.body.username),
		type: req.body.type,
		fname: req.sanitize(req.body.fname),
		lname: req.sanitize(req.body.lname),
		email: req.sanitize(req.body.email),
		contactnumber: req.sanitize(req.body.contactnumber)
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

app.post("/doctors/:id/deletereview",isLoggedIn,ispatient,function(req,res){
	review.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
			res.redirect("/");
		}
		else{
			res.redirect("/doctors");
		}
	})
});

app.post("/details/:id",isLoggedIn,isdoctor,nodoctordes, upload.single('image'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
      user.findById(req.params.id, function(err, founddoctor){
        if(err){
            console.log("you have an error");
        } else {
			founddoctor.image = result.secure_url;
			founddoctor.image_id = result.public_id;
			founddoctor.description=req.sanitize(req.body.description);
			founddoctor.address = req.sanitize(req.body.address);
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
			res.redirect("/aplist");
		}
	});
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

app.get("/history/:id", isLoggedIn,isdoctor,function(req, res){
	user.findById(req.params.id).populate("appointments").exec(function(err, foundpatient){
        if(err){
            console.log(err);
        } else {
            res.render("history", {patient: foundpatient});
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
				review.author.id = req.sanitize(req.user._id);
				review.text=req.sanitize(req.body.text);
				review.author.username = req.user.username;
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
 
 app.post("/addappointment",isLoggedIn,isdoctor, function(req, res){
	user.findById(req.user.id, function(err, doctor){
		if(err){
			console.log(err);
			res.redirect("/");
		} else {
		 appointment.create(
			 {
				patientname : req.sanitize(req.body.patientname),
				doctorname : doctor.fname,
				patientcn : req.sanitize(req.body.patientcn),
				doctorcn : doctor.contactnumber,
				appointmentdate :req.body.appointmentdate,
				doctorid : doctor._id
				}, function(err, appointment){
			if(err){
				console.log(err);
			} else {
				appointment.save();
				doctor.appointments.push(appointment);
				doctor.save();
				res.redirect("/aplist");
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
				foundappointment.time=req.sanitize(req.body.time);
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
				foundappointment.description=req.sanitize(req.body.description);
				foundappointment.prescription=req.sanitize(req.body.prescription);
				foundappointment.billamount=req.sanitize(req.body.billamount);
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

app.listen(process.env.PORT||3000, function(){
	console.log("The Clinicapp Server Has Started!");
 });
