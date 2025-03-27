import mongoose, { mongo } from "mongoose";

const commentSchemna = new mongoose.Schema({
  text: [
    {
      type: String,
      required: true,
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});
export default Comment = mongoose.model('Comment', commentSchemna);
