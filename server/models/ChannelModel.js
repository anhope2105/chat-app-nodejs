import mongoose from "mongoose";

const channelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.ObjectId, refs: "User", required: true }],
  admin: { type: mongoose.Schema.ObjectId, refs: "User", required: true },
  messages: [
    { type: mongoose.Schema.ObjectId, ref: "Messages", required: true },
  ],
  createAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

channelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Channel = mongoose.model("Channels", channelSchema);
export default Channel;
