console.log("Hello from entry.js");
var Chart = require('../node_modules/chart.js/dist/Chart.bundle.js');
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
var AWS = require('aws-sdk');
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
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
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

      // Instantiate aws sdk service objects now that the credentials have been updated.
      var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10',region:'ap-northeast-1'});
      //Scan all data in table
      // var params = {
      //   TableName: 'BBB03Raw',
      //   ReturnConsumedCapacity: 'TOTAL'
      //   //Limit: 15
      // };
      // //scan all the table
      // dynamodb.scan(params, function(err, data) {
      //   if (err) console.log(err, err.stack); // an error occurred
      //   else{
      //     //console.log("Data: " + JSON.stringify(data));
      //     //listData(data);
      //   }
      // });

      // var params = {
      //     TableName: 'BBB01Raw',
      //     ConsistentRead: true,
      //     ProjectionExpression: "#Values",
      //     //FilterExpression:'',
      //     KeyConditionExpression: "#Id = :id AND #Time = :time",
      //     ExpressionAttributeNames:{
      //       "#Id" : "Id",
      //       "#Time" : "Time",
      //       "#Values" : "Values"
      //     },
      //     ExpressionAttributeValues: {
      //         ":id" : {"S": "ph-smart-001"},
      //         ":time": {"S":"1478855920186"}
      //     }
      // };
      //
      // dynamodb.query(params, function(err, data) {
      //   if (err) console.log(err, err.stack); // an error occurred
      //   else     console.log(JSON.stringify(data));           // successful response
      // });
      //Using DynamoDB DOCUMENT SDK
      var docClient = new AWS.DynamoDB.DocumentClient();
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
        Limit: 15
      };
      docClient.query(params, function(err, data){
        if(err) console.log(err, err.stack);
        else{
          //console.log(JSON.stringify(data));
          listData(data);
        }
      });

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
  var colorData = [];
  var condData = [];
  var tempData = [];
  var dateHour;
  var cod;
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
    console.log(phData);
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
