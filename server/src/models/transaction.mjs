import mongoose from "mongoose";

const transaction = new mongoose.Schema({
    accountFrom: Number,
    accountTo: Number, 
    amount: Number,
    sender: String,
    receiver: String,
    date: Date,
    type: {type:String, enum: ["Withdrawal", "Deposit", "Transfer", "To Card"]},
});

export default mongoose.model("Transaction", transaction);
