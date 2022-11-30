const { followersListData } = require("../scripts/followers.list.puppeteer");
const { Target } = require("../models");

module.exports.detail = async (req, res, next) => {
  console.log(`starting script for user ${req.params.username}`);
  console.log('')
  const data = await test(req.params.username);
  console.log(`stopping script for user ${req.params.username}`);
  res.send(data);
}


module.exports.create = async (req, res, next) => {
  const target = req.body;
  delete target.owner;
  delete target.followers;
  delete target.totalFollowers;

  target.owner = req.user.id;

  console.info(`starting script for user ${target.username}`);
  const data = await followersListData(target.username);
  console.info(`stopping script for user ${target.username}`);

  target.followers = data.followers
  target.totalFollowers = data.totalFollowers

  Target.create(target)
  .then((target) => {
    res.status(201).json(target)
  })
  .catch(target);   
  
}
