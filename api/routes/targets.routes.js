const express = require("express");
const router = express.Router();
const {target} = require('../controllers');
const secure = require("../middlewares/secure.mid.js");

router.post("/", secure.isAuthenticated, target.create); 
router.get("/", secure.isAuthenticated, target.list);
router.get("/:id", secure.isAuthenticated, target.detail); 
router.patch("/:id", secure.isAuthenticated, secure.isTargetOwnedByUser, target.update);
router.delete("/:id", secure.isAuthenticated, secure.isTargetOwnedByUser, target.delete);
router.get("/:id/followers", secure.isAuthenticated, secure.isTargetOwnedByUser, target.followers); 
router.get("/:id/followers/filter/", secure.isAuthenticated, secure.isTargetOwnedByUser, target.filter); 

module.exports = router; 