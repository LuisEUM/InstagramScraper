const express = require("express");
const router = express.Router();
const {target} = require('../controllers');
const secure = require("../middlewares/secure.mid.js");

router.get("/:id", secure.isAuthenticated, target.detail); 
router.get("/", secure.isAuthenticated, target.list);
router.post("/", secure.isAuthenticated,secure.isTargetOwnedByUser, target.create);
router.get("/:id/followers", secure.isAuthenticated, secure.isTargetOwnedByUser, target.followers); 
router.patch("/:id", secure.isAuthenticated, secure.isTargetOwnedByUser, target.update);
router.delete("/:id", secure.isAuthenticated, secure.isTargetOwnedByUser, target.delete);

module.exports = router; 