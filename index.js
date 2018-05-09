var express = require('express');
var session = require('express-session');
var JiraClient = require('jira-connector');
var fs = require('fs');
var app = express();
var Alexa = require("alexa-sdk");
var server = require('http').createServer(app)
var port = process.env.PORT || 3000
app.use(session({ secret: 'red', saveUninitialized: true, resave: true }));

var privateKeyData = fs.readFileSync(config["consumerPrivateKeyFile"], "utf8");

var consumer = 
  new OAuth("https://myoauthexample.atlassian.net/plugins/servlet/oauth/request-token",
                  "https://jdog.atlassian.com/plugins/servlet/oauth/access-token",
                  config["consumerKey"],
                  "",
                  "1.0",
                  "http://localhost:8080/sessions/callback",
                  "RSA-SHA1",
				  null,
                  privateKeyData);
                  
 consumer.getOAuthRequestToken(
                    function(error, oauthToken, oauthTokenSecret, results) {
                        if (error) {
                            console.log(error.data);
                              response.send('Error getting OAuth access token');
                        }
                        else {
                              request.session.oauthRequestToken = oauthToken;
                              request.session.oauthRequestTokenSecret = oauthTokenSecret;
                              response.redirect("https://myoauthexample.atlassian.net/plugins/servlet/oauth/authorize?oauth_token="+request.session.oauthRequestToken);
                        }
                    }
                )

consumer.getOAuthAccessToken (
                    request.session.oauthRequestToken, 
                    request.session.oauthRequestTokenSecret, 
                    request.query.oauth_verifier,
                    function(error, oauthAccessToken, oauthAccessTokenSecret, results){			
                        if (error) { 
                            console.log(error.data);
                            response.send("error getting access token");		
                        }
                        else {
                              request.session.oauthAccessToken = oauthAccessToken;
                              request.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
                              consumer.get("https://myoauthexample.atlassian.net/rest/api/latest/issue/JRADEV-8110.json", 
                                request.session.oauthAccessToken, 
                                request.session.oauthAccessTokenSecret, 
                                "application/json",
                                function(error, data, resp){
                                    console.log(data);
                                    data = JSON.parse(data);
                                    response.send("I am looking at: "+data["key"]);
                                }
                            );
                        }
                    }
                )
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
