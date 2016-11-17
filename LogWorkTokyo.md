+ Create a Table named "Beagle01" in Tokyo region.Hash:Id, Range:Timestamp
+ Switch AWSIoT in Tokyo region.
  - Create a certificate.Download 3 key in this window. And Active the certificate.
  - Create Policy with all resources and add the certificate above.
  - Create a file named "root-CA.crt" with Symantec string.
  - Copy 4 files to a folder "/home/debian/certs" in Beagle.
  - node-red folder in Beagle: /root/.node-red
  - Create a rule to insert a item to Beagle01 table from "topic01":
    Name: "BeagleSingaporeToBeagle01"
    Attribute: "\*".
    Topic filter: "topic01"
    Action: "DynamoDB"
    Tablename: "Beagle01"
    HashkeyValue: "${Id}"
    Payload field : "Values"
    Range key value: "Timestamp"
    Role name : "IoTSingaporeToDynamo"
+ In Cognito in Tokyo region, create a userPool
  Name: PhSmartUserPool
  -> Add an app
  -> Remove "Generate client secret"
  -> Note : UserPoolId, userPoolClientId.
+ In Cognito, create an Identity pool and add policy to access dynamodb
    Create name.
    In Authentication providers: using UserPoolId, userPoolClientId in Amazon app created above.
    Note : Authenticated role, go to IAM -> role, attach a policy that allows Cognito to access DynamoDB.
    
