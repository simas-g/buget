import mongoose, { model, models, Schema } from "mongoose";
const MonthSummarySchema = new Schema(
  {
    month: { type: String, required: true }, // e.g., '2025-02'
    categories: [
      {
        name: { type: String, required: true },
        color: { type: String, required: true },
        amount: { type: Number, default: 0 },
      },
    ],
    inflow: { type: Number, required: true },
    outflow: { type: Number, required: true },
    closingBalance: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);
const MonthSummary = models.MonthSummary || model("MonthSummary", MonthSummarySchema)
export default MonthSummary