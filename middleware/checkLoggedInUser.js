const jwt = require("jsonwebtoken");
const InstructorModel = require("../models/InstructorModel");
const Courses = require("../models/Courses");

const checkAuthor = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1];
		const object = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.object = object;

		const CourseID = req.params.CourseID;

		Courses.findById(CourseID)
			.then((foundCourse) => {
				if (foundCourse.user == object.user.id) {
					next();
				} else {
					res.json({ errorMessage: "unauthorized" });
				}
			})
			.catch((error) => {
				res.json({ errorMessage: error });
			});
	} catch (error) {
		res.json({ errorMessage: error });
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

