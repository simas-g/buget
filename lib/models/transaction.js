import { Schema, model, models } from "mongoose";
const FetchedTransactionSchema = new Schema({
  transactionId: { type: String, required: true },
  userId: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  creditorName: { type: String, required: true },
});
const Transaction =
  models.Transaction || model("FetchedTransaction", TransactionSchema);
export default Transaction;

// "transactionId": "6653842207",
// "entryReference": "17494503812398841266",
// "bookingDate": "2025-06-09",
// "valueDate": "2025-06-09",
// "transactionAmount": {
//     "amount": "-10.0",
//     "currency": "EUR"
// },
// "creditorName": "PAYPAL *COINBASE",
// "remittanceInformationUnstructured": "08/06/2025 00:00  kortelė...813702 PAYPAL *COINBASE/35314369001/IRL #863790",
// "remittanceInformationUnstructuredArray": [
//     "instructedIdentification=CLR10728444",
//     "transactionReferenceNumber=RO1890915759L01"
// ],
// "bankTransactionCode": "PMNT-CCRD-OTHR",
// "internalTransactionId": "d728012ebf0869ce84ef6982d3872083"
