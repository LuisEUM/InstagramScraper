const { Tables, List, Followers, Continue } = require("../scripts");
const { Target } = require("../models");

module.exports.detail = async (req, res, next) => {
  Target.findById(req.params.id)
    .then((target) => res.status(200).json(target))
    .catch((error) => next(error));
};

module.exports.create = async (req, res, next) => {
  const target = req.body;
  delete target.owner;
  delete target.followers;
  delete target.totalFollowers;

  target.owner = req.user.id;

  console.info(
    `starting script for user ${target.username}, creating followers list`
  );
  const data = await List.followers(target.username);
  console.info(
    `stopping script for user ${target.username}, followers list created`
  );

  target.followers = data.followers;
  target.totalFollowers = data.totalFollowers;

  Target.create(target)
    .then((target) => res.status(201).json(target))
    .catch(target);
};

module.exports.list = async (req, res, next) => {
  const owner = req.user.id;

  if (owner === undefined) {
    return res.status(400).json(undefined);
  } else if (req.query) {
    Target.find({ $and: [{ owner }, req.query] })
      .then((target) => res.status(200).json(target))
      .catch(next);
  } else {
    Target.find({ owner })
      .then((target) => res.status(200).json(target))
      .catch(next);
  }
};

module.exports.update = async (req, res, next) => {
  const data = req.body;
  delete data.owner;
  delete data.followers;
  delete data.totalFollowers;
  delete data.username;

  const target = req.target;

  console.info(
    `starting script for user ${target.username}, updating followers list`
  );
  const updatedData = await List.followers(target.username);
  console.info(
    `stopping script for user ${target.username}, updated followers list`
  );

  target.followers = updatedData.followers;
  target.totalFollowers = updatedData.totalFollowers;

  target
    .save()
    .then((target) => res.status(200).json(target))
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  Target.deleteOne({ _id: req.target.id })
    .then(() => res.status(204).send())
    .catch(next);
};

module.exports.tables = async (req, res, next) => {
  const target = req.target;
  const firstCriterial = req.params.firstCriterial;
  const secondCriterial = req.params.secondCriterial;

  console.info(
    `starting script for user ${target.username}, creating followers list with createrials`
  );
  const data = await Tables.followers(
    target.followers,
    firstCriterial,
    secondCriterial
  );
  console.info(
    `stopping script for user ${target.username}, followers list  with createrials created`
  );

  target.followersWithFollowers = data;

  target
    .save()
    .then((target) => res.status(200).json(target.followersWithFollowers))
    .catch(next);
};

// module.exports.followers = async (req, res, next) => {

//   const target = req.target

//   console.info(`starting script for user ${target.username}, creating followers list`);
//   const data = await Followers.followers(target.followers);
//   console.info(`stopping script for user ${target.username}, followers list created`);

//   target.followersWithFollowers = data

//   target
//       .save()
//       .then(target => res.status(200).json(target.followersWithFollowers))
//       .catch(next);

// }

module.exports.followers = async (req, res, next) => {
  const target = req.target;

  console.info(
    `starting script for user ${target.username}, adding followers to the list`
  );
  const data = await Continue.followers(
    target.followers,
    target.followersWithFollowers
  );
  console.info(
    `stopping script for user ${target.username}, task of adding followers to the list finished`
  );

  target.followersWithFollowers === 0
    ? (target.followersWithFollowers = data)
    : target.followersWithFollowers.push(...data);

  target
    .save()
    .then((target) => res.status(200).json(target.followersWithFollowers))
    .catch(next);
};

module.exports.filter = async (req, res, next) => {
  const target = req.target.followersWithFollowers;

  if (req.query.gte || req.query.lte) {
    const gte = req.query.gte;
    const lte = req.query.lte;

    if (gte && lte) {
      const filtered = target.filter(
        (followers) =>
          followers.totalFollowers >= gte &&
          followers.totalFollowers <= lte === true
      );

      if (lte > gte)
        return res
          .status(400)
          .json(
            "Error 400: The query is not correct, lte value should be a bigger number than gte value"
          );

      return res.status(200).json(filtered);
    } else if (gte) {
      const filtered = target.filter(
        (followers) => followers.totalFollowers >= gte === true
      );
      return res.status(200).json(filtered);
    } else if (lte) {
      const filtered = target.filter(
        (followers) => followers.totalFollowers <= lte === true
      );
      return res.status(200).json(filtered);
    }
  } else {
    res
      .status(400)
      .json(
        "Error 400: The query is not correct, you only can filter with lte and gte criterial with this route."
      );
  }
};
