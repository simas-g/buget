import mongoose, { Schema } from "mongoose"

const BankAccountSchema = new Schema({
    name: {type: String, required: true},
    logo: {type: String, required: true},
    requisitionId: {type: String, required: true},
    userId: {type: mongoose.Schema.ObjectId, required: true},
    balance: {type: Number, required: true}    
})