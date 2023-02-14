const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const fileExtract = require("../middleware/file");

const postController = require("../controllers/post");

router.post("", checkAuth, fileExtract, postController.createPost);

router.get("", postController.getPosts);

router.get("/:id", postController.getPost);

router.put("/:id", checkAuth, fileExtract, postController.updatePost);

router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
