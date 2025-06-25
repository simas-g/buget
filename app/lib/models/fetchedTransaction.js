import mongoose, { Schema, model, models } from "mongoose";

const FetchedTransactionSchema = new Schema({
  amount: { type: Number, required: true },
  userId: { type: mongoose.Schema.ObjectId, required: true },
  bookingDate: { type: Date, required: true },
  creditorName: { type: String, required: true },
  transactionId: { type: String, required: true },
  bankId: { type: mongoose.Schema.ObjectId, required: true },
});
const FetchedTransaction =
  models.FetchedTransaction ||
  model("FetchedTransaction", FetchedTransactionSchema);
export default FetchedTransaction;
