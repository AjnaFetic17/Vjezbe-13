const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

app.use(cors())
app.use(bodyParser.json());

//koristi public folder za spremanje static fajlova
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/proizvodiDB");

const productSchema = {
    title: String,
    content: String,
    imageURL: String,
    price: Number
}

const Product = mongoose.model("Product", productSchema);

//PRVO OVO

// app.get("/products", (req, res) => {
//     Product.find((err, foundProducts) => {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send(foundProducts);
//         }
//     })
// });

// app.post("/products", (req, res) => {
//     const newProduct = new Product({
//         title: req.body.title,
//         content: req.body.content,
//         imageURL: req.body.imageURL,
//         price: parseFloat(req.body.price)
//     });
//     newProduct.save((err) => {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send("Successfully added a new article.");
//         }
//     });
// });

// app.delete("/products", (req, res) => {
//     Product.deleteMany((err) => {
//         if (err) {
//             res.send("Successfully deleted all products.")
//         } else {
//             res.send(err)
//         }
//     });
// });

//PA OVO
app.route("/products")
    .get((req, res) => {
        Product.find((err, foundProducts) => {
            if (err) {
                res.send(err);
            } else {
                res.send(foundProducts);
            }
        });
    })
    .post((req, res) => {
        const newProduct = new Product({
            title: req.body.title,
            content: req.body.content,
            imageURL: req.body.imageURL,
            price: parseFloat(req.body.price)
        });
        newProduct.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("New product successfully added.")
            }
        });
    })
    .delete((req, res) => {
        Product.deleteMany((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("All products successfully deleted.")
            }
        })
    });

//SINGLE ARTICLE
app.route("/products/:articleTitle")
    .get((req, res) => {
        Product.findOne({ title: req.params.articleTitle }, (err, foundProduct) => {
            if (foundProduct) {
                res.send(foundProduct);
            } else {
                res.send("No products found");
            }
        });
    })
    .put((req, res) => {
        Product.findOneAndUpdate(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content, imageURL: req.body.imageURL, price: parseFloat(req.body.price) },
            { overwrite: true },
            (err) => {
                if (!err) {
                    res.send("Successfully updated article.")
                } else {
                    res.send("No article was updated");
                }
            }
        );
    })
    .patch((req, res) => {
        Product.findOneAndUpdate(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Successful patch")
                }
            }
        )
    })
    .delete((req, res) => {
        Product.deleteOne(
            { title: req.params.articleTitle },
            (err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Successful delete");
                }
            }
        )
    });

const userSchema = {
    username: String,
    password: String
}

const User = new mongoose.model("User", userSchema)

app.route("/users")
    .get((req, res) => {
        User.find((err, foundUsers) => {
            if (err) {
                res.send(err);
            } else {
                res.send(foundUsers);
            }
        })
    })
    .post((req, res) => {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password
        });

        User.find({ username: req.body.username }, (err, foundUsers) => {
            if (err) {
                res.send(err);
            } else {
                if (foundUsers.length === 0) {
                    newUser.save((err) => {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send("User added successfully")
                        }
                    })
                } else {
                    res.send("User with this username already exists");
                }
            }
        })
    })
    .delete((req, res) => {
        User.deleteMany((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("All users have been deleted successfully.");
            }
        })
    });

app.route("/users/:username")
    .get((req, res) => {
        User.find({ username: req.params.username }, (err, foundUser) => {
            if (err) {
                res.send(err);
            } else {
                res.send(foundUser);
            }
        })
    })
    .put((req, res) => {
        User.findOneAndUpdate(
            { username: req.params.username },
            { username: req.body.username, password: req.body.password },
            { overwrite: true },
            (err) => {
                if (!err) {
                    res.send("Successfully updated user.")
                } else {
                    res.send("No user was updated");
                }
            }
        )
    })
    .patch((req, res) => {
        User.findOneAndUpdate(
            { username: req.params.username },
            { $set: req.body },
            (err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Successful patch")
                }
            }
        )
    });

app.listen(8080, () => {
    console.log("Server started on port 8080");
});