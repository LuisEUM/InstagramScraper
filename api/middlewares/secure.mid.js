const createError = require('http-errors');
const { Target } = require('../models');

module.exports.isAuthenticated = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    next(createError(401))
  }
}

const checkUser = (value, name, req, next) =>{
  if (value?.owner == req.user?.id) {
    Object.assign(req, { [name]: value });
    next();
  } else if (value) {
    next(createError(403, "access denied"));
  } else {
    next(createError(404, `${value} not found`));
  }
}

module.exports.isTargetOwnedByUser = (req, res, next) => {
  const { id } = req.params;
  Target.findById(id)
    .then((target) => {
      checkUser(target, 'target', req, next)
    })
    .catch(next);
};
