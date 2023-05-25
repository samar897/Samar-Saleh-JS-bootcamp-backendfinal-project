const express = require("express");
const Courses = require("../models/Courses");
const router2 = express.Router();
const autoMiddlware = require("../middleware/checkLoggedInUser");
const InstructorDB = require("../models/InstructorModel");
const saltRounds = 10;
const dotenv= require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

/*
- the principal can list all the courses from both side 
- The principal can also remove any of the courses from both side 
*/

router2.get("/CoursesDetails", (req, res) => {

  const InstructorID=req.session.InstructorID;
  if (InstructorID) {
  
    Courses.find().then((courses) => { 
   //res.send(courses);
   res.render("CoursesList.ejs", { data: courses, InstructorID});
  })
  .catch((error) => {
    res.render("errorMessage.ejs", { data: error.message });
  });

} else {
  res.render("errorMessage.ejs", { data: "Please Login First" });
}
});  

router2.get("/CoursesDetails/:CourseID", (req, res) => {

  const CourseID =req.params.CourseID;
  const InstructorID=req.session.InstructorID;

  console.log(CourseID+" "+ "CourseID");
  console.log(InstructorID +" " + "InstructorID");

  if (InstructorID) {
    InstructorDB.findById(CourseID).populate("InstructorCourses").then((courses) => { 
   //res.send(courses);
   res.render("OneListCourses.ejs", { data: courses, InstructorID});
  })
  .catch((error) => {
    res.render("errorMessage.ejs", { data: error.message });
  });

} else {
  res.render("errorMessage.ejs", { data: "Please Login First" });
}
});

router2.get("/PrincipalInstructorList", (req, res) => {
  const InstructorID=req.session.InstructorID;
   //affect all the read and add on the table, the find funcation promise asy fun  
if (InstructorID) {
  InstructorDB.find()
  .populate("InstructorCourses")
  .then((instructor) => { 
 //res.send(Instructor);
 res.render("PrincipalInstructorList.ejs", { data: instructor, InstructorID});
})
.catch((error) => {
  res.render("errorMessage.ejs", { data: error.message });
});

}
else
{

res.redirect("/in/login");
}

});

router2.post("/PrincipalupdateInstructor/:InstructorID", (req, res) => {
 
  const InstructorID = req.session.InstructorID;
  const InstructorName=req.body.InstructorName;
  let InstructorPassword = req.body.InstructorPassword;
  const InstructorEmail=req.body.InstructorEmail;
  const contactInformation=req.body.contactInformation;
  const teachingExperience=req.body.teachingExperience;
  const AdminID="646e58091c39984480839ff3";
  
    if (InstructorID) {
      InstructorDB.findById(InstructorID).then((foundInstructor) => {
        if(foundInstructor._id!=InstructorID){
          res.render("errorMessage.ejs", { data: "You are Not Allowed" });
        } 
        else 
        {
          if(req.session.InstructorID==AdminID){
          if (InstructorPassword) {
            bcrypt.hash(InstructorPassword, saltRounds).then((encryptedpassword) => {
            Courses.findById(InstructorID).then((course) => {
             InstructorDB.findById(InstructorID).then((foundInstructor) => {
              foundInstructor.InstructorName=InstructorName,
              foundInstructor.InstructorPassword = encryptedpassword,
              foundInstructor.InstructorEmail = InstructorEmail,
              foundInstructor.contactInformation = contactInformation,
              foundInstructor.teachingExperience = teachingExperience,

                   foundInstructor.save().then((data) => {
                      console.log();
                      res.redirect("/PrincipalRouter/PrincipalInstructorList");
            
            })
              .catch((error) => {
                //  res.send("The Record not update");
                console.log("The Record not update");
                console.log(error.message);
                res.render("errorMessage.ejs", { data: error.message });
              });
          });
        });
      });
    } else {
      res.render("errorMessage.ejs", { data: "password feield is required" });
    }
        }
      } 
    });
  } else {
    // res.redirect("/in/login");
    res.render("errorMessage.ejs", { data: "Please Login First" });
   }
  
   });


   router2.get("/InstructorUpdate/:InstructorID2", (req, res) => {
    const InstructorID2 = req.params.InstructorID2;
    const InstructorID=req.session.InstructorID;
    const AdminID="646e58091c39984480839ff3";

    console.log(InstructorID2 + " ");
    console.log(InstructorID + " ");

if (InstructorID) {

     if(req.session.InstructorID==AdminID){

  res.render("PrincipalInstructorRegister.ejs",{data:InstructorID});
            }
            else
            {
 res.redirect("/in/OneInstructorInfo");

if(InstructorID2==InstructorID){

  res.render("InstructorRegister.ejs",{data:InstructorID});
 
 } else{
  res.render("errorMessage.ejs", { data: "You are Not Allowed" });

}}
  } else {
    res.render("errorMessage.ejs", { data: "Please Login First" });
  }
  });

  router2.get("/PrincipalDeleteCourses/:CourseID", (req, res) => {
    const InstructorID = req.session.InstructorID;
    const CourseID = req.params.CourseID;
    const AdminID="646e58091c39984480839ff3";
  
     if (InstructorID) {
      if(req.session.InstructorID==AdminID){
     Courses.findByIdAndDelete(CourseID).then((courses) => { 
     console.log("deleted"); 
     res.redirect("/PrincipalRouter/PrincipalInstructorList");
    }).catch((error) => {
      res.render("errorMessage.ejs", { data: error.message });
      
    }).catch((error) => {
      res.render("errorMessage.ejs", { data: error.message });
    });
  
    
  } else {
    res.render("errorMessage.ejs", { data: "You are Not Allowed" });
  
  }
  } else {
    res.render("errorMessage.ejs", { data: "Please Login First" });
  }
  });

module.exports = router2;
 