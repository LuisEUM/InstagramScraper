const express = require("express");
const router = express.Router();
const {users} = require('../controllers');
const secure = require("../middlewares/secure.mid.js");


router.post("/", secure.isAuthenticated, users.create); 
// router.get("/", secure.isAuthenticated, restaurants.list);
router.get("/:id", secure.isAuthenticated, users.detail); 
// router.patch("/:id", secure.isAuthenticated, secure.isTargetOwnedByUser, users.update);
// router.delete("/:id", secure.isAuthenticated, secure.isTargetOwnedByUser, users.delete);

module.exports = router;
