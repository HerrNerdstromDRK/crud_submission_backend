/**
 * This file essentially configures and runs the server.
 */
const verifyJWT = require("./middleware/verifyJWT");

// dotenv is used to provide a method to access environments
// useful for both dev and production
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 4000;

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
app.use(cors(corsOptions));

// Middleware for cookie management
app.use(cookieParser());

// Built-in middleware to handle urlencoded form data
// Commented at for now until a need arises.
//app.use(express.urlencoded({ extended: false }));

// Setup routes
const blogPostsRouter = require("./routes/blogposts");
const blogUsersRouter = require("./routes/blogusers");

// Link the router to the database tables
app.use("/blogposts", blogPostsRouter);
app.use("/blogusers", blogUsersRouter);

// Be sure to place verifyJWT after the initial routes
//app.use(verifyJWT);

// TODO: use dotenv
// Open the middleware server on the given port
app.listen(PORT, () => console.log("Server started on port " + PORT));
// TODO: Test with Chrome to verify security restrictions still work
