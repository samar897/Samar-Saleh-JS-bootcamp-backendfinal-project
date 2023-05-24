const jwt = require("jsonwebtoken");
const InstructorModel = require("../models/InstructorModel");
const Courses = require("../models/Courses");
const StudentDB = require("../models/StudentModel");

const checkAuthor = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1];
		const object = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.object = object;
		const studentlogin = object.studentlogin.id; 

		//const usercourseID = req.body.usercourseID;

		StudentDB.findById(studentlogin) 
			.then((foundstudent) => {	

				console.log( foundstudent._id +"  foundstudent._id");
				console.log(studentlogin+" studentlogin ");

				if (foundstudent._id == studentlogin ) {
					next();
				} else {
					res.json({ errorMessage: "unauthorized" });
				}
			
			})
			.catch((error) => {
				res.json({ errorMessage: error.message });
			});
	} catch (error) {
		res.json({ errorMessage: error.message });
	}
};

// ======= MIDDLEWARE ======= //
const isLoggedIn = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1];
		const object = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.object = object;
		next();
	} catch (err) {
		res.json({ errorMessage: err });
	}
};



module.exports = {isLoggedIn:isLoggedIn, checkAuthor:checkAuthor};

