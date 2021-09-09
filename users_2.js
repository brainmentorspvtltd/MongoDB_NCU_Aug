db.runCommand({
    collmod : "movies",
    validator : {
        $jsonSchema : {
            bsonType : "object",
            required : ["title", "desc", "genre", "rating", "reviews"],
            properties : {
                title : {
                    bsonType : "string",
                    description : "must be a string and it is required"
                },
                desc : {
                    bsonType : "string",
                    description : "must be a string and it is required"
                },
                genre : {
                    bsonType : "array",
                    description : "must be an array and it is required",
                    items : {
                        bsonType : "string",
                        description : "must be string"
                    }
                },
                rating : {
                    bsonType : "number",
                    minimum : 1,
                    maximum : 10,
                    description : "must be a number and it is required"
                },
                reviews : {
                    bsonType : "array",
                    description : "must be an array and it is required",
                    items : {
                        bsonType : "object",
                        properties : {
                            user : {
                                bsonType : "objectId",
                                description : "Must be an object refers to user"
                            },
                            text : {
                                bsonType : "string",
                                description : "Must be a string and it is required"
                            }
                        }
                    }
                }
            }
        }
    }
})