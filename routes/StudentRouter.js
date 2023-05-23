const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");    
const dotenv= require("dotenv"); 
dotenv.config();
const jwt = require("jsonwebtoken");
const InstructorDB = require("../models/InstructorModel");
const Courses = require("../models/Courses");

const saltRounds = 10;
const StudentDB = require("../models/StudentModel");
const autoMiddlware = require("../middleware/checkLoggedInUser");

const isLoggedIn = autoMiddlware.isLoggedIn;
const isAuthor = autoMiddlware.isAuthor;



router.post("/Studentlogin", (req, res) => {
  const StudentEmail = req.body.StudentEmail;
  const StudentPassword = req.body.StudentPassword;


  StudentDB.findOne({ StudentEmail })
    .select("+InstructorPassword")
    .then((foundStudent) => {
      if (!foundStudent) {
        const data = "incorrect Instructor Email";
     res.status(401).json({ errorMessage: data });
        return;
      }

      const encryptedPassword = foundStudent.StudentPassword;

      bcrypt
        .compare(StudentPassword, encryptedPassword)
        .then((response) => {
          if (response) {
            const token = jwt.sign(
              {
                  studentlogin: {
                  StudentEmail: foundStudent.StudentEmail,
                  id: foundStudent._id,
                },
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );
            res.json({ user: foundStudent, token: token });
          } else {
            res.status(401).json({ errorMessage: "incorrect password" });
          }
        })
        .catch((errorMessage) => {
          res.status(401).json({ errorMessage });
        });
    })
    .catch((errorMessage) => {
      res.status(401).json({ errorMessage });
    });
});

router.post("/StudentRegister", function (req, res) {
  let StudentPassword = req.body.StudentPassword;

  if (StudentPassword) {
    bcrypt.hash(StudentPassword, saltRounds).then((encryptedpassword) => {
      const studentdb = new StudentDB({
        StudentName: req.body.StudentName,
        StudentPassword: encryptedpassword,
        StudentEmail: req.body.StudentEmail,
      });
      studentdb
        .save()
        .then((returnedValue) => {
          //here will be the response for result
          console.log("record created in DB");
          const token = jwt.sign(
            { 
              studentlogin: {
                StudentEmail: returnedValue.StudentEmail,
                id: returnedValue._id,
              },
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          res.json({ student: returnedValue, token: token });
          console.log(token);
        })
        .catch((error) => {
          console.log();
          console.log(error.message);
          res.status(401).json({ errorMessage: error.message });
          //res.render("InstructorLoginForm.ejs");
        });
    });
  } else {
    res.status(400).json({ errorMessage: "password feield is required" });
  }
});


router.get("/AllStudentCourses", (req, res) => {
  
  //لا تستخدم الهيدر ولا تكوكن 
   const opj = res.locals.opj;
   const user = opj.user.id;
   //const blogid = req.body.id;
   
    Blogs.find({user}).then((blog) => {
  
      res.json({ blog });
  
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  });

 

  router.post("/RegisterCourse", isLoggedIn, function (req, res) {

    let userCourse = req.body.userCourse; //id for Course will conncted to Student
    const object = res.locals.object;
    const d = object._id;
    //user: opj.user.id,
   
    //const me = "do";
  
    console.log(object);
  
    //res.json( d );

   // return;
    Courses.findById(userCourse).then((course) => {
    StudentDB.findOneAndUpdate({object}).then((returnedValue)=>{

      returnedValue.userCourse = userCourse;

      course.studentcourse.push(returnedValue);
      course.save().then(() => {
      returnedValue.save().then((value) => { 
        
      value.populate("userCourse").then((studentcourse) => {
      res.json({ courses : studentcourse });
    }); 

        }).catch((error) => {
          console.log("The Record not update");
          res.status(401).json({ errorMessage: error.message });
       }); 
      });
    });
    });
  });
  
  
module.exports = router;


