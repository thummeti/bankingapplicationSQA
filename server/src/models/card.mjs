import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    unique: true,
  },
  cardType: {
    type: String,
    enum: ['debit', 'credit'],
    required: true
  },
  cardholderName: {
    type: String,
  },
  expirationDate: {
    type: Date,
  },
  securityCode: {
    type: String,
    required: true
  },
  issuingBank: {
    type: Boolean,
    default: true
  },
  linkedAccount: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  contactless: {
    type: Boolean,
    default: false
  },
  creditLimit: {
    type: Number,
  },
  interestRate: {
    type: Number, 
    default: 0
  },
  billingDate: {
    type: Date,
  },
  status: {
    type: String,
    default: "inactive"
  }
});

cardSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.cardNumber = await generateCardNumber();
    this.expirationDate = generateExpirationDate();
    this.billingDate = generateBillingDate();
    
    if (this.cardType === 'credit' && this.linkedAccount.balance) {
      this.creditLimit = calculateCreditLimit(this.linkedAccount.balance);
    }

    if (this.linkedAccount.title) {
      this.cardholderName = this.linkedAccount.title;
    }
  }
  next();
});

function generateExpirationDate() {
  const expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 4);
  return expiration;
}

function generateBillingDate() {
  const billingDate = new Date();
  billingDate.setDate(10); 
  return billingDate;
}

async function generateCardNumber() {
  let cardNumber;
  let count = 0;
  do {
    cardNumber = '4' + Math.floor(Math.random() * 1e15).toString().padStart(15, '0');
    count = await mongoose.model("Card").countDocuments({ cardNumber }).exec();
  } while (count > 0);

  return cardNumber;
}

function calculateCreditLimit(balance) {
  return Math.round(balance * 0.80 / 100) * 100;
}

export default mongoose.model("Card", cardSchema);
