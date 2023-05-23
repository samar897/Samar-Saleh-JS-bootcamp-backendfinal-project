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
    selecte: false,
    require: [true, "You should fill the Course Description"],
    },
    CourseStartAt: {
    type: String,
    required: [true, "You should fill the Course Start At"],
  },
  CourseEndAt: {
    type: String,
    required: [true, "You should fill the Course End At"],
    unique: true,
  },
  InstCor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InstructorModel",//here we put name of the model we want to connect with it.
  }
},
{
  timestamps: true,
},);

const Courses = mongoose.model("Courses", CoursesSchema);

module.exports = Courses;
