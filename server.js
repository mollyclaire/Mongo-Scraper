
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "artnews";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Handlebars
const exphbs = require("express-handlebars");
app.engine('handlebars', exphbs({ defaultLayout: "main", extname: '.handlebars' }));
app.set('view engine', '.handlebars');

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
  });