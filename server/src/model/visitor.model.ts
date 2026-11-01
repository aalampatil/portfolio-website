import mongoose from "mongoose";

const visitorCountSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const visitorCountModel = mongoose.model("VisitorCount", visitorCountSchema)