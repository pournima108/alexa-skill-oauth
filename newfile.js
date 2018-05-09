var Alexa = require("alexa-sdk");
var { JIRA } = require('./app');
var express = require('express')
var app = express()
var  request = require('request');
var server = require('http').createServer(app)
var port = process.env.PORT || 3000

const jiraUsername = "admin";
const jiraPassword = "Pournima108";
console.log("jiraUsername");
console.log("jiraPassword")


app.post('/webhook', function(req, res){
    console.log("webhook");
    var requestBody = "";

    req.on('data', function(data){
        requestBody+=data;
      });
    
      req.on('end', function()  {
        var responseBody = {};
       var jsonData = JSON.parse(requestBody); 
      if(jsonData.request.type == "LaunchRequest") {
          console.log("launch request")
        // sending a response
            responseBody = {
                "version": "0.1",
                "response": {
                    "outputSpeech": {
                        "type": "PlainText",
                        "text": 'Welcome to my Jira assiatant',
                    },
                    "card": {
                        "type": "Standard",
                        "title": "Welcome",
                        "text": "Welcome to Jira assistant",
                    },
                    "reprompt": {
                        "outputSpeech": {
                            "type": "PlainText",
                            "text": "Say a command"
                        }
                    },
                    "shouldEndSession": false
                },
            };
        }
        else if(jsonData.request.type == "IntentRequest") {
            if (jsonData.request.intent.name == "InitialIntent") {
                var jiraSession=new JIRA(jiraUsername,jiraPassword)
                var output=this;
                jiraSession.queryAll(jiraUsername,function(results){
                    console.log(resulrs);
                    var attributeObject=[];
                    var issueTypes={
                        toDo:0,
                        inProgress:0,
                        done:0,
                    }
                    for(var i=0;i<results.issues.length;i++){
                        var issue=results.issues[i];
                        var atribute={id:issue.id,summary:issue.fields.summary,column:issue.fiels.status.name}
                        attributeObject.push(attribute);
                        console.log(issue);
                         switch (issue.fields.status.name) {
                            case "To Do":
                                 issueTypes.toDo++;
                                 break;
                            case "In Progress":
                                 issueTypes.inProgress++;
                                 break;
                            case "Done":
                                 issueTypes.done++;
                                 break;
                }
                    }
               
                output.attributes["issues"] = JSON.stringify(attributeObject)
                var speechOutputText = "Welcome to JIRA Voice. Here is an overview of your issues. ";
                speechOutputText += "You currently have " + issueTypes.toDo + " issues in To Do, ";
                speechOutputText += issueTypes.inProgress + " issues In Progress, and ";
                speechOutputText += issueTypes.done + " in Done. ";
          
                    responseBody = {
                    "version": '1.0',
                    "response": {
                        "shouldEndSession": false,
                        "outputSpeech": { "type": 'SSML', "ssml": '<speak>' + speechOutputText+ '</speak>' } 
                    },
                    "sessionAttributes": {},
                    "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
                    }
                })
                }
                else if(jsonData.request.intent.name == "ListIssuesIntent"){
                   var issues=JSON.parse(this.attributes["issues"]);
                   var column =jsonData.request.intent.slots.column.value.toLowerCase();
                   var message = "";
                   for (var i=0;i<issues.length;i++){
                       var issue=issues[i];
                       if(issue.column.toLowerCase()==column){
                           message +="Issue" +issue.id +"." + issue.summary +" ";
                       }
                   }
                    var speechOutputText =message;
                   responseBody = {
                        "version": '1.0',
                        "response": {
                            "shouldEndSession": false,
                            "outputSpeech": { "type": 'SSML', "ssml": '<speak>' + speechOutputText+ '</speak>' } 
                        },
                        "sessionAttributes": {},
                        "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
                        }
                }
                    else if (jsonData.request.intent.name == "AssignIssueIntent") {
                    var  jiraSession=new JIRA(jiraUsername,jiraPassword);
                    var output=this;
                    var issue =jsonData.request.intent.slots.issue.value;
                    var assigneee =jsonDatarequest.intent.slots.assignee.value;
                    var speechOutput;
                    if(!issue || !assignee){
                      var  speechOutputText= "I'm sorry, there was an issue with your arguments. Please try again"
                      console.log(speechOutputText)
                    }
                    jiraSession.assign(issue,assignee,function(result){
                        speechOutputText ="Issue " + issue + " has been assigned to " + assignee;
                        console.log(speechOutputText)
                    })
                    responseBody = {
                        "version": '1.0',
                        "response": {
                            "shouldEndSession": false,
                            "outputSpeech": { "type": 'SSML', "ssml": '<speak>' + speechOutputText+ '</speak>' } 
                        },
                        "sessionAttributes": {},
                        "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
                        }
                }
                else if (jsonData.request.intent.name == "UpdateSummaryIntent") {
                   var filledSlots =delegateSlotCollection.call(this);
                   var jiraSession =new JIRA(jiraUsername,jiraPassword)
                   var output = this;
                   var issue =isSlotValid(jsonData.request,"issue");
                   var description = isSlotValid(jsonData.request,"description")
                   var speechOutput;
                   if(!issue || !summary){
                       var speechOutputText="There is no such issue present with your argument please try again "
                       console.log(speechOutputText)

                   }
                   else{
                       jiraSession.updateSummary(issue,summary,function(result){
                        speechOutputText ="The summary for" +issue + "has been updated"
                        console.log(speechOutputText)

                       })
                   }
                    responseBody = {
                        "version": '1.0',
                        "response": {
                            "shouldEndSession": false,
                            "outputSpeech": { "type": 'SSML', "ssml": '<speak>' + speechOutputText+ '</speak>' } 
                        },
                        "sessionAttributes": {},
                        "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
                        }
                }
                else if (jsonData.request.intent.name == "UpdateDescriptionIntent") {
                    var filledSlots =delegateSlotCollection.call(this);
                    var jiraSession =new JIRA(jiraUsername,jiraPassword)
                    var output = this;
                    var issue =isSlotValid(jsonData.request,"issue");
                    var description = isSlotValid(jsonData.request,"description")
                    var speechOutput;
                    if(!issue || !description){
                        var speechOutputText="There is no such issue present with your argument please try again "
                        console.log(speechOutputText)

                    }
                    else{
                        jiraSession.updateDescription(issue,summary,function(result){
                            speechOutputText ="The description for" +issue + "has been updated"
                            console.log(speechOutputText)

                        })
                    }
                     responseBody = {
                         "version": '1.0',
                         "response": {
                             "shouldEndSession": false,
                             "outputSpeech": { "type": 'SSML', "ssml": '<speak>' + speechOutputText+ '</speak>' } 
                         },
                         "sessionAttributes": {},
                         "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
                         }
                 }
                 else if (jsonData.request.intent.name == "AddCommentIntent") {
                    var filledSlots =delegateSlotCollection.call(this);
                    var jiraSession =new JIRA(jiraUsername,jiraPassword)
                    var output = this;
                    var issue =isSlotValid(jsonData.request,"issue");
                    var body = isSlotValid(jsonData.request,"comment")
                    var  speechOutput
                    if(!issue || !body){
                        var speechOutputText="There is no such issue present with your argument please try again "
                        console.log(speechOutputText)
                    }
                    else{
                        jiraSession.addComment(issue,body,function(result){
                            speechOutputText ="Added your comment " + body + " to issue " +issue ;
                            console.log(speechOutputText)
                        })
                    }
                     responseBody = {
                         "version": '1.0',
                         "response": {
                             "shouldEndSession": false,
                             "outputSpeech": { "type": 'SSML', "ssml": '<speak>' + speechOutputText+ '</speak>' } 
                         },
                         "sessionAttributes": {},
                         "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
                         }
                 }
                 else if (jsonData.request.intent.name == "MoveIssueIntent") {
                    var jiraSession =new JIRA(jiraUsername,jiraPassword)
                    var output = this;
                    var issue =isSlotValid(jsonData.request,"issue");
                    var description = isSlotValid(jsonData.request,"description")
                    var  speechOutput
                    if(!issue || !summary){
                        var speechOutputText="There is no such issue present with your argument please try again "
                        console.log(speechOutputText)
                    }
                    column =column.toLowerCase();
                    var columns={
                        "to do ":"11",
                        "in progress":"21",
                        "done":"31"
                    }
                    var selectedTransition = columns[column];
                        jiraSession.transition(issue, selectedTransition,function(result){
                            speechOutputText ="Moved issue to " + column ;
                            console.log(speechOutputText)
                        })
                     responseBody = {
                         "version": '1.0',
                         "response": {
                             "shouldEndSession": false,
                             "outputSpeech": { "type": 'SSML', "ssml": '<speak>' + speechOutputText+ '</speak>' } 
                         },
                         "sessionAttributes": {},
                         "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
                         }
                 }
                else if (jsonData.request.intent.name == "satisfactoryIntent") {
                    console.log(jsonData.request.intent.name);
                responseBody = {
                "version": '1.0',
                "response": {
                    "shouldEndSession": true,
                    "outputSpeech": { "type": 'SSML', "ssml": '<speak> Thanks for using calculator Goodbye!</speak>' } 
                },
                "sessionAttributes": {},
                "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
            };
        }
        res.statusCode = 200;
        res.contentType('application/json');
        res.send(responseBody);
        }  
    
        function delegateSlotCollection(){
            console.log("in delegateSlotCollection");
            console.log("current dialogState: "+this.event.request.dialogState);
            if (jsonData.request.dialogState === "STARTED") {
                console.log("in Beginning");
                var updatedIntent=jsonData.request.intent;
                //optionally pre-fill slots: update the intent object with slot values for which
                //you have defaults, then return Dialog.Delegate with this updated intent
                // in the updatedIntent property
                responseBody = {
                    "version": "1.0",
                    "response": {
                        "directives": [
                            {
                                "type": "Dialog.Delegate",
                                "updatedIntent": updatedIntent
                                }
                        ],
                        "shouldEndSession": false
                    }
                };
            } else if (jsonData.request.dialogState !== "COMPLETED") {
                console.log("in not completed"); 
                var response ="in not completed"
                responseBody = {
                    "version": "1.0",
                    "response": {
                        "directives": [
                            {
                                "type": "Dialog.Delegate",
                                "updatedIntent": response
                                }
                        ],
                        "shouldEndSession": false
                    }
                }
                
                // return a Dialog.Delegate directive with no updatedIntent property.
            } else {
                console.log("in completed");
                console.log("returning: "+ JSON.stringify(jsonData.request.intent));
                // Dialog is now complete and all required slots should be filled,
                // so call your normal intent handler.
                return this.event.request.intent;
            }
        }
        
        function isSlotValid(request, slotName){
            var slot = request.intent.slots[slotName];
            //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
            var slotValue;
        
            //if we have a slot, get the text and store it into speechOutput
            if (slot && slot.value) {
                //we have a value in the slot
                slotValue = slot.value.toLowerCase();
                return slotValue;
            } else {
                //we didn't get a value in the slot.
                return false;
            }
        }
    
    });
    
    });

        // parsing the requestBody for information


        app.listen(port, () => console.log('Webhook server is listening, port ',port))




var express = require('express');
var session = require('express-session');
var JiraClient = require('jira-connector');
var fs = require('fs');
var app = express();
var Alexa = require("alexa-sdk");
var server = require('http').createServer(app)
var port = process.env.PORT || 3000
app.use(session({ secret: 'red', saveUninitialized: true, resave: true }));

// var jira = new JiraClient({
//     host: 'myoauthexample.atlassian.net',
//     oauth: {
//         consumer_key: 'mykey',
//         private_key: "-----BEGIN RSA PRIVATE KEY----- \n"+"MIICXAIBAAKBgQDVxlGAhUHszH2/SG51TWvTbLGkJslX7cjHcxLCL3ZyK5dQkZN1kF4OqndbAUzwhpbUejetNEPMZS2svC0boD4pZ0NzhSKuMhe5WEp+ZFrvTFvK9ZdIXZDBSB18+ubp13zicJOGpj9oFw7QlUVD9k1KB461EiQ3ScNd8kG/igttfwIDAQABAoGAW3QlR+s6Ydi17xBImQxPFbsJYCVru58xZwo2uzZc4Mj/SeuNfx0M8A9DUn6C8N9TRYEnsoSKgLXETYKPdaMfFATkJ02otE7ngxt4GtgO+dLoj97zTgPEWjVyl/Q+C9naO8h87Rl6PKwCTqGfAQgNv1LBTObymBzcWLK4fASsR5ECQQD4Ie+qYdgdI1On1HE8bK5FAvgZ8dtPAVAaRuMukGbp7qhetk/XvMyFvZ6Cs8iOASMXw1rg7xIWK28ZDvT1MK83AkEA3I2AznjneG+wsJZHvNZXb8y5CmKWxANgQJztUazE6HEJ/VTlJ8wQRBt91yqsKlHWTqYAWiLrcfPdp4/PII2H+QJBAJWRXzYE5JAryzFPDTKvEBzpPUPmVZu53t73+9kFkgNQqIzuuBIC7AVx1ypR1IJEjTK1vwH3GZ/jboRcT6u8POECQELuyqVeedjKBJRCtziuz9BFD+7/5oNMBvz04uzDguqLy51PE1BVlKYmtbUD5UXemiw6Iqc4K73kZWNBuHlHmnkCQBUHHlLx4E9d/PKERxnZCSoP2WCA9ldZABpmyFhmyKzO3QIw+ipDLiJAcF10Z5TNvc7nhptfUu/im0duG6Sk25I=\n"+"-----END RSA PRIVATE KEY-----",
//         token: "fM723QSDSAKNeVfZJzhcYqz31eSqTVpq",
//         token_secret: 'EJ3rCI4NtOxZvVLkNdGOSbjtwBlDA06a',
//     }
// })

// JiraClient.oauth_util.getAuthorizeURL({
//     host: 'myoauthexample.atlassian.net',
//     oauth: {
//         consumer_key:"mykey",
//         // private_key:fs.readFileSync('./jira.pem', 'utf8')
//          private_key: "-----BEGIN RSA PRIVATE KEY----- \n"+"MIICXAIBAAKBgQDVxlGAhUHszH2/SG51TWvTbLGkJslX7cjHcxLCL3ZyK5dQkZN1kF4OqndbAUzwhpbUejetNEPMZS2svC0boD4pZ0NzhSKuMhe5WEp+ZFrvTFvK9ZdIXZDBSB18+ubp13zicJOGpj9oFw7QlUVD9k1KB461EiQ3ScNd8kG/igttfwIDAQABAoGAW3QlR+s6Ydi17xBImQxPFbsJYCVru58xZwo2uzZc4Mj/SeuNfx0M8A9DUn6C8N9TRYEnsoSKgLXETYKPdaMfFATkJ02otE7ngxt4GtgO+dLoj97zTgPEWjVyl/Q+C9naO8h87Rl6PKwCTqGfAQgNv1LBTObymBzcWLK4fASsR5ECQQD4Ie+qYdgdI1On1HE8bK5FAvgZ8dtPAVAaRuMukGbp7qhetk/XvMyFvZ6Cs8iOASMXw1rg7xIWK28ZDvT1MK83AkEA3I2AznjneG+wsJZHvNZXb8y5CmKWxANgQJztUazE6HEJ/VTlJ8wQRBt91yqsKlHWTqYAWiLrcfPdp4/PII2H+QJBAJWRXzYE5JAryzFPDTKvEBzpPUPmVZu53t73+9kFkgNQqIzuuBIC7AVx1ypR1IJEjTK1vwH3GZ/jboRcT6u8POECQELuyqVeedjKBJRCtziuz9BFD+7/5oNMBvz04uzDguqLy51PE1BVlKYmtbUD5UXemiw6Iqc4K73kZWNBuHlHmnkCQBUHHlLx4E9d/PKERxnZCSoP2WCA9ldZABpmyFhmyKzO3QIw+ipDLiJAcF10Z5TNvc7nhptfUu/im0duG6Sk25I=\n"+"-----END RSA PRIVATE KEY-----"
//     }
// }, function (error, oauth) {
//     if(error){
//         console.log(error)
//     }
//     else{

//     console.log(JSON.stringify(oauth));
//     }
//     // this will print out an authorization url and token and a token secret
//     // visit the url to get a confirmation key
    
// });


// JiraClient.oauth_util.swapRequestTokenWithAccessToken({
//     host: 'myoauthexample.atlassian.net',
//     oauth: {
//         token: 'O5SaD2S7ZAzEglIxY6oLiuKfFCLoiXfj',
//         token_secret: 'EJ3rCI4NtOxZvVLkNdGOSbjtwBlDA06a',
//         oauth_verifier: 'QxiXtA',
//         consumer_key: 'mykey',
//         private_key: "-----BEGIN RSA PRIVATE KEY----- \n"+"MIICXAIBAAKBgQDVxlGAhUHszH2/SG51TWvTbLGkJslX7cjHcxLCL3ZyK5dQkZN1kF4OqndbAUzwhpbUejetNEPMZS2svC0boD4pZ0NzhSKuMhe5WEp+ZFrvTFvK9ZdIXZDBSB18+ubp13zicJOGpj9oFw7QlUVD9k1KB461EiQ3ScNd8kG/igttfwIDAQABAoGAW3QlR+s6Ydi17xBImQxPFbsJYCVru58xZwo2uzZc4Mj/SeuNfx0M8A9DUn6C8N9TRYEnsoSKgLXETYKPdaMfFATkJ02otE7ngxt4GtgO+dLoj97zTgPEWjVyl/Q+C9naO8h87Rl6PKwCTqGfAQgNv1LBTObymBzcWLK4fASsR5ECQQD4Ie+qYdgdI1On1HE8bK5FAvgZ8dtPAVAaRuMukGbp7qhetk/XvMyFvZ6Cs8iOASMXw1rg7xIWK28ZDvT1MK83AkEA3I2AznjneG+wsJZHvNZXb8y5CmKWxANgQJztUazE6HEJ/VTlJ8wQRBt91yqsKlHWTqYAWiLrcfPdp4/PII2H+QJBAJWRXzYE5JAryzFPDTKvEBzpPUPmVZu53t73+9kFkgNQqIzuuBIC7AVx1ypR1IJEjTK1vwH3GZ/jboRcT6u8POECQELuyqVeedjKBJRCtziuz9BFD+7/5oNMBvz04uzDguqLy51PE1BVlKYmtbUD5UXemiw6Iqc4K73kZWNBuHlHmnkCQBUHHlLx4E9d/PKERxnZCSoP2WCA9ldZABpmyFhmyKzO3QIw+ipDLiJAcF10Z5TNvc7nhptfUu/im0duG6Sk25I=\n"+"-----END RSA PRIVATE KEY-----"
//     }
// }, function (error, oauth) {
//     if(error){
//                 console.log(error)
//             }
//             else{
        
//             console.log(JSON.stringify(oauth));
//             }
//     // this will print out a permenant access token you can now use
// });




app.post('/webhook', function(req, res){
    console.log("webhook");
    var requestBody = "";

    req.on('data', function(data){
        requestBody+=data;
      });
    
      req.on('end', function()  {
        var responseBody = {};
       var jsonData = JSON.parse(requestBody); 
      if(jsonData.request.type == "LaunchRequest") {
          console.log("launch request")
  
        // sending a response
        var outputSpeechText;
        
            responseBody = {
                "version": "0.1",
                "response": {
                    "outputSpeech": {"type":"PlainText","text":"welcome to jira assitant Open jira app for account linking"},
                    "card": {
                      "type": "LinkAccount"
                    },
                    "shouldEndSession": false
                },
            };
        }
        else if(jsonData.request.type == "IntentRequest") {
            console.log("inside intent request ")
            if (jsonData.request.intent.name == "StartIntent") {
                var speechOutputText;
                console.log('inside initial intent');
                // jira.issue.getIssue({
                //     issueKey: 'SM-1'
                // }, function(error, issue) {
                   
                //     if(error){
                //         console.log(error)  
                //         speechOutputText="your have problem with" +error;
                //     }
                //     else{
                //         console.log(JSON.stringify(issue));
                //         speechOutputText="your issues are" +issue.aggregateprogress;
                //     }
                  
                // });
                responseBody = {
                    "version": '1.0',
                    "response": {
                        "shouldEndSession": false,
                        "outputSpeech": { "type": 'SSML', "ssml": '<speak>' + speechOutputText+ '</speak>' } 
                    },
                    "sessionAttributes": {},
                    "userAgent": 'ask-nodejs/1.0.25 Node/v6.10.0'
                    }
                }
                
            }
            res.statusCode = 200;
            res.contentType('application/json');
            res.send(responseBody);
            })  
        })


// app.get('/jira', function(req, res) {
// JiraClient.oauth_util.getAuthorizeURL({
//     host: 'pournima.atlassian.net',
//     oauth: {
//         consumer_key:"mykey",
//         // private_key:fs.readFileSync('./jira.pem', 'utf8')
//          private_key: "-----BEGIN RSA PRIVATE KEY----- \n"+"MIICXAIBAAKBgQDVxlGAhUHszH2/SG51TWvTbLGkJslX7cjHcxLCL3ZyK5dQkZN1kF4OqndbAUzwhpbUejetNEPMZS2svC0boD4pZ0NzhSKuMhe5WEp+ZFrvTFvK9ZdIXZDBSB18+ubp13zicJOGpj9oFw7QlUVD9k1KB461EiQ3ScNd8kG/igttfwIDAQABAoGAW3QlR+s6Ydi17xBImQxPFbsJYCVru58xZwo2uzZc4Mj/SeuNfx0M8A9DUn6C8N9TRYEnsoSKgLXETYKPdaMfFATkJ02otE7ngxt4GtgO+dLoj97zTgPEWjVyl/Q+C9naO8h87Rl6PKwCTqGfAQgNv1LBTObymBzcWLK4fASsR5ECQQD4Ie+qYdgdI1On1HE8bK5FAvgZ8dtPAVAaRuMukGbp7qhetk/XvMyFvZ6Cs8iOASMXw1rg7xIWK28ZDvT1MK83AkEA3I2AznjneG+wsJZHvNZXb8y5CmKWxANgQJztUazE6HEJ/VTlJ8wQRBt91yqsKlHWTqYAWiLrcfPdp4/PII2H+QJBAJWRXzYE5JAryzFPDTKvEBzpPUPmVZu53t73+9kFkgNQqIzuuBIC7AVx1ypR1IJEjTK1vwH3GZ/jboRcT6u8POECQELuyqVeedjKBJRCtziuz9BFD+7/5oNMBvz04uzDguqLy51PE1BVlKYmtbUD5UXemiw6Iqc4K73kZWNBuHlHmnkCQBUHHlLx4E9d/PKERxnZCSoP2WCA9ldZABpmyFhmyKzO3QIw+ipDLiJAcF10Z5TNvc7nhptfUu/im0duG6Sk25I=\n"+"-----END RSA PRIVATE KEY-----"
//     }
// }, function (error, oauth) {
//     if(error){
//         console.log(error)
//     }
//     else{

//     console.log(JSON.stringify(oauth));
//     }
//     // this will print out an authorization url and token and a token secret
//     // visit the url to get a confirmation key
//     res.send(oauth);
// });



// JiraClient.oauth_util.swapRequestTokenWithAccessToken({
//     host: 'pournima.atlassian.net',
//     oauth: {
//         token: 'iLf5MmB4RFNwTKvps5cNuDzsFEyDl4sP',
//         token_secret: '6leFo0N3vnxgFDq2Dh1dY8xh5Gglzlg8',
//         oauth_verifier: 'r1rXWD',
//         consumer_key: 'mykey',
//         private_key: "-----BEGIN RSA PRIVATE KEY----- \n"+"MIICXAIBAAKBgQDVxlGAhUHszH2/SG51TWvTbLGkJslX7cjHcxLCL3ZyK5dQkZN1kF4OqndbAUzwhpbUejetNEPMZS2svC0boD4pZ0NzhSKuMhe5WEp+ZFrvTFvK9ZdIXZDBSB18+ubp13zicJOGpj9oFw7QlUVD9k1KB461EiQ3ScNd8kG/igttfwIDAQABAoGAW3QlR+s6Ydi17xBImQxPFbsJYCVru58xZwo2uzZc4Mj/SeuNfx0M8A9DUn6C8N9TRYEnsoSKgLXETYKPdaMfFATkJ02otE7ngxt4GtgO+dLoj97zTgPEWjVyl/Q+C9naO8h87Rl6PKwCTqGfAQgNv1LBTObymBzcWLK4fASsR5ECQQD4Ie+qYdgdI1On1HE8bK5FAvgZ8dtPAVAaRuMukGbp7qhetk/XvMyFvZ6Cs8iOASMXw1rg7xIWK28ZDvT1MK83AkEA3I2AznjneG+wsJZHvNZXb8y5CmKWxANgQJztUazE6HEJ/VTlJ8wQRBt91yqsKlHWTqYAWiLrcfPdp4/PII2H+QJBAJWRXzYE5JAryzFPDTKvEBzpPUPmVZu53t73+9kFkgNQqIzuuBIC7AVx1ypR1IJEjTK1vwH3GZ/jboRcT6u8POECQELuyqVeedjKBJRCtziuz9BFD+7/5oNMBvz04uzDguqLy51PE1BVlKYmtbUD5UXemiw6Iqc4K73kZWNBuHlHmnkCQBUHHlLx4E9d/PKERxnZCSoP2WCA9ldZABpmyFhmyKzO3QIw+ipDLiJAcF10Z5TNvc7nhptfUu/im0duG6Sk25I=\n"+"-----END RSA PRIVATE KEY-----"
//     }
// }, function (error, oauth) {
//     if(error){
//                 console.log(error)
//             }
//             else{
        
//             console.log(JSON.stringify(oauth));
//             }
//     // this will print out a permenant access token you can now use
//     res.send(oauth);
// });


// var jira = new JiraClient({
//     host: 'pournima.atlassian.net',
//     oauth: {
//         consumer_key: 'mykey',
//         private_key: "-----BEGIN RSA PRIVATE KEY----- \n"+"MIICXAIBAAKBgQDVxlGAhUHszH2/SG51TWvTbLGkJslX7cjHcxLCL3ZyK5dQkZN1kF4OqndbAUzwhpbUejetNEPMZS2svC0boD4pZ0NzhSKuMhe5WEp+ZFrvTFvK9ZdIXZDBSB18+ubp13zicJOGpj9oFw7QlUVD9k1KB461EiQ3ScNd8kG/igttfwIDAQABAoGAW3QlR+s6Ydi17xBImQxPFbsJYCVru58xZwo2uzZc4Mj/SeuNfx0M8A9DUn6C8N9TRYEnsoSKgLXETYKPdaMfFATkJ02otE7ngxt4GtgO+dLoj97zTgPEWjVyl/Q+C9naO8h87Rl6PKwCTqGfAQgNv1LBTObymBzcWLK4fASsR5ECQQD4Ie+qYdgdI1On1HE8bK5FAvgZ8dtPAVAaRuMukGbp7qhetk/XvMyFvZ6Cs8iOASMXw1rg7xIWK28ZDvT1MK83AkEA3I2AznjneG+wsJZHvNZXb8y5CmKWxANgQJztUazE6HEJ/VTlJ8wQRBt91yqsKlHWTqYAWiLrcfPdp4/PII2H+QJBAJWRXzYE5JAryzFPDTKvEBzpPUPmVZu53t73+9kFkgNQqIzuuBIC7AVx1ypR1IJEjTK1vwH3GZ/jboRcT6u8POECQELuyqVeedjKBJRCtziuz9BFD+7/5oNMBvz04uzDguqLy51PE1BVlKYmtbUD5UXemiw6Iqc4K73kZWNBuHlHmnkCQBUHHlLx4E9d/PKERxnZCSoP2WCA9ldZABpmyFhmyKzO3QIw+ipDLiJAcF10Z5TNvc7nhptfUu/im0duG6Sk25I=\n"+"-----END RSA PRIVATE KEY-----",
//         token: "XIyDclt0yuS5kQkDEoaCYmnHbVU9n070",
//         token_secret: '6leFo0N3vnxgFDq2Dh1dY8xh5Gglzlg8',
//     }
// })


// jira.issue.getIssue({
//     issueKey: 'SM-1'
// }, function(error, issue) {
//     if(error){
//         console.log(error)
//     }
//     else{
//         console.log(JSON.stringify(issue));
//         res.send(issue)
//     }
  
// });

// jira.issue.assignIssue({
//     issueId:8,
//     issueKey:'SM-8',
//     assignee:'Pourab'
// },function(error,result){
//     if(error){
//         console.log(error)
//     }
//     else{
//         console.log(issue);
//     }
//     }
// )



// })
app.listen(port, () => console.log('Webhook server is listening, port ',port))
