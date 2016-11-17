+ Create a Table named "Beagle01" in Singapore region.Hash:Id, Range:Timestamp
+ Switch AWSIoT in Singapore region.
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
    
