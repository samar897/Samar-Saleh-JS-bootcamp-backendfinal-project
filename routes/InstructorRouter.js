const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const InstructorDB = require("../models/InstructorModel");
const Courses = require("../models/Courses");
const saltRounds = 10;
const dotenv= require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();


router.post("/Instructorlogin", (req, res) => {
  const InstructorEmail = req.body.InstructorEmail;
  const InstructorPassword = req.body.InstructorPassword;

  InstructorDB.findOne({ InstructorEmail })
    .select("+InstructorPassword")
    .then((foundInstructor) => {
      if (!foundInstructor) {
        const data = "incorrect Instructor Email";
        res.render("errorMessage.ejs", { data });
        return;
      }

      const encryptedPassword = foundInstructor.InstructorPassword;
      bcrypt.compare(InstructorPassword, encryptedPassword).then((response) => {
          if (response) {
            req.session.InstructorID=foundInstructor._id;
            console.log(req.session.InstructorID);
           res.redirect("/in/OneInstructorInfo");
          } else {
            res.render("errorMessage.ejs", { data: "error.message" });
          }
        })
        .catch((error) => {
          res.render("errorMessage.ejs", { data: error.message });
        });
    })
    .catch((error) => {
      res.render("errorMessage.ejs", { data: error.message });
    });
});

router.post("/postInstructorRegister", function (req, res) {
  let InstructorPassword = req.body.InstructorPassword;

  if (InstructorPassword) {
    bcrypt.hash(InstructorPassword, saltRounds).then((encryptedpassword) => {
      const instructor = new InstructorDB({
        InstructorName: req.body.InstructorName,
        InstructorPassword: encryptedpassword,
        InstructorEmail: req.body.InstructorEmail,
        contactInformation: req.body.contactInformation,
        teachingExperience: req.body.teachingExperience,
      });
      instructor
        .save()
        .then((returnedValue) => {
          //here will be the response for result
          console.log("record created in DB");
          req.session.InstructorID=returnedValue._id;
          //res.json({ instructor: returnedValue, H :req.session.InstructorID});
          res.redirect("/in/InstructorList");
          console.log(returnedValue);
        })
        .catch((error) => {
          console.log();
          console.log(error.message);
          res.render("errorMessage.ejs", { data: error.message });
        });
    });
  } else {
    res.render("errorMessage.ejs", { data: "password feield is required" });
    
  }
});

router.get("/Logout", (req, res) => {
  req.session.destroy();
  res.redirect("/in/login");
});

router.get("/InstructorUpdate/:InstructorID", (req, res) => {

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

router.get("/OneInstructorInfo", (req, res) => {

const InstructorID=req.session.InstructorID;
  //affect all the read and add on the table, the find funcation promise asy fun  
if (req.session.InstructorID) {
 InstructorDB.findById(InstructorID)
 .populate("InstructorCourses")
 .then((Instructor) => { 
  //res.send(Instructor);
   res.render("OneInstructorInfo.ejs", { data: Instructor});
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

  router.get("/InstructorList", (req, res) => {

     //affect all the read and add on the table, the find funcation promise asy fun  
  if (req.session.InstructorID) {
    InstructorDB.find()
    .populate("InstructorCourses")
    .then((Instructor) => { 
   //res.send(Instructor);
   res.render("InstructorList.ejs", { data: Instructor});
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

  router.get("/InstructorDelete/:InstructorID2", (req, res) => {

    const InstructorID2 = req.params.InstructorID2;
    const InstructorID=req.session.InstructorID;
    if (InstructorID) {
      InstructorDB.findByIdAndDelete(InstructorID2).then((instructor) => { 
     //res.send("Your Account is Deleted");
     console.log("deleted");
     res.redirect("/in/login");
    })
    .catch((error) => {
      res.render("errorMessage.ejs", { data: error.message });
    });
  
  } else {
    res.redirect("/in/login");
  }

  });

router.get("/getInstructorRegister", (req, res) => {
  res.render("InstructorRegister.ejs");
});


router.get("/", (req, res) => {
  res.render("InstructorLoginForm.ejs");
});

router.get("/login", (req, res) => {
  res.render("InstructorLoginForm.ejs");
});






module.exports = router;
