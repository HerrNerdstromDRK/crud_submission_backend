/**
 * This file essentially configures and runs the server.
 */

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

// Access the database handle and install a couple callbacks
const db = mongoose.connection;
db.on("error", (error) =>
  console.error("server.onerror> error: " + JSON.stringify(error))
);
db.once("open", () => console.log("Connected to database"));

// Configure server to accept JSON
app.use(express.json());

// Enable cross-origin routing
app.use(cors({ origin: "*" }));

// Setup routes
const blogPostsRouter = require("./routes/blogposts");
const blogUsersRouter = require("./routes/blogusers");

// Link the router to the database tables
app.use("/blogposts", blogPostsRouter);
app.use("/blogusers", blogUsersRouter);

// Open the middleware server on the given port
app.listen(4000, () => console.log("Server started"));
