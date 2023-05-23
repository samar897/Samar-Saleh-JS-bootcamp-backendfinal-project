const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    StudentName: {
      type: String,
      require: [true, "you should fill the title"],
    },
    StudentPassword: {
      type: String,
      selecte: false,
      require: [true, "you should fill the title"],
    },
    StudentEmail: {
      type: String,
      required: [true, "you should fill the email"],
      unique: true,
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

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
