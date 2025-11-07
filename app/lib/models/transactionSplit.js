import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const TransactionSplitSchema = new Schema({
  transactionId: { type: String, required: true },
  userId: { type: String, required: true },
  splits: [{
    categoryName: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TransactionSplit = models.TransactionSplit || model("TransactionSplit", TransactionSplitSchema);
export default TransactionSplit;

