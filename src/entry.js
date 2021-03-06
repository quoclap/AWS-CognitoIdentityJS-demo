console.log("Hello from entry.js");
var Chart = require('../node_modules/chart.js/src/chart.js');
var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
// var Chart = require('../node_modules/chart.js/dist/chart.js');
//Lay thong so ngay thang
//Generating a string of the last X hours back
var ts = new Date().getTime();
console.log(ts);
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
AWS.config.region = 'ap-southeast-1';
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
var dynamodb = null;//Tao bien toan cuc
var docClient = null;
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

//variables for drawing chart
  var recentEventsDateTime = [];
  var recentEventsCounter = [];
  var codData = [];
  var bodData = [];
  var doData = [];
  var phData = [];
  var colorData = [];
  var condData = [];
  var tempData = [];
  var dateHour;
  var cod;
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: recentEventsDateTime,
            datasets: [{
                type: 'line',
                label: "COD",
                data:codData,
                backgroundColor: "rgba(250,0,0,0.8)",
                borderColor: "rgba(250,0,0,0.8)",
                fill: false,
                //borderDash: [5, 5],
            }, {
                type: 'line',
                label: "BOD",
                data: bodData,
                borderColor: "rgba(0,250,0,0.3)",
                fill: false,
                //borderDash: [5, 5],
            }, {
                //type: 'bar',
                label: "DO",
                data: doData,
                borderColor: "rgba(0,0,255,0.3)",
                backgroundColor: "rgba(150,200,0,0.3)",
                //lineTension: 0,
                fill: false,
            },{
                //type: 'bar',
                label: "Conductivity",
                data: condData,
                backgroundColor: "rgba(0,0,254,0.6)",
                fill: false,
            },{
                //type: 'bar',
                label: "Temperature",
                data: tempData,
                backgroundColor: "rgba(250,0,0,0.3)",
                fill: false,
            },{
                //type: 'bar',
                label: "Color",
                data: colorData,
                backgroundColor: "rgba(150,0,180,0.3)",
                fill: false,
            },
            {
                //type: 'bar',
                label: "pH",
                data: phData,
                fill: false,
            }]
        },
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


cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      // /console.log('access token + ' + result.getAccessToken().getJwtToken());
      AWS.config.region = 'ap-northeast-1'; // Region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId : config.IdentityPoolId,
          Logins:{
            'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_laJ43mEoj' : result.getIdToken().getJwtToken()
          }
      });

      //Using DynamoDB DOCUMENT SDK
      docClient = new AWS.DynamoDB.DocumentClient();
      queryDatabase();
      setInterval(queryDatabase,10000);
    },
    onFailure: function(err) {
        alert(err);
    }
});

function queryDatabase(){
  ts = new Date().getTime();
  var params = {
    TableName: config.tableName,
    ScanIndexForward: false,
    ProjectionExpression: "#Values",
    KeyConditionExpression: "#Id = :id AND #Time <= :time",
    ExpressionAttributeNames:{
      "#Id" : "Id",
      "#Time" : "Timestamp",
      "#Values" : "Values"
    },
    ExpressionAttributeValues:{
      ":id" : "ph-smart-001",
      ":time": ts
    },
    Limit: 15,
    ReturnConsumedCapacity: 'TOTAL'
  };
  docClient.query(params,function(err, data){
    if(err) console.log(err, err.stack);
    else listData(data);
  });

}

function listData(data){
  data.Items.forEach(function(item) {
      dateHour = JSON.stringify(item.Values.Time);
      //recentEventsDateTime.push(dateHour.slice(1, -4));
      recentEventsDateTime.push(item.Values.Time);
      codData.push(item.Values.COD);
      bodData.push(item.Values.BOD);
      doData.push(item.Values.DO);
      phData.push(item.Values.pH);
      colorData.push(item.Values.Color);
      condData.push(item.Values.Cond);
      tempData.push(item.Values.Temp);
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
    myChart.clear();
    myChart.update();
    // var ctx = document.getElementById("myChart").getContext("2d");
    // var myChart = new Chart(ctx, {
    //       type: 'bar',
    //       data: {
    //         labels: recentEventsDateTime,
    //         datasets: [{
    //             type: 'line',
    //             label: "COD",
    //             data:codData,
    //             backgroundColor: "rgba(250,0,0,0.8)",
    //             borderColor: "rgba(250,0,0,0.8)",
    //             fill: false,
    //             //borderDash: [5, 5],
    //         }, {
    //             type: 'line',
    //             label: "BOD",
    //             data: bodData,
    //             borderColor: "rgba(0,250,0,0.3)",
    //             fill: false,
    //             //borderDash: [5, 5],
    //         }, {
    //             //type: 'bar',
    //             label: "DO",
    //             data: doData,
    //             borderColor: "rgba(0,0,255,0.3)",
    //             backgroundColor: "rgba(150,200,0,0.3)",
    //             //lineTension: 0,
    //             fill: false,
    //         },{
    //             //type: 'bar',
    //             label: "Conductivity",
    //             data: condData,
    //             backgroundColor: "rgba(0,0,254,0.6)",
    //             fill: false,
    //         },{
    //             //type: 'bar',
    //             label: "Temperature",
    //             data: tempData,
    //             backgroundColor: "rgba(250,0,0,0.3)",
    //             fill: false,
    //         },{
    //             //type: 'bar',
    //             label: "Color",
    //             data: colorData,
    //             backgroundColor: "rgba(150,0,180,0.3)",
    //             fill: false,
    //         },
    //         {
    //             //type: 'bar',
    //             label: "pH",
    //             data: phData,
    //             fill: false,
    //         }]
    //     },
    //     options: {
    //         responsive: true,
    //         scales: {
    //             xAxes: [{
    //                 display: true,
    //                 scaleLabel: {
    //                     display: true,
    //                     labelString: 'Time'
    //                 }
    //             }],
    //             yAxes: [{
    //                 display: true,
    //                 scaleLabel: {
    //                     display: true,
    //                     labelString: 'Value'
    //                 }
    //             }]
    //         },
    //         title: {
    //             display: true,
    //             text: 'Multi parameters Online monitoring System.'
    //         }
    //       }
    //   });

}
