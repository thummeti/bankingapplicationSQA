import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: Number,
        unique: true
    },
    title: String,
    accountType: String,
    branch: String,
    img: String,
    description: String,
    balance: Number,
    transactions: Array,
});

accountSchema.pre('save', function (next) {
    const doc = this;
    console.log(doc.isNew)
    if (doc.isNew) { 
        const generateAccountNumber = () => {
            return Math.floor(100000 + Math.random() * 900000);
        };

        const assignAccountNumber = () => {
            const randomAccountNumber = generateAccountNumber();
            mongoose.model("Account").count({ accountNumber: randomAccountNumber }, function (err, count) {
                if (count > 0) {
                    assignAccountNumber();
                } else {
                    doc.accountNumber = randomAccountNumber;
                    console.log("Account: ",doc)
                    next();
                }
            });
        };

        assignAccountNumber();
    } else {
        next();
    }
});

export default mongoose.model("Account", accountSchema);
