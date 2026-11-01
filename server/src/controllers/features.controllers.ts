import { visitorCountModel } from "../model/visitor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateVisitorCount = asyncHandler(async (req, res) => {
  await visitorCountModel.findOneAndUpdate(
    {},
    { $inc: { count: 1 } },
    { upsert: true, new: true },
  );

  return res.status(200).json({ message: "visitor count updated" });
});

export const getVisitorCount = asyncHandler(async (req, res) => {
  const count = await visitorCountModel.findOne();
  
  if (!count) {
    return await visitorCountModel.create({ count: 0 });
  }
  const visits = count.count

  return res.status(200).json({visits, success: true})
});
