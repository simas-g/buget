import mongoose, { Schema, model, models } from "mongoose";
const TransactionSchema = new Schema({
  userId: {type: mongoose.Schema.ObjectId, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  bookingDate: {type: Date, required: true},
});
const Transaction = models.Transaction || model("Transaction", TransactionSchema)
export default Transaction