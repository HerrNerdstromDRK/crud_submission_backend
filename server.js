// dotenv is used to provide a method to access environments
// useful for both dev and production
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// strictQuery has to do with a deprecation issue as mongoose upgrades versions
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

// Configure server to accept JSON
app.use(express.json());
app.use(cors({ origin: "*" }));

// Setup routes
const blogPostsRouter = require("./routes/blogposts");

// Link the router to the database table
app.use("/blogposts", blogPostsRouter);

// Open the middleware server on the given port
app.listen(4000, () => console.log("Server has started"));
