import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const TransactionSchema = new Schema({
  ///shared props
  amount: { type: Number, required: true },
  userId: { type: mongoose.Schema.ObjectId, required: true },
  bookingDate: { type: Date, required: true },
  bankId: { type: mongoose.Schema.ObjectId, required: true },
  transactionId: { type: String, required: true, unique: true },
  type: {type: String, enum: ['fetched', 'categorized'], required: true},
  ///only fetched
  creditorName: { type: Schema.Types.Mixed, required: false },
  ///only categorized
  categoryId: { type: mongoose.Schema.ObjectId, required: false },
});
const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);
export default Transaction;
