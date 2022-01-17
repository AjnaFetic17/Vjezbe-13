const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//koristi public folder za spremanje static fajlova
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/novostiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", (req, res) => {
    Article.find((err, foundArticles) => {
        if (err) {
            res.send(err);
        } else {
            res.send(foundArticles);
        }
    })
});

app.post("/articles", (req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully added a new article.");
        }
    });
});

app.delete("/articles", (req, res) => {
    Article.deleteMany((err) => {
        if (err) {
            res.send("Successfully deleted all articles.")
        } else {
            res.send(err)
        }
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});