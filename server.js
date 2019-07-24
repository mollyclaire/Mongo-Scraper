// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Requiring all models
var db = require("./models");

// Initializing the port
var PORT = 3000;

// Initializing Express
var app = express();

// Middleware
    // Use morgan logger for logging requests
    app.use(logger("dev"));
    // Parse request body as JSON
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    // Make public a static folder
    app.use(express.static("public"));

// Using Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

// Connecting to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

/*==========================
           Routes
===========================*/

// Shows all unsaved articles on homepage
app.get("/", function(req, res){
    db.Article.find({saved: false}).then(function(result){
        // This variable allows us to use handlebars by passing the results 
        // from the database as the value in an object
        var hbsObject = { articles: result };
        res.render('index',hbsObject);
    }).catch(function(err){ res.json(err) });
});

// Scraping the npr website for the article data
app.get("/scraped", function(req, res) {
    axios.get("http://www.artnews.com/category/news/").then(function(response) {

      // Load the Response into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(response.data);

      $("h2.entry-title").each(function(i, element) {
        var result = {};

        // Save the text of the element in a "title" variable
        result.title = $(element).text();
    
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        result.link = $(element).children("a").attr("href");

        result.summary = $(element).siblings(".entry-summary").text().trim();
    
        // Save these results in an object that we'll push into the results array we defined earlier
        db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      });
});
res.send("Scrape Complete");
});
// Starting the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });