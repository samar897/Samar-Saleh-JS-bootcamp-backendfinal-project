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
const checkAuthor = autoMiddlware.checkAuthor;



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
        .then((returnedStudentValue) => {
          //here will be the response for result
          console.log("record created in DB");
          const token = jwt.sign(
            { 
              studentlogin: {
                StudentEmail: returnedValue.StudentEmail,
                id: returnedStudentValue._id,
              },
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          res.json({ student: returnedStudentValue, token: token });
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


router.get("/AllCoursesOfStudent",isLoggedIn, (req, res) => {

   const object = res.locals.object;
   const studentlogin = object.studentlogin.id; 
  
    StudentDB.findById(studentlogin).populate("userCourse").then((StudentInfo) => {
  
      res.json({ StudentInfo });
  
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  });

  /*
/*
  if (foundCourse.studentlogin == object.studentlogin.id ) {
    next();
  } else {
    res.json({ errorMessage: "unauthorized" });
  }*/

   //let userCourse = req.body.userCourse; //id for Course will conncted to Student*/


 
   router.delete("/StudentDeleteCourse", isLoggedIn, checkAuthor,(req, res) => {
  
    let usercourseID = req.body.usercourseID; //id for Course will conncted to Student
    const object = res.locals.object;  
    const studentlogin = object.studentlogin.id;
   
      StudentDB.findById( studentlogin , { new: true }).populate("userCourse").then((result) => {
       result.userCourse.pull(usercourseID);
       result.save().then((savedvalue) => {
            
          console.log(" The course id was delete ");
          const message = " you are allowd to delete " + " The course id was delete" + savedvalue;
          res.json({ message });  
        }); 
        })
        .catch((error) => {
          res.status(400).json({ error: error.message });
        }); 
  });



  router.post("/RegisterCourse", isLoggedIn, function (req, res) {

    let usercourse = req.body.userCourse; //id for Course will conncted to Student
    const object = res.locals.object;
    const studentlogin = object.studentlogin.id; 

    Courses.findById(usercourse).then((course) => {
    StudentDB.findById(studentlogin).then((returnedStudentValue)=>{
   
     returnedStudentValue.userCourse.push(usercourse);
     
      course.studentcourse.push(returnedStudentValue);
      course.save().then(() => {
        returnedStudentValue.save().then((value) => { 
        
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


/*Courses.findById( usercourseID , { new: true }).populate("studentcourse").then((result) => {
          result.studentcourse.pull(studentlogin);
          result.save().then((savedvalue) => {*/