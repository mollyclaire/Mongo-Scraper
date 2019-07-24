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
    db.Article.find({"saved": false}).then(function(result){
        // This variable allows us to use handlebars by passing the results 
        // from the database as the value in an object
        var hbsObject = { articles: result };
        res.render("index",hbsObject);
    }).catch(function(err){ res.json(err) });
});

// Scrapes the artnews website for the article data
app.get("/scraped", function(req, res) {
    axios.get("http://www.artnews.com/category/news/").then(function(response) {
      var $ = cheerio.load(response.data);

      $("h2.entry-title").each(function(i, element) {
        var result = {};

        result.title = $(element).text();
    
        result.link = $(element).children("a").attr("href");

        result.summary = $(element).siblings(".entry-summary").text().trim();
    
        db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
      });
});
res.send("Scrape Complete");
});

// Displays specified saved articles
app.get("/saved", function(req, res){
    db.Article.find({"saved": true}).then(function(result){
        var hbsObject = { articles: result };
        res.render("saved",hbsObject);
    }).catch(function(err){ res.json(err) });
});

// Posts saved articles 
app.post("/saved/:id", function(req, res){
    db.Article.findOneAndUpdate({"_id": req.params.id}, {"$set": {"saved": true}})
    .then(function(result) {
        res.json(result);
    }).catch(function(err){ res.json(err) });
})

// Starting the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });