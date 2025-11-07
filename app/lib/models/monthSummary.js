import mongoose, { model, models, Schema } from "mongoose";
const MonthSummarySchema = new Schema(
  {
    month: { type: String, required: true },
    categories: {
      type: Map,
      of: Number,
      default: {},
    },
    categoriesInitialized: { type: Boolean, default: false },
    inflow: { type: Number, required: true, default: 0 },
    outflow: { type: Number, required: true, default: 0 },
    closingBalance: { type: Number, required: true, default: 0 },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);
const MonthSummary =
  models.MonthSummary || model("MonthSummary", MonthSummarySchema);
export default MonthSummary;
