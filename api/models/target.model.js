const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const targetSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
  },
    username: {
      type: String,
      required: "Username is required",
      maxLength: 30,
      trim: true,
      lowercase: true,
      unique: true,
    },
    followers: [{
      type: String,
      required: "Followers is required"
    }],
    totalFollowers: {
    type: Number,
    required: "Total Followers is required"
    },
    followersWithFollowers:{
      type: Array,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  } 
);



const Target = mongoose.model("Target", targetSchema);
module.exports = Target;
