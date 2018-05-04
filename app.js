

var Client = require('node-rest-client').Client;
var b64 = require('base-64');
const baseUrl = "https://pournima.atlassian.net//rest/"
var userMapping = {
    "Pournima Mishra": "admin",
};


class JIRA {

    constructor() {
        var jira = new JiraClient({
            host: 'pournima.atlassian.net',
            oauth: {
                consumer_key: 'mykey',
                private_key: "-----BEGIN RSA PRIVATE KEY----- \n"+"MIICXAIBAAKBgQDVxlGAhUHszH2/SG51TWvTbLGkJslX7cjHcxLCL3ZyK5dQkZN1kF4OqndbAUzwhpbUejetNEPMZS2svC0boD4pZ0NzhSKuMhe5WEp+ZFrvTFvK9ZdIXZDBSB18+ubp13zicJOGpj9oFw7QlUVD9k1KB461EiQ3ScNd8kG/igttfwIDAQABAoGAW3QlR+s6Ydi17xBImQxPFbsJYCVru58xZwo2uzZc4Mj/SeuNfx0M8A9DUn6C8N9TRYEnsoSKgLXETYKPdaMfFATkJ02otE7ngxt4GtgO+dLoj97zTgPEWjVyl/Q+C9naO8h87Rl6PKwCTqGfAQgNv1LBTObymBzcWLK4fASsR5ECQQD4Ie+qYdgdI1On1HE8bK5FAvgZ8dtPAVAaRuMukGbp7qhetk/XvMyFvZ6Cs8iOASMXw1rg7xIWK28ZDvT1MK83AkEA3I2AznjneG+wsJZHvNZXb8y5CmKWxANgQJztUazE6HEJ/VTlJ8wQRBt91yqsKlHWTqYAWiLrcfPdp4/PII2H+QJBAJWRXzYE5JAryzFPDTKvEBzpPUPmVZu53t73+9kFkgNQqIzuuBIC7AVx1ypR1IJEjTK1vwH3GZ/jboRcT6u8POECQELuyqVeedjKBJRCtziuz9BFD+7/5oNMBvz04uzDguqLy51PE1BVlKYmtbUD5UXemiw6Iqc4K73kZWNBuHlHmnkCQBUHHlLx4E9d/PKERxnZCSoP2WCA9ldZABpmyFhmyKzO3QIw+ipDLiJAcF10Z5TNvc7nhptfUu/im0duG6Sk25I=\n"+"-----END RSA PRIVATE KEY-----",
                token: "XIyDclt0yuS5kQkDEoaCYmnHbVU9n070",
                token_secret: '6leFo0N3vnxgFDq2Dh1dY8xh5Gglzlg8',
            }
        })
    }

    addComment(issueID, body, callback) {
        var postArgs = {
            headers: {
                // Do authorization for this request
                "Authorization": "Basic " + this.auth,
                "Content-Type": "application/json"
            },
            data: {
                "body": body
            }
        }

        this.client.post(baseUrl + "api/2/issue/" + issueID + "/comment",
            postArgs, function(data, response) {
                console.log('status code of addComment:', response.statusCode);
                if (!!callback) {
                    callback(data);
                }
        });
        console.log("added cooment");
        return "Added comment: '" + body +"' to issue: " + issueID;
    }

    assign(issueID, assignee, callback) {
        var putArgs = {
            headers: {
                // Do authorization for this request
                "Authorization": "Basic " + this.auth,
                "Content-Type": "application/json"
            },
            data: {
                "name": userMapping[assignee]
            }
        };

        this.client.put(baseUrl + "api/2/issue/" + issueID + "/assignee",
            putArgs, function(data, response) {
                console.log('status code of assign:', response.statusCode);
                if (!!callback) {
                    callback(data);
                };
        });
        console.log("Assigning issue");
        return "Assigning issue: " + issueID + " to " + userMapping[assignee];
    }

    getTransitions(issueID, callback) {
        var getArgs = {
            headers: {
                // Do authorization for this request
                "Authorization": "Basic " + this.auth,
                "Content-Type": "application/json"
            },
            data: {
                "expand": "transitions.fields"
            }
        };
        this.client.get(baseUrl + "api/2/issue/" + issueID + "/transitions",
            getArgs, function(data, response) {
                //console.log(data.transitions[3]);
                //console.log(data.transitions);
                if (!!callback) {
                        callback(data);
                    };
                });
                console.log("Got transitions");
        return "Got transitions";
    }

    // Sends message to people in list teamMembers, watchers,
    // and voters of this issue
    notifyOnIssue(issueId, subject, textBody, teamMembers,callback) {
        if (!subject) {
            subject = "Issue update";
        }

        var postArgs = {
            headers: {
                // Do authorization for this request
                "Authorization": "Basic " + this.auth,
                "Content-Type": "application/json"
            },
            data: {
                "subject": subject,
                "textBody": textBody,
                "users": []
            }
        };

        if (teamMembers != null) {
            for(var i = 0; i < teamMembers.length;i++) {
                console.log("Sending message to " + teamMembers[i]);
                postArgs.data.users.push({
                    "name": userMapping[teamMembers[i]],
                    "active": true
                });
            }
        }
        console.log(postArgs.data.users);


        this.client.post(baseUrl + "api/2/issue/" + issueId + "/notify",
            postArgs, function(data, response) {
                console.log('status code of notifyOnIssue:', response.statusCode);
                if (!!callback) {
                    callback(data);
                };
        });
        console.log("notifyOnIssue");
        return "Query all"
    }

    queryAll(assignee, callback) {
        var searchArgs = {
            headers: {
                // Do authorization for this request
                "Authorization": "Basic " + this.auth,
                "Content-Type": "application/json"
            },
            data: {
                // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                jql: "assignee=" + assignee
            }
        };
        this.client.post(baseUrl + "api/2/search", searchArgs, function(searchResult, response) {
                console.log('status code on queryAll:', response.statusCode);
                if (!!callback) {
                    callback(searchResult);
                };
        });
        console.log("Query all");
        return "Query all"
    }

    transition(issueID, columnId, callback) {
        var postArgs = {
            headers: {
                // Do authorization for this request
                "Authorization": "Basic " + this.auth,
                "Content-Type": "application/json"
            },
            data: {
                "transition": {
                    "id": "21"
                },
            }
        };

        this.client.post(baseUrl + "api/2/issue/" + issueID +
            "/transitions",
            postArgs, function(data, response) {
                console.log('status code on transition:', response.statusCode);
                    if (!!callback) {
                        callback(data);
                    };
        });
        console.log("transition");
        return "Issue " + issueID + " has been moved to column " + columnId;
    }

    updateDescription(issueID, description, callback) {
        var putArgs = {
            headers: {
                // Do authorization for this request
                "Authorization": "Basic " + this.auth,
                "Content-Type": "application/json"
            },
            data: {
                "update": {
                    "description": [
                        {
                            "set": description
                        }
                    ],
                }
            }
        };

        this.client.put(baseUrl + "api/2/issue/" + issueID,
            putArgs, function(data, response) {
                console.log('status code on updateDescription:', response.statusCode);
                if (!!callback) {
                    callback(data);
                };
        });
        console.log("updateDescription");
        return "In issue " + issueID + ", set description to " + description;
    }

    updateSummary(issueID, summary, callback) {
        var putArgs = {
            headers: {
                    // Do authorization for this request
                    "Authorization": "Basic " + this.auth,
                    "Content-Type": "application/json"
            },
            data: {
                "update": {
                    "summary": [
                        {
                            "set": summary
                        }
                    ],
                }
            }
        };

        this.client.put(baseUrl + "api/2/issue/" + issueID,
            putArgs, function(data, response) {
                console.log('status code on updateSummary:', response.statusCode);
                if (!!callback) {
                    callback(data);
                };
        });
        console.log("updateSummary");
        return "In issue " + issueID + ", set summary to " + summary;
    }

}
exports.JIRA = JIRA;
