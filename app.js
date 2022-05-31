const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// for storing & reading static image files
app.use(express.static("public"));

// obtain signup home page
app.get("/", function(req,res) {
  res.sendFile(__dirname + "/signup.html");
});

// submit signup info + add info to mailchimp
app.post("/", function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address:email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
        }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us19.api.mailchimp.com/3.0/list/e6dea1384b";
  const options = {
    method: "POST",
    auth: "ideasexecution:ed25f56b0964ecade699bfe13f848e0e-us19"
  }
  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();

  console.log(firstName, lastName, email);
});

//signup failure redirect
app.post("/failure", function(req,res){
  res.redirect("/");
})

// Mailchimp API Key
// ed25f56b0964ecade699bfe13f848e0e-us19
//list id = e6dea1384b

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
});
