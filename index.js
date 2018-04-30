var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var JiraClient = require('jira-connector');
 
var jira = new JiraClient( {
    host: 'jenjinstudios.atlassian.net',
    basic_auth: {
        base64: 'U2lyVXNlck9mTmFtZTpQYXNzd29yZDEyMw=='
    }
});


app.listen(port);
console.log("Server Running Successfully at port " + port);