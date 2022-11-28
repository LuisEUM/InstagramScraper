const { script } = require("../scripts/user.detail.puppeteer instagramRepo");
const { test } = require("../scripts/test.detail.puppeteer");
const express = require("express");

module.exports.detail = async (req, res, next) => {
  console.log(`starting script for user ${req.params.username}`);
  const data = await test(req.params.username);
  // console.log(`stopping script for user ${req.params.username}`);
  // res.send(data);
}
