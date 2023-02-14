const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

const userControllers=require("../controllers/user");

router.post("/signup", userControllers.createUser);

router.post("/login", userControllers.loginUser);

module.exports = router;
