// var express = require('express');

// var JiraApi = require('jira-client');
// // var bodyParser = require('body-parser');

// // var app = express();
// // var port = process.env.PORT || 3000;
// // app.use(express.static(__dirname));

// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));


// // With ES5
// console.log("done")
// console.log(JiraApi)

// //Initialize
// var jira = new JiraApi({
//   protocol: 'https',
//   host: 'pournima.atlassian.net',
//   username: 'pournimam@hexaware.com',
//   password: 'Pournima108',
//   apiVersion: '2',
//   strictSSL: true
// });
// console.log(JSON.stringify(jira));

// jira.findIssue(issueNumber)
//   .then(function(issue) {
//     console.log('Status: ' + issue.fields.status.name);
//   })
//   .catch(function(err) {
//     console.error(err);
//   });

// app.listen(port);
// console.log("Server Running Successfully at port " + port);

// var Client = require('node-rest-client').Client;
// var b64 = require('base-64');
// const baseUrl = "https://pournima.atlassian.net//rest/"
// var userMapping = {
//     "Pournima Mishra": "admin",
// };


// class JIRA {

//     // constructor(username, password) {
//     //     this.client = new Client();
//     //     this.auth = b64.encode(username + ":" + password);
//     // }

//     addComment(issueID, body, callback) {
//         var postArgs = {
//             headers: {
//                 // Do authorization for this request
//                 "Authorization": "Basic " + this.auth,
//                 "Content-Type": "application/json"
//             },
//             data: {
//                 "body": body
//             }
//         }

//         this.client.post(baseUrl + "api/2/issue/" + issueID + "/comment",
//             postArgs, function(data, response) {
//                 console.log('status code of addComment:', response.statusCode);
//                 if (!!callback) {
//                     callback(data);
//                 }
//         });
//         console.log("added cooment");
//         return "Added comment: '" + body +"' to issue: " + issueID;
//     }

//     assign(issueID, assignee, callback) {
//         var putArgs = {
//             headers: {
//                 // Do authorization for this request
//                 "Authorization": "Basic " + this.auth,
//                 "Content-Type": "application/json"
//             },
//             data: {
//                 "name": userMapping[assignee]
//             }
//         };

//         this.client.put(baseUrl + "api/2/issue/" + issueID + "/assignee",
//             putArgs, function(data, response) {
//                 console.log('status code of assign:', response.statusCode);
//                 if (!!callback) {
//                     callback(data);
//                 };
//         });
//         console.log("Assigning issue");
//         return "Assigning issue: " + issueID + " to " + userMapping[assignee];
//     }

//     getTransitions(issueID, callback) {
//         var getArgs = {
//             headers: {
//                 // Do authorization for this request
//                 "Authorization": "Basic " + this.auth,
//                 "Content-Type": "application/json"
//             },
//             data: {
//                 "expand": "transitions.fields"
//             }
//         };
//         this.client.get(baseUrl + "api/2/issue/" + issueID + "/transitions",
//             getArgs, function(data, response) {
//                 //console.log(data.transitions[3]);
//                 //console.log(data.transitions);
//                 if (!!callback) {
//                         callback(data);
//                     };
//                 });
//                 console.log("Got transitions");
//         return "Got transitions";
//     }

//     // Sends message to people in list teamMembers, watchers,
//     // and voters of this issue
//     notifyOnIssue(issueId, subject, textBody, teamMembers,callback) {
//         if (!subject) {
//             subject = "Issue update";
//         }

//         var postArgs = {
//             headers: {
//                 // Do authorization for this request
//                 "Authorization": "Basic " + this.auth,
//                 "Content-Type": "application/json"
//             },
//             data: {
//                 "subject": subject,
//                 "textBody": textBody,
//                 "users": []
//             }
//         };

//         if (teamMembers != null) {
//             for(var i = 0; i < teamMembers.length;i++) {
//                 console.log("Sending message to " + teamMembers[i]);
//                 postArgs.data.users.push({
//                     "name": userMapping[teamMembers[i]],
//                     "active": true
//                 });
//             }
//         }
//         console.log(postArgs.data.users);


//         this.client.post(baseUrl + "api/2/issue/" + issueId + "/notify",
//             postArgs, function(data, response) {
//                 console.log('status code of notifyOnIssue:', response.statusCode);
//                 if (!!callback) {
//                     callback(data);
//                 };
//         });
//         console.log("notifyOnIssue");
//         return "Query all"
//     }

//     queryAll(assignee, callback) {
//         var searchArgs = {
//             headers: {
//                 // Do authorization for this request
//                 "Authorization": "Basic " + this.auth,
//                 "Content-Type": "application/json"
//             },
//             data: {
//                 // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
//                 jql: "assignee=" + assignee
//             }
//         };
//         this.client.post(baseUrl + "api/2/search", searchArgs, function(searchResult, response) {
//                 console.log('status code on queryAll:', response.statusCode);
//                 if (!!callback) {
//                     callback(searchResult);
//                 };
//         });
//         console.log("Query all");
//         return "Query all"
//     }

//     transition(issueID, columnId, callback) {
//         var postArgs = {
//             headers: {
//                 // Do authorization for this request
//                 "Authorization": "Basic " + this.auth,
//                 "Content-Type": "application/json"
//             },
//             data: {
//                 "transition": {
//                     "id": "21"
//                 },
//             }
//         };

//         this.client.post(baseUrl + "api/2/issue/" + issueID +
//             "/transitions",
//             postArgs, function(data, response) {
//                 console.log('status code on transition:', response.statusCode);
//                     if (!!callback) {
//                         callback(data);
//                     };
//         });
//         console.log("transition");
//         return "Issue " + issueID + " has been moved to column " + columnId;
//     }

//     updateDescription(issueID, description, callback) {
//         var putArgs = {
//             headers: {
//                 // Do authorization for this request
//                 "Authorization": "Basic " + this.auth,
//                 "Content-Type": "application/json"
//             },
//             data: {
//                 "update": {
//                     "description": [
//                         {
//                             "set": description
//                         }
//                     ],
//                 }
//             }
//         };

//         this.client.put(baseUrl + "api/2/issue/" + issueID,
//             putArgs, function(data, response) {
//                 console.log('status code on updateDescription:', response.statusCode);
//                 if (!!callback) {
//                     callback(data);
//                 };
//         });
//         console.log("updateDescription");
//         return "In issue " + issueID + ", set description to " + description;
//     }

//     updateSummary(issueID, summary, callback) {
//         var putArgs = {
//             headers: {
//                     // Do authorization for this request
//                     "Authorization": "Basic " + this.auth,
//                     "Content-Type": "application/json"
//             },
//             data: {
//                 "update": {
//                     "summary": [
//                         {
//                             "set": summary
//                         }
//                     ],
//                 }
//             }
//         };

//         this.client.put(baseUrl + "api/2/issue/" + issueID,
//             putArgs, function(data, response) {
//                 console.log('status code on updateSummary:', response.statusCode);
//                 if (!!callback) {
//                     callback(data);
//                 };
//         });
//         console.log("updateSummary");
//         return "In issue " + issueID + ", set summary to " + summary;
//     }

// }
// exports.JIRA = JIRA;
