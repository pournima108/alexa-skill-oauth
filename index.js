// var express = require('express');

var JiraApi = require('jira-client');
// var bodyParser = require('body-parser');

// var app = express();
// var port = process.env.PORT || 3000;
// app.use(express.static(__dirname));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// With ES5
console.log("done")
console.log(JiraApi)

//Initialize
var jira = new JiraApi({
  protocol: 'https',
  host: 'pournima.atlassian.net',
  username: 'pournimam@hexaware.com',
  password: 'Pournima108',
  apiVersion: '2',
  strictSSL: true
});
console.log(JSON.stringify(jira));

jira.findIssue(issueNumber)
  .then(function(issue) {
    console.log('Status: ' + issue.fields.status.name);
  })
  .catch(function(err) {
    console.error(err);
  });

// app.listen(port);
// console.log("Server Running Successfully at port " + port);