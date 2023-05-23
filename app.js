 
//to call the lib express to use the func step 1
const express = require("express");  
const InstructorRouter = require("./routes/InstructorRouter");
const StudentRouter = require("./routes/StudentRouter");
const InstructorDB = require("./models/InstructorModel");
//const StudentRouter = require("./routes/StudentRouter");
const CoursesRouter = require("./routes/CoursesRouter");
const app = express();  // call the opject from lib step 2
//declear var to call mongoose to connection to DB.
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser"); 
const session = require("express-session"); 
const bcrypt = require("bcrypt");    
const dotenv= require("dotenv"); 
dotenv.config();
const bodyParser = require("body-parser"); //to take the value from form and they can read it
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const jwt = require("jsonwebtoken");
 

app.set("view engine", "ejs");  

app.use(express.static("public"));
app.use("/images", express.static("images"));


app.use(express.static("public"));
app.use("/css", express.static("css"));

app.use(session({ secret: "my secret" })); 
    
app.use(cookieParser());
   
app.use("/in", InstructorRouter);
app.use("/StudentRouter", StudentRouter);  
app.use("/CoursesRouter", CoursesRouter);  


mongoose.connect(process.env.DB_URL).then(() => { 
  //If the connection finished print the result on console
  console.log("=======connection succeeded========");
}) 
.catch((error) => {  
  //if there is any error will be show for you.
  console.log("=======connection not succeeded========");
  console.log(error.message);
});   
 
   
//STEP3 we will use the app from express lib to listen port
app.listen(8000, function () {
  console.log("listening");
});




