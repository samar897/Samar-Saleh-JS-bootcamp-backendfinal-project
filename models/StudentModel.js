//on this file we will have Schema for Student we will create 5 row as below
const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    StudentName: {
      type: String,
      require: [true, "you should fill the StudentName"],
    },
    StudentPassword: {
      type: String, //you should avoid showing the passwords of the users or returning them in the API responses.
      selecte: false,
      require: [true, "you should fill the StudentPassword"],
    },
    StudentEmail: {
      type: String,
      required: [true, "you should fill the email"],
      unique: true, //the eamill must be unique to avoid any duplication of any data
    },
    userCourse: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    }], 
  },
  {
    timestamps: true,
  }
);

StudentSchema.plugin(uniqueValidator);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
