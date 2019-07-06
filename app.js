var express=require("express");
var app=express();
var bodyParser=require("body-parser");

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
	res.redirect("/signin");
	console.log("a doctor has signed up");
	console.log("name : "+req.body.fname);
	console.log("password : "+req.body.password);
	console.log("password : "+req.body.authenticationKey);
});

app.post("/psignup",function(req,res){
	res.redirect("/signin");
	console.log("a patient has signed up");
	console.log("name : "+req.body.fname);
	console.log("password : "+req.body.password);
});

app.listen(3000,function(){
	console.log("Server For Clinic App Has Started");
});
