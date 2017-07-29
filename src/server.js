var express = require('express');
var mongodb = require("mongodb");
var bodyParser = require("body-parser");

var ajv = require('ajv');
let articleSchema = require('./new-article.json');




var ObjectID = mongodb.ObjectID;


var ARTICLES_COLLECTION = "articles";


var app = express();
app.use(bodyParser.json());

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




var ajv = ajv({allErrors:true, removeAdditional:false});
ajv.addSchema(articleSchema, 'new-article');


/**
 * Source: https://medium.com/@cachecontrol/validating-api-parameters-in-node-js-e8afb7920327
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors) {
  let errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  })
  return {
    status: 'failed',
    errors: errors
  }
}

/**
 * Source: https://medium.com/@cachecontrol/validating-api-parameters-in-node-js-e8afb7920327
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
let validateSchema = (schemaName) => {
  return (req, res, next) => {
    let valid = ajv.validate(schemaName, req.body)
    if (!valid) {
      return res.send(errorResponse(ajv.errors))
    }
    next()
  }
}







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


app.post("/api/articles", validateSchema('new-article'), function(req, res){

	var newArticle = req.body;

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














