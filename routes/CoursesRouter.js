const express = require("express");
const Courses = require("../models/Courses");
const router2 = express.Router();
const autoMiddlware = require("../middleware/checkLoggedInUser");
const InstructorDB = require("../models/InstructorModel");
const saltRounds = 10;
const dotenv= require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

/*Note Every error will be showing for you on another 
page to understand the error come from what. res.render("errorMessage.ejs", { data: error.message });
and I use Window history.back() with button to go back 
*/


router2.get("/OneListCourses", (req, res) => {

  const InstructorID=req.session.InstructorID;
  if (InstructorID) {
  
    Courses.find().then((courses) => { 
  // res.send(courses);
   res.render("OneListCourses.ejs", { data: courses, InstructorID});
  })
  .catch((error) => {
    res.render("errorMessage.ejs", { data: error.message });
  });

} else {
  res.render("errorMessage.ejs", { data: "Please Login First" });
}
});  

//the control will be get and print the ejs file for OneListCourses for one Course 
router2.get("/OneListCourses/:CourseID", (req, res) => {

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

//the control will be get and print the ejs file for AddCourses for Courses with ID to update
router2.get("/AddCourses/:InstructorID2", (req, res) => {
  const InstructorID2 = req.params.InstructorID2;
  console.log(InstructorID2);
  console.log(req.session.InstructorID);

  if (req.session.InstructorID) {
  res.render("AddCourses.ejs",{data:InstructorID2});
} else {
  res.render("errorMessage.ejs", { data: "Please Login First" });
}
});

//the control will be get and print the ejs file for AddCourses for adding Courses with ID to add new
router2.get("/AddCourses", (req, res) => {

  if (req.session.InstructorID) {
  res.render("AddCourses.ejs");
} else {
  res.render("errorMessage.ejs", { data: "Please Login First" });
}
});

//the action will be to add new courses
router2.post("/AddnewCourses", function (req, res) {
  const InstructorID = req.session.InstructorID;
 
  if (InstructorID) {
    const CourseName = req.body.CourseName;
    const CourseDescription  = req.body.CourseDescription;
    const CourseStartAt = req.body.CourseStartAt;
    const CourseEndAt = req.body.CourseEndAt;
    //const selectedCourses = req.body.selectedCourses;

    InstructorDB.findById(InstructorID).then((foundInstructor) => {
      //Courses.findById("645e28228d444e8fd9b420be").then((course) => {
          const newCourses = new Courses({
            CourseName: CourseName,
            CourseDescription: CourseDescription,
            CourseStartAt :CourseStartAt,
            CourseEndAt :CourseEndAt,
            InstCor: foundInstructor,
          });
          //to save the data on DB from form
  
          newCourses.save().then((savedvalue) => {
            foundInstructor.InstructorCourses.push(savedvalue);
            foundInstructor.save().then((savedvalue) => {
              //course.InstCor = savedvalue._id;
              //course.save().then((savedvalue) => {
              console.log("record created in DB");
              res.redirect("/in/OneInstructorInfo");
              //res.render("OneListCourses.ejs", { data: savedvalue});
              //});
            //});
          });
        })
        .catch((error) => {
          console.log("record not created in DB");
          console.log(error.message);
          res.render("errorMessage.ejs", { data: error.message });
        });
    });
} else {

 res.render("errorMessage.ejs", { data: "Please Login First" });
}
});


//to delete courses from db with code 
router2.get("/DeleteCourses/:CourseID", (req, res) => {
  const InstructorID = req.session.InstructorID;
  const CourseID = req.params.CourseID;


   if (InstructorID) {
    Courses.findById(CourseID).then((foundInstructor) => {
    if(foundInstructor.InstCor!=InstructorID){
      res.render("errorMessage.ejs", { data: "You are Not Allowed" });
    } else {
  Courses.findByIdAndDelete(CourseID).then((courses) => { 
   console.log("deleted");

   res.redirect("/in/OneInstructorInfo");
  }).catch((error) => {
    res.render("errorMessage.ejs", { data: error.message });
    
  }).catch((error) => {
    res.render("errorMessage.ejs", { data: error.message });
  });
}
  });
 
} else {
  res.render("errorMessage.ejs", { data: "Please Login First" });
}
});

//the Last two Control will be update the database for courses  
  router2.post("/CoursesUpdate/:CourseID", (req, res) => {

  const CourseID = req.params.CourseID;
  const InstructorID = req.session.InstructorID;
  const CourseName = req.body.CourseName;
  const CourseDescription  = req.body.CourseDescription;
  const CourseStartAt = req.body.CourseStartAt;
  const CourseEndAt = req.body.CourseEndAt;

  console.log(CourseID);
  console.log(InstructorID);

    if (InstructorID) {
      Courses.findById(CourseID).then((foundInstructor) => {
        if(foundInstructor.InstCor!=InstructorID){
          res.render("errorMessage.ejs", { data: "You are Not Allowed" });
        } else {
        Courses.findById(CourseID).then((course) => {
            course.CourseName = CourseName;
            course.CourseDescription = CourseDescription;
            course.CourseStartAt = CourseStartAt;
            course.CourseEndAt = CourseEndAt;
            course.InstCor = InstructorID;
           
                  course.save().then(() => {
                  console.log();
               
                  res.redirect("/in/OneInstructorInfo");
        })
          .catch((error) => {
           
            console.log("The Record not update");
            console.log(error.message);
            res.render("errorMessage.ejs", { data: error.message });
          });
        
 
    });
      }
    });
  } else {
    // res.redirect("/in/login");
    res.render("errorMessage.ejs", { data: "Please Login First" });
   }
  
   });


  router2.get("/getCoursesUpdate/:CourseID", (req, res) => {
    const CourseID = req.params.CourseID;
    const InstructorID = req.session.InstructorID;
    console.log(CourseID);
    console.log(InstructorID);

    if (InstructorID) {
      Courses.findById(CourseID).then((foundInstructor) => {
        if(foundInstructor.InstCor!=InstructorID){
          res.render("errorMessage.ejs", { data: "You are Not Allowed" });
        } else {
          res.render("AddCourses.ejs",{data: CourseID});
        }
  });

  } else {
    res.redirect("/in/login");
  }
  });


module.exports = router2;


/*

- the instructor  able to add a new course.
- the instructor  able to edit the course.
- the instructor  able to list all the courses he/she created.
- the instructor  able to delete any of the courses he created.
-There are no one can dalete or update for other only them self

*/
