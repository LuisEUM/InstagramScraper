const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const EMAIL_PATTERN = require('../utils/patterns.js');
const WORK_FACTOR = 10;
const PW_PATTERN = /^.{8,}$/;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: "Name is required",
      maxLength: 10,
      trim: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: "Email is required",
      trim: true,
      lowercase: true,
      unique: true,
      match: [EMAIL_PATTERN, "Invalid email"],
    },
    password: {
      type: String,
      required: "Password is required",
      match: [PW_PATTERN, "Password needs at least 8 chars"],
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
  } 
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt
      .hash(this.password, WORK_FACTOR)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (passwordToMatch) {
  return bcrypt.compare(passwordToMatch, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
