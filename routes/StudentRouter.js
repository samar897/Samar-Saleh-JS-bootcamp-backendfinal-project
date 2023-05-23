const express = require("express");
const router = express.Router();

const StudentDB = require("../models/StudentModel");
const autoMiddlware = require("../middleware/checkLoggedInUser");

//const isLoggedIn = autoMiddleware.isLoggedIn;
//const isBlogAuthor = autoMiddlware.isBlogAuthor;
const verifyToken = autoMiddlware.verifyToken;


router.post("/Studentlogin", (req, res) => {
  const StudentEmail = req.body.StudentEmail;
  const StudentPassword = req.body.StudentPassword;

  StudentDB.findOne({ StudentEmail })
    .select("+InstructorPassword")
    .then((foundStudent) => {
      if (!foundStudent) {
        const data = "incorrect Instructor Email";
        res.render("errorMessage.ejs", { data });
        return;
      }

      const encryptedPassword = foundStudent.StudentPassword;

      bcrypt
        .compare(StudentPassword, encryptedPassword)
        .then((response) => {
          if (response) {
            const token = jwt.sign(
              {
                Instructor: {
                  StudentEmail: foundStudent.InstructorEmail,
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
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/InstructorRegister", function (req, res) {
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
              insa: {
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


module.exports = router;


