const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

// tell express to use files in the public folder when it needs to use static files like images or css
app.use(express.static("public"));

// load the homepage and form to sign up
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

// post to the mailchimp database
app.post("/", function(req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  // create data object that will be sent to mailchimp
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

  // add api key to http request and specify post method
  const apiKey = process.env.MY_MAILCHIMP_API_KEY;
  const options = {
    auth: "taleipono:" + apiKey,
    method: "POST",
  };

  // create the url that the request will be sent to
  const list_id = process.env.MY_MAILCHIMP_LIST_ID;
  const url = "https://us10.api.mailchimp.com/3.0/lists/" + list_id;


  // create http request
  const request = https.request(url, options, function(response) {

    const status = response.statusCode;

    // send a success or error message based on the response status
    if (status === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

  });

  // send data through http request
  request.write(jsonData);
  request.end();
})

// redirect user back to homepage if there was an error
app.get("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is listening on port 3000");
})
