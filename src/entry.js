console.log("Hello from entry.js");

var config = require('./config.js')
var AWS = require('aws-sdk');
AWS.config.region = 'eu-east-1';
var dynamodb = null;
// Modules, e.g. Webpack:
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

// //Use case 1
// var poolData = {
//     UserPoolId : config.userPoolId, // Your user pool id here
//     ClientId : config.userPoolClientId // Your client id here
// };
// var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
//
// var attributeList = [];
//
// var dataEmail = {
//     Name : 'email',
//     Value : config.email
// };
//
// var dataPhoneNumber = {
//     Name : 'phone_number',
//     Value : config.phoneNumber
// };
// var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
// var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
//
// attributeList.push(attributeEmail);
// attributeList.push(attributePhoneNumber);
//
// userPool.signUp('quoclap', 'phuonghai123', attributeList, null, function(err, result){
//     if (err) {
//       console.log("bi loi roi!");
//         console.log(err);
//         return;
//     }
//   var cognitoUser = result.user;
//     console.log('user name is ' + cognitoUser.getUsername());
// });

//====================================================================================================

// //Use case 2: Confirming a registered, unauthenticated user using a confirmation code received via SMS.
//
//     var poolData = {
//         UserPoolId : config.userPoolId, // Your user pool id here
//         ClientId : config.userPoolClientId // Your client id here
//     };
//
//     var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
//     var userData = {
//         Username : config.username,
//         Pool : userPool
//     };
//
//     var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
//     cognitoUser.confirmRegistration('977349', true, function(err, result) {
//         if (err) {
//             alert(err);
//             return;
//         }
//         console.log('call result: ' + result);
//     });
// //Use case 3. Resending a confirmation code via SMS for confirming registration for a unauthenticated user.
//     cognitoUser.resendConfirmationCode(function(err, result) {
//         if (err) {
//             alert(err);
//             return;
//         }
//         console.log('call result: ' + result);
//     });
// //====================================================================================================

//Use case 4. Authenticating a user and establishing a user session with the Amazon Cognito Identity service.
var authenticationData = {
    Username : config.username,
    Password : config.password,
};
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
var poolData = {
    UserPoolId : config.userPoolId, // Your user pool id here
    ClientId : config.userPoolClientId // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
    Username : config.username,
    Pool : userPool
};
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
        console.log('access token + ' + result.getAccessToken().getJwtToken());

        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //     IdentityPoolId : config.IdentityPoolId, // your identity pool id here
        //     Logins : {
        //         // Change the key below according to the specific region your user pool is in.
        //         'cognito-idp.' + config.region + '.amazonaws.com/' + config.userPoolId : result.getIdToken().getJwtToken()
        //     }
        // });
        //
        // // Instantiate aws sdk service objects now that the credentials have been updated.
        // // example: var s3 = new AWS.S3();
        // dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    },

    onFailure: function(err) {
        alert(err);
    },

});
