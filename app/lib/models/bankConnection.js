import { models, model, Schema } from "mongoose";
import mongoose from "mongoose";
const BankAccountSchema = new Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  accountId: { type: String, required: true },
  userId: { type: mongoose.Schema.ObjectId, required: true },
  validUntil: { type: Date, required: true },
  lastFetched: { type: Date, required: true },
});
const BankConnection =
  models.BankConnection || model("BankConnection", BankAccountSchema);
export default BankConnection;
