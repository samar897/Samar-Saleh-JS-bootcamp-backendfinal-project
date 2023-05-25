const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const InstructorDB = require("../models/InstructorModel");
const Courses = require("../models/Courses");
const saltRounds = 10;
const dotenv= require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();


/*
- the instructor  able to register in the system. 
- the instructor  able to login.
- Every user have there own session.
*/

router.get("/getInstructorRegister", (req, res) => {
  res.render("InstructorRegister.ejs");
});


router.get("/", (req, res) => {
  res.render("InstructorLoginForm.ejs");
});
router.get("/login", (req, res) => {
  res.render("InstructorLoginForm.ejs");
});

router.post("/Instructorlogin", (req, res) => {
  const InstructorEmail = req.body.InstructorEmail;
  const InstructorPassword = req.body.InstructorPassword;
  const AdminID="646e58091c39984480839ff3";

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
            if(req.session.InstructorID==AdminID){
              res.redirect("/PrincipalRouter/PrincipalInstructorList");
            }
            else{
              res.redirect("/in/OneInstructorInfo");
            }
           
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
          res.redirect("/in/OneInstructorInfo");
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


//The Instructor can update his/her or he can delete the account 

router.post("/updateInstructor/:InstructorID", (req, res) => {
 
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
      } else 
      {
        
        if (InstructorPassword) {
          bcrypt.hash(InstructorPassword, saltRounds).then((encryptedpassword) => {
      Courses.findById(InstructorID).then((course) => {
   // Courses.findById("645e28228d444e8fd9b420be").then((Tag) => {
       InstructorDB.findById(InstructorID).then((foundInstructor) => {
        foundInstructor.InstructorName=InstructorName,
        foundInstructor.InstructorPassword = encryptedpassword,
        foundInstructor.InstructorEmail = InstructorEmail,
        foundInstructor.contactInformation = contactInformation,
        foundInstructor.teachingExperience = teachingExperience,
 
          //Tag.save().then((savedblog) => {
          //  foundInstructor.InstructorCourses.push(course);
          //  foundInstructor.save().then(() => {
             // Tag.blogs = savedblog._id;
             foundInstructor.save().then((data) => {
                console.log();
                //res.send("record Updated in DB"+ data);
                res.redirect("/in/OneInstructorInfo");
           // });
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
});
} else {
res.render("errorMessage.ejs", { data: "password feield is required" });
}
    }
  });
} else {
    // res.redirect("/in/login");
    res.render("errorMessage.ejs", { data: "Please Login First" });
   }

   });

  router.get("/InstructorUpdate/:InstructorID2", (req, res) => {
    const InstructorID2 = req.params.InstructorID2;
    const InstructorID=req.session.InstructorID;

    console.log(InstructorID2 + " ");
    console.log(InstructorID + " ");

if (InstructorID) {
if(InstructorID2==InstructorID){

  res.render("InstructorRegister.ejs",{data:InstructorID});
 
 } else{
  res.render("errorMessage.ejs", { data: "You are Not Allowed" });

}
  } else {
    res.render("errorMessage.ejs", { data: "Please Login First" });
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

  router.get("/InstructorDelete/:InstructorID2", (req, res) => {

    const InstructorID2 = req.params.InstructorID2;
    const InstructorID=req.session.InstructorID;
    const AdminID="646e58091c39984480839ff3";

    console.log(InstructorID2 +" InstructorID2");
    console.log(InstructorID +" InstructorID");
    if (InstructorID) {
    if(req.session.InstructorID==AdminID){
      
        InstructorDB.findByIdAndDelete(InstructorID2).then((instructor) => { 
       //res.send("Your Account is Deleted");
       console.log("deleted");
       res.redirect("/PrincipalRouter/PrincipalInstructorList");
      })
      .catch((error) => {
        res.render("errorMessage.ejs", { data: error.message });
      });
  
    } else {
    if(InstructorID2==InstructorID){
   
      InstructorDB.findByIdAndDelete(InstructorID2).then((instructor) => { 
     //res.send("Your Account is Deleted");
     console.log("deleted");
     res.redirect("/in/login");
    })
    .catch((error) => {
      res.render("errorMessage.ejs", { data: error.message });
    });

} else {
  res.render("errorMessage.ejs", { data: "You are Not Allowed" });

}
} 
}else {
    res.redirect("/in/login");
  }
  
  });


router.get("/getCoursesUpdate/:CourseID", (req, res) => {
    const CourseID = req.params.CourseID;
    const InstructorID = req.session.InstructorID;
    console.log(CourseID);
    console.log(InstructorID);
    const AdminID="646e58091c39984480839ff3";

    if (InstructorID) {
      if(req.session.InstructorID==AdminID){
      
        res.render("AddCourses.ejs",{data: CourseID});

        } else {

          res.render("errorMessage.ejs", { data: "You are Not Allowed" });
        }
 

  } else {
    res.redirect("/in/login");
  }
  });




module.exports = router;



