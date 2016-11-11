{
    Id: 206,
    Title: "20-Bicycle 206",
    Description: "206 description",
    BicycleType: "Hybrid",
    Brand: "Brand-Company C",
    Price: 500,
    Color: ["Red", "Black"],
    ProductCategory: "Bike",
    InStock: true,
    QuantityOnHand: null,
    RelatedItems: [
        341,
        472,
        649
    ],
    Pictures: {
        FrontView: "http://example.com/products/206_front.jpg",
        RearView: "http://example.com/products/206_rear.jpg",
        SideView: "http://example.com/products/206_left_side.jpg"
    },
    ProductReviews: {
        FiveStar: [
                "Excellent! Can't recommend it highly enough!  Buy it!",
                "Do yourself a favor and buy this."
        ],
        OneStar: [
                "Terrible product!  Do not buy this."
        ]
    }
}

var params = {
    TableName : "Music",
    KeySchema: [
        { AttributeName: "Artist", KeyType: "HASH" },  //Partition key
        { AttributeName: "SongTitle", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "Artist", AttributeType: "S" },
        { AttributeName: "SongTitle", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err)
        console.log(JSON.stringify(err, null, 2));
    else
        console.log(JSON.stringify(data, null, 2));
});

var params = {
    TableName: "Music",
    Item: {
        "Artist":"No One You Know",
        "SongTitle":"Call Me Today",
        "AlbumTitle":"Somewhat Famous",
        "Year": 2015,
        "Price": 2.14,
        "Genre": "Country",
        "Tags": {
            "Composers": [
                  "Smith",
                  "Jones",
                  "Davis"
            ],
            "LengthInSeconds": 214
        }
    }
};
