var JiraClient = require('jira-connector');
var fs = require('fs');

JiraClient.oauth_util.getAuthorizeURL({
    host: 'pournima.atlassian.net',
    oauth: {
        consumer_key:"mykey",
        // private_key:fs.readFileSync('./jira.pem', 'utf8')
         private_key: "-----BEGIN RSA PRIVATE KEY----- \n"+"MIICXAIBAAKBgQDVxlGAhUHszH2/SG51TWvTbLGkJslX7cjHcxLCL3ZyK5dQkZN1kF4OqndbAUzwhpbUejetNEPMZS2svC0boD4pZ0NzhSKuMhe5WEp+ZFrvTFvK9ZdIXZDBSB18+ubp13zicJOGpj9oFw7QlUVD9k1KB461EiQ3ScNd8kG/igttfwIDAQABAoGAW3QlR+s6Ydi17xBImQxPFbsJYCVru58xZwo2uzZc4Mj/SeuNfx0M8A9DUn6C8N9TRYEnsoSKgLXETYKPdaMfFATkJ02otE7ngxt4GtgO+dLoj97zTgPEWjVyl/Q+C9naO8h87Rl6PKwCTqGfAQgNv1LBTObymBzcWLK4fASsR5ECQQD4Ie+qYdgdI1On1HE8bK5FAvgZ8dtPAVAaRuMukGbp7qhetk/XvMyFvZ6Cs8iOASMXw1rg7xIWK28ZDvT1MK83AkEA3I2AznjneG+wsJZHvNZXb8y5CmKWxANgQJztUazE6HEJ/VTlJ8wQRBt91yqsKlHWTqYAWiLrcfPdp4/PII2H+QJBAJWRXzYE5JAryzFPDTKvEBzpPUPmVZu53t73+9kFkgNQqIzuuBIC7AVx1ypR1IJEjTK1vwH3GZ/jboRcT6u8POECQELuyqVeedjKBJRCtziuz9BFD+7/5oNMBvz04uzDguqLy51PE1BVlKYmtbUD5UXemiw6Iqc4K73kZWNBuHlHmnkCQBUHHlLx4E9d/PKERxnZCSoP2WCA9ldZABpmyFhmyKzO3QIw+ipDLiJAcF10Z5TNvc7nhptfUu/im0duG6Sk25I=\n"+"-----END RSA PRIVATE KEY-----"
    }
}, function (error, oauth) {
    if(error){
        console.log(error)
    }
    else{

    console.log(JSON.stringify(oauth));
    }
    // this will print out an authorization url and token and a token secret
    // visit the url to get a confirmation key
});