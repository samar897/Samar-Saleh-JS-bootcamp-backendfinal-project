//the course model will be have 6 row 

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CoursesSchema = new Schema
({
  CourseName: {
    type: String,
    required: [true, "You should fill the Course Name"],
  },
  CourseDescription :{ 
    type: String,
    require: [true, "You should fill the Course Description"],
    },
    CourseStartAt: {
    type: String,
    required: [true, "You should fill the Course Start At"],
  },
  CourseEndAt: {
    type: String,
    required: [true, "You should fill the Course End At"],
  },
  /*
here we Declear Variable to connect two table. 
the relation between Instructor and Courses will be One To Many 
  */
  InstCor: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "InstructorModel",//here we put name of the model we want to connect with it.
  },
   /*
here we Declear Variable to connect two table. 
the relation between Student (userCourse) and Courses (studentcourse) will be Many To Many.
  */
  studentcourse: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentModel",//here we put name of the model we want to connect with it.
  }]
},
{
  timestamps: true,
},);

const Courses = mongoose.model("Courses", CoursesSchema);

module.exports = Courses;
