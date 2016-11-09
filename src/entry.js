console.log("Hello from entry.js");
var Chart = require('../node_modules/chart.js/dist/Chart.bundle.js');
// var Chart = require('../node_modules/chart.js/dist/chart.js');
//Lay thong so ngay thang
//Generating a string of the last X hours back
var ts = new Date().getTime();
var tsYesterday = (ts - (24 * 3600) * 1000);
var d = new Date(tsYesterday);
var yesterdayDateString = d.getFullYear() + '-'
+ ('0' + (d.getMonth()+1)).slice(-2) + '-'
+ ('0' + d.getDate()).slice(-2) + 'T'
+ ('0' + (d.getHours()+1)).slice(-2) + ':'
+ ('0' + (d.getMinutes()+1)).slice(-2) + ':'
+ ('0' + (d.getSeconds()+1)).slice(-2);
console.log("Datetime:" + yesterdayDateString);


var config = require('./config.js')
var AWS = require('aws-sdk');
AWS.config.region = 'eu-east-1';
// var dynamodb = null;
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
      AWS.config.region = 'us-east-1'; // Region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId : config.IdentityPoolId,
          Logins:{
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_VeoguFTId' : result.getIdToken().getJwtToken()
          }
      });

      // Instantiate aws sdk service objects now that the credentials have been updated.
      var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10',region:'us-east-1'});
      var params = {
        TableName: config.tableName
      };
      dynamodb.scan(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else{
          console.log("Data: " + JSON.stringify(data));
          listData(data);
        }
      });
      // //Query DynamoDB using the new documentClient
      // var docClient = new AWS.DynamoDB.DocumentClient();
    },
    onFailure: function(err) {
        alert(err);
    }
});

function listData(data){
  //console.log("Data: " + JSON.stringify(data));
  var recentEventsDateTime = [];
  var recentEventsCounter = [];
  var codData = [];
  var bodData = [];
  var doData = [];
  var phData = [];
  var dateHour;
  var cod;
  data.Items.forEach(function(item) {
      dateHour = JSON.stringify(item.Time.S);
      //cod = JSON.stringify(item.COD.N);
      //console.log("COD:" + cod);
      recentEventsDateTime.push(dateHour.slice(1, -4));
      //recentEventsCounter.push(item.EventCount.toString());
      codData.push(item.payload.M.COD.N);
      bodData.push(item.payload.M.BOD.N);
      doData.push(item.payload.M.DO.N);
      phData.push(item.payload.M.pH.N);

    });
    //Chart.js code
    //Create random values
    var randomScalingFactor = function() {
        return Math.round(Math.random() * 100 * (Math.random() > 0.5 ? -1 : 1));
    };
    var randomColorFactor = function() {
        return Math.round(Math.random() * 255);
    };
    var randomColor = function(opacity) {
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
    };

    var ctx = document.getElementById("myChart").getContext("2d");
    var background = randomColor(0.5);
    var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: recentEventsDateTime,
            datasets: [{
                label: "COD",
                data:codData,
                // backgroundColor = "rgba(255,0,0,0.3)",
                fill: true,
                //borderDash: [5, 5],
            }, {
                label: "BOD",
                data: bodData,
                fill: false,
                borderDash: [5, 5],
            }, {
                label: "DO",
                data: doData,
                //lineTension: 0,
                fill: false,
            }, {
                label: "pH",
                data: phData,
                fill: false,
            }]
        },
          //   datasets : [{
          //     label: 'COD',
          //     backgroundColor = background,
          //     borderColor = randomColor(0.6),
          //     pointBorderColor = randomColor(0.2),
          //     pointBackgroundColor = randomColor(0.3),
          //     pointBorderWidth = 1,
          //     fill: true,
          //     data:codData
          //   },
          //   {
          //     label: "BOD",
          //     data:bodData,
          //     // backgroundColor = randomColor(0.5),
          //     // borderColor = randomColor(0.6),
          //     // pointBorderColor = randomColor(0.2),
          //     // pointBackgroundColor = randomColor(0.3),
          //     pointBorderWidth = 1,
          //     fill: true,
          //   }]
          // },
          options: {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            },
            title: {
                display: true,
                text: 'Multi parameters Online monitoring System.'
            }
          }
      });

}
