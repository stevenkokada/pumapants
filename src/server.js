var express = require('express');
var mongodb = require("mongodb");
var json = require("JSON");
var ObjectID = mongodb.ObjectID


var ARTICLES_COLLECTION = "articles";


var app = express();


var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, database){
	if (err){
		console.log(err);
		process.exit(1);
	}

	db = database;
	//console.log("Mongo URI: ", process.env.MONGODB_URI);
	console.log("Database connection successful");

	var server = app.listen(process.env.PORT || 8080, function(){
		console.log("App now running on port: ", server.address().port);

	});
});


function handleError(res, reason, message, code){
	console.log("ERROR: " + reason);
	res.status(code || 500).json({"error": message});
}


app.get("/api/articles", function(req, res){

	db.collection(ARTICLES_COLLECTION).find().toArray(function(err, docs){

		if (err){
			handleError(res, err.message, "Failed to get articles.");
		}

		else{
			res.status(200).json(docs);
		}

	});

});


// {"_id":, "url":, "title":, "keywords":, "coordinates":}
app.post("/api/articles", function(req, res){
	console.log(req.body);
	var newArticle = json.parse(req.body);

	if (!newArticle.url){
		handleError(res, "Invalid user input", "Must provide all fields", 400);
	}

	else{

		db.collection(ARTICLES_COLLECTION).insertOne(newArticle, function(err, doc){

			if (err){
				handleError(res, err.message, "Failed to upload new article.", 500);
			}

			else{
				res.status(201).json(doc.ops[0]);

			}

		});
	}

});














