const express = require("express");
const Courses = require("../models/Courses");
const router2 = express.Router();
const autoMiddlware = require("../middleware/checkLoggedInUser");
const InstructorDB = require("../models/InstructorModel");
const saltRounds = 10;
const dotenv= require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

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
   res.render("CoursesList2.ejs", { data: courses, InstructorID});
  })
  .catch((error) => {
    res.render("errorMessage.ejs", { data: error.message });
  });

} else {
  res.render("errorMessage.ejs", { data: "Please Login First" });
}
});


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

///<%=data._id%>
router2.get("/AddCourses", (req, res) => {

  if (req.session.InstructorID) {
  res.render("AddCourses.ejs");
} else {
  res.render("errorMessage.ejs", { data: "Please Login First" });
}
});

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
              res.redirect("/CoursesRouter/CoursesDetails");
              //res.render("CoursesList.ejs", { data: savedvalue});
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
   res.redirect("/CoursesRouter/CoursesDetails");
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

      InstructorDB.findById(InstructorID).then((foundInstructor) => {
     // Courses.findById("645e28228d444e8fd9b420be").then((Tag) => {
        Courses.findById(CourseID).then((course) => {
            course.CourseName = CourseName;
            course.CourseDescription = CourseDescription;
            course.CourseStartAt = CourseStartAt;
            course.CourseEndAt = CourseEndAt;
   
            //Tag.save().then((savedblog) => {
              foundInstructor.InstructorCourses.push(course);
              foundInstructor.save().then(() => {
               // Tag.blogs = savedblog._id;
                  course.save().then((data) => {
                  console.log();
                  //res.send("record Updated in DB"+ data);
                  res.redirect("/CoursesRouter/CoursesDetails");
              });
             // });
           // });
        })
          .catch((error) => {
            //  res.send("The Record not update");
            console.log("The Record not update");
            console.log(error.message);
            res.render("errorMessage.ejs", { data: error.message });
          });
        
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
          res.render("AddCourses.ejs",{data:CourseID});
        }
  });

  } else {
    res.redirect("/in/login");
  }
  });


module.exports = router2;
