/**
 * Handle all routes that begin with /blogposts
 */
const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPostModel");

// Get all
router.get("/", async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.json(blogPosts);
  } catch (err) {
    // 500 is server error code
    res.status(500).json({ message: err.message });
  }
});

// Get one
router.get("/:id", getBlogPost, (req, res) => {
  res.send(res.blogPost);
});

// Create one
router.post("/", async (req, res) => {
  const blogPost = new BlogPost({
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    datemodified: req.body.datemodified,
  });
  try {
    const newBlogPost = await blogPost.save();
    // 201: Successfully created object
    res.status(201).send(newBlogPost);
  } catch (err) {
    // 400 bad data
    res.status(400).json({ message: err.message });
  }
});

// Update only updated data
router.patch("/:id", getBlogPost, async (req, res) => {
  if (req.body.author != null) {
    res.blogPost.author = req.body.author;
  }
  if (req.body.title != null) {
    res.blogPost.title = req.body.title;
  }
  if (req.body.content != null) {
    res.blogPost.content = req.body.content;
  }
  if (req.body.modifieddate != null) {
    res.blogPost.modifieddate = req.body.modifieddate;
  }
  try {
    const updatedBlogPost = await res.blogPost.save();
    res.json(updatedBlogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one
router.delete("/:id", getBlogPost, async (req, res) => {
  try {
    await res.blogPost.remove();
    res.json({ message: "Deleted blog post" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function getBlogPost(req, res, next) {
  let blogPost;
  try {
    blogPost = await BlogPost.findById(req.params.id);
    if (blogPost == null) {
      return res.status(404).json({ message: "Cannot find blog post" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.blogPost = blogPost;
  next();
}

module.exports = router;
