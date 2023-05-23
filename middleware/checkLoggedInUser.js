const jwt = require("jsonwebtoken");
const InstructorModel = require("../models/InstructorModel");

const checkBlogAuthor = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1];
		const object = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.object = object;
		const blogId = req.params.blogId;

		Blog.findById(blogId)
			.then((foundBlog) => {
				if (foundBlog.user == object.user.id) {
					next();
				} else {
					res.json({ errorMessage: "unauthorized" });
				}
			})
			.catch((err) => {
				res.json({ errorMessage: "not found" });
			});
	} catch (err) {
		res.json({ errorMessage: err });
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



module.exports = {isLoggedIn:isLoggedIn, checkBlogAuthor:checkBlogAuthor};

