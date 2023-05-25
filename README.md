# Samar-Saleh-JS-bootcamp-backendfinal-project
## LMS Project 
###An LMS, or Learning Management System, is a software application for managing training and education.

This is a brief description of My project.

To get started, you will need to install the following dependencies:
### express - Mongoose - JWT - session - bcrypt - dotenv...

npm Nodemon app.js

The server will start on port 8000. You can access the application at http://localhost:8000.
it will open InstructorLoginForm page.

#Routers 
##There are Four Routers: StudentRouter.js,PrincipalRouter.js,InstructorRouter.js and CoursesRouter.js I called them On app.js.

<code>
//to use the image on ejs file with the path. external package 
app.use(express.static("public"));
app.use("/images", express.static("images"));


//The CSS file will be appeare when we use this command with the path. external package 
app.use(express.static("public"));
app.use("/css", express.static("css"));

app.use(session({ secret: "my secret" })); 
app.use(cookieParser()); 
</code>


#DataBase
## I use MongooseDB to Connect the server with express.
## I created three model on this project Courses.js, InstructorModel.js and StudentModel.js 
### The Relation between Courses and Students Many to Many and the Relation between Instructor and Courses is One to Many.
#### I use  unique: true, to put the email unique when they want to register on system.
<code> let uniqueValidator = require("mongoose-unique-validator"); InstructorSchema.plugin(uniqueValidator); </code>

##Connecting the DB with Express Code.
<code>
 mongoose.connect(process.env.DB_URL).then(() => { 
  //If the connection finished print the result on console
  console.log("=======connection succeeded========");
}) 
.catch((error) => {  
  //if there is any error will be show for you.
  console.log("=======connection not succeeded========");
  console.log(error.message);
});   
 
 </code>
 
 /* Note Every error will be showing for you on another page
 to understand the error come from what.
 res.render("errorMessage.ejs", { data: error.message });
and I use Window history.back() with button to go back 
*/

# Instructor Side (Dashboard):
##- the instructor  able to add a new course.
##- the instructor  able to edit the course.
##- the instructor  able to list all the courses he/she created.
##- the instructor  able to delete any of the courses he created.
##-There are no one can dalete or update for other only them self they can.
##The the relation on database between the Courses and instructor can add one both side and and update.

## Student Side (API):
##On both side connected Many to many they delete and update 
##The student can register in any of the courses. 
##The student can list all the courses he is registered in.
##The student can cancel the registration from the course.
##The the relation on database between the Courses and Student can add one both side and delete also and update.

# Principal Side (Dashboard).
##- the principal can list all the courses from both side 
##- The principal can also remove any of the courses from both side 
###for Principal Side he can update for all instructor and Delete them from system and See all the Data.
####should be there only one Admin Principal to login to the system and Control the site.

#Front End Side
##I use Bootstrap and CSS extenal Lib and I called them on app.js with Image.
## EJS files on View folder and there is partials include two file   <%- include('partials/navbar') %> and  <%- include('partials/footer') %>.


#- I deploied My project to the server with link: [My Link website](https://lmsjs.onrender.com/).









 
