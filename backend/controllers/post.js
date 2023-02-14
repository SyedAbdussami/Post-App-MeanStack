const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post
    .save()
    .then(Createdpost => {
      res.status(201).json({
        messages: "Post added succesfully",
        post: {
          id: Createdpost._id,
          title: Createdpost.title,
          content: Createdpost.content,
          imagePath: Createdpost.imagePath
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Error occured during Post creation"
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  console.log("Fetching Data");
  postQuery
    .find()
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        messages: "post fetched successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Error Fetching Posts"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ messages: "Post Not Found" });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Error Fetching the Post"
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath: url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ messages: "update Successful" });
      } else {
        res.status(401).json({ messages: "Not Authorized" });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "An error occured during Post updation"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ messages: "Post Deleted Successfully" });
      } else {
        res.status(401).json({ messages: "Not Authorized" });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "An error occured during Post deletion "
      });
    });
};
