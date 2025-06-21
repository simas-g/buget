import { models,model,Schema } from "mongoose"

const BankAccountSchema = new Schema({
    name: {type: String, required: true},
    logo: {type: String, required: true},
    accountId: {type: String, required: true},
    userId: {type: mongoose.Schema.ObjectId, required: true},
    balance: {type: Number, required: true, default: 0}    
})
const BankConnection = models.BankConnection || model("BankConnection", BankAccountSchema)
export default BankConnection