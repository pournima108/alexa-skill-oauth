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
condsole.log("jiraPassword")


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
        if(jsonData.request.type == "LaunchRequest") {
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


