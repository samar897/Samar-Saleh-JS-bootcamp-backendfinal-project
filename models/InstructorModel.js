const mongoose = require("mongoose");
//let uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const InstructorSchema = new Schema({
  InstructorName: {
    type: String,
    required: [true, "you should fill the Name"],
  },
  InstructorPassword :{
    type: String,
    selecte: true,
    require: [true, "you should fill the password"],
    },
  InstructorEmail: {
    type: String,
    required: [true, "you should fill the email"],
    //unique: true,
  },
  contactInformation: {
    type: String,
    required: [true, "you should fill the contactInformation"],
  },
  teachingExperience: {
    type: Number,
    required: [true, "you should fill the teachingExperience"],
  },
  InstructorCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",//here we put name of the model we want to connect with it.
  }]
},
{

  timestamps: true,
},
);

//InstructorSchema.plugin(uniqueValidator);

const Instructor = mongoose.model("Instructor", InstructorSchema);

module.exports = Instructor;


//style="float: right;"