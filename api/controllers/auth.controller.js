const createError = require("http-errors");
const { User } = require("../models");
const EMAIL_PATTERN = require("../utils/patterns.js");

module.exports.profile = (req, res, next) => {
  res.json(req.user);
};

module.exports.register = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(
          createError(400, {
            message: "User validation failed",
            errors: { email: { message: "User already registered" } },
          })
        );
      } else {
        return User.create(req.body).then((user) => res.status(201).json(user));
      }
    })
    .catch(next);
};

//clean update body
function clean(obj) {
  for (var propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ""
    ) {
      delete obj[propName];
    }
  }
  return obj;
}

module.exports.update = (req, res, next) => {
  const user = Object.assign(req.user, clean(req.body));

  user
    .save()
    .then((user) => res.status(200).json(user))
    .catch((e) => next(createError(400, { message: "User creation failed" })));
};

module.exports.authenticate = (req, res, next) => {
  function invalidAuthError() {
    next(
      createError(400, {
        message: "User validation failed",
        errors: { identifier: { message: "Invalid email or password" } },
      })
    );
  }

  const { identifier, password } = req.body;

  //this func gets the type and the value of the id
  const idType = (identifier) => {
    if (identifier === undefined) invalidAuthError();

    if (EMAIL_PATTERN.test(identifier)) {
      const email = identifier;
      return { email };
    } else {
      const username = identifier;
      return { username };
    }
  };

  User.findOne(idType(identifier))
    .then((user) => {
      if (!user) {
        invalidAuthError();
      } else {
        return user.checkPassword(password).then((match) => {
          if (match) {
            req.session.userId = user.id;
            res.status(200).json(user);
          } else {
            invalidAuthError();
          }
        });
      }
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  req.session = null;
  res.status(204).send();
};
