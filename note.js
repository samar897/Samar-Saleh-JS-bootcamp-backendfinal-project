


/*app.post("/forEach", (req, res) => {
  User.find()
    .then((oneuser) => {
      console.log(req.body.in2);
      for (let i = 0; i < oneuser.length; i++) {
        if (req.body.in2 == i) {
          console.log(i);
          res.render("list2.ejs", { data: oneuser, i });
        }
      }
    })
    .catch((error) => {
      res.send(error.message);
    });
});
*/



/*<td>
              <a href="/deleteuser/<%=data[i]._id%>" class="btn btn-danger" role="button">delete</a>
              
             </td>
             app.get("/deleteuser/:userID", (req, res) => {
  const userID = req.params.userID;
  //عملية الحذف داخل الثين
  User.deleteOne({ _id: userID })
    .then((users) => {
      console.log("The user id was delete");
      res.redirect("/alluser");
    })
    .catch((error) => {
      res.send(error.message);
    });
});
/*for (let user of allUser){
user.fullName
user.email
user.phonenumber

}*/

/*
app.get("/createUsererror", (req, res) => {
  const u = new User({
    fullName: "Samar",
    id: "1093157522",
    phoneNumber: "0509955897",
    email: "samar.abdullrazzag@hotmail.com",
    age: "kk5",
  });

  u.save()
    .then(() => {
      res.send("record created in DB");
    })
    .catch((error) => {
      if (error.errors.hasOwnProperty("age")) {
        res.send("error in the age input");
      } else {
        res.send(error.message);
      }
    });
});
*/
/*
router.get('/', function(req, res, next) {
      
  User.find((err, docs) => {
      if (!err) {
          res.render("list.ejs", {
              data: docs
          });
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });
//the update for app for lab day 6
});
*/
////for(var i = 0; i< data.length; i++) {%>
/* <% if(data.length){
          //for(var i = 0; i< data.length; i++) {%>  
          <tr>
            <th scope="row"><%= (i+1) %></th>
            <td><%= data[<%= i %>].name%></td>
            <td><%= data[<%= i %>].id%></td>
            <td><%= data[<%= i %>].phoneNumber%></td>
            <td><%= data[<%= i %>].email%></td>
            <td><%= data[<%= i %>].age%></td>
          </tr>
          <% }      
           }else{ %>
               <tr>
                  <td colspan="1">No user</td>
               </tr>
            <% } %>    
          */
/*<form action="/forEach" method="post"> 
          <input name="in2"/>
          <button class="btn btn-danger"> Fetch one user </button>
         </form>  */
/*<th scope="row"><%= (1) %></th>
            <td><%= data.fullName %></td>
            <td><%= data.id %></td>
            <td><%= data.phoneNumber%></td>
            <td><%= data.email%></td>
            <td><%= data.age%></td>*/


  /*          
//update the DB
app.get("/updateUser/:userID", (req, res) => {
  const userid = req.params.userID;
  const newFullname = req.query.fullName;

  User.findById(userid).then((user) => {
    user.fullName = newFullname;
    user
      .save()
      .then(() => {
        res.send("record Updated in DB");
      })
      .catch((error) => {
        res.send("The Record not update");
        console.log(Error);
      });
  });
});

//for one element
app.get("/finduser", (req, res) => {
  User.findById("6454e4d40fd16917bd0119ce")
    .then((users) => {
      res.send(users);
      //res.render("list2.ejs", {data: user});
    })
    .catch((error) => {
      res.send(error.message);
    });
});





*/