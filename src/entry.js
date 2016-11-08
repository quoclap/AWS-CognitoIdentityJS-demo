console.log("hello from entry.js");
var config = require('./config.js');
console.log("Hello from entry.js");

var config = require('./config.js')

// Modules, e.g. Webpack:
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

//Use case 1
var poolData = {
    UserPoolId : config.userPoolId, // Your user pool id here
    ClientId : config.userPoolClientid // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var attributeList = [];

var dataEmail = {
    Name : 'email',
    Value : config.email
};

var dataPhoneNumber = {
    Name : 'phone_number',
    Value : config.phoneNumber
};
var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);

attributeList.push(attributeEmail);
attributeList.push(attributePhoneNumber);

userPool.signUp('quoclap', 'phuonghai123', attributeList, null, function(err, result){
    if (err) {
      console.log("bi loi roi!");
        console.log(err);
        return;
    }
  var cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
});
