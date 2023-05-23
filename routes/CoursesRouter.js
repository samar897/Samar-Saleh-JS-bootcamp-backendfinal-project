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
  res.redirect("/in/login");
}
});

router2.get("/AddCourses/:InstructorID2", (req, res) => {
  const InstructorID2 = req.params.InstructorID2;
  console.log(InstructorID2);
  console.log(req.session.InstructorID);

  if (req.session.InstructorID) {
  res.render("AddCourses.ejs",{data:InstructorID2});
} else {
  res.redirect("/in/login");
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
 // res.redirect("/in/login");
 res.send( { data:  "error.message"});
}
});

/*
router.get("/CoursesDetails/:InstructorID", (req, res) => {






});*/

router2.get("/DeleteCourses/:CourseID", (req, res) => {

  const CourseID = req.params.CourseID;
  const InstructorID=req.session.InstructorID;
  if (InstructorID) {
    Courses.findByIdAndDelete(CourseID).then((courses) => { 
   //res.send(courses);
   console.log("deleted");
   res.redirect("/CoursesRouter/CoursesDetails");
  })
  .catch((error) => {
    res.render("errorMessage.ejs", { data: error.message });
  });

} else {
  res.redirect("/in/login");
}

});


router2.get("/CoursesUpdate/:InstructorID", (req, res) => {

  if (req.session.currentUser) {
    const InstructorID = req.params.InstructorID;
    const title = req.body.title;
    const body = req.body.body;
    const selectedTags = req.body.selectedTags;
  
    User.findById(InstructorID).then((foundInstructor) => {
      Tag.findById("645e28228d444e8fd9b420be").then((Tag) => {
        Blogs.findById(userID)
          .then((blog) => {
            blog.title = title;
            blog.body = body;
            blog.tags = selectedTags;
            blog.user = foundUser;
  
            Tag.save().then((savedblog) => {
              foundUser.BlogsM.push(savedblog);
              foundUser.save().then(() => {
                Tag.blogs = savedblog._id;
                blog.save().then(() => {
                  console.log("record Updated in DB");
                  res.redirect("/in/InstructorList");
                });
              });
            });
          })
          .catch((error) => {
            //  res.send("The Record not update");
            console.log("The Record not update");
            console.log(error.message);
            res.render("errorMessage.ejs", { data: error.message });
          });
      });
    });
  } else {
    res.redirect("/in/login");
  }
});




module.exports = router2;
