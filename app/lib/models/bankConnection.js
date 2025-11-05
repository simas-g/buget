import { models, model, Schema } from "mongoose";
import mongoose from "mongoose";
const BankAccountSchema = new Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  balance: { type: Number, required: true },
  accountId: { type: String, required: true },
  userId: { type: mongoose.Schema.ObjectId, required: true },
  validUntil: { type: String, required: true },
  lastFetched: { type: String, required: true },
  connected: { type: String, required: false }, // Date when connection was established/revalidated
});
const BankConnection =
  models.BankConnection || model("BankConnection", BankAccountSchema);
export default BankConnection;
