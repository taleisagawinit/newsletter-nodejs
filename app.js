const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// load the form on
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

// post to the mailchimp database
app.post("/", function(req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  }
  const jsonData = JSON.stringify(data);
  const options = {
    auth: "taleipono:c3b5f5548c4819936859e79ce26a2543-us10",
    method: "POST",
  };
  const list_id = "e368c9d2dd";
  const url = "https://us10.api.mailchimp.com/3.0/lists/" + list_id;

  const request = https.request(url, options, function(response) {

    const status = response.statusCode;

    // send a success or error message
    if (status === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      // console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();
  // res.send("Thanks for the info!")
})

// redirect user to form if there was an error
app.get("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server is listening on port 3000");
})
