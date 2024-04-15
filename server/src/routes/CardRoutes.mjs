// routes/CardRoutes.js
import express from "express";
import User from "../models/user.mjs";
import Card from "../models/card.mjs";
import Transaction from "../models/transaction.mjs";
import Account from "../models/account.mjs";
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send("User is not authenticated");
  }
  next();
});

app.post("/cards", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('account');
    if (!user) {
      return res.status(404).send("User not found");
    }

    const newCardData = {
      ...req.body,
      cardholderName: user.account.title,
      linkedAccount: user.account._id
    };

    const card = new Card(newCardData);
    await card.save();
    res.status(201).send(card);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/cards/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).populate('linkedAccount');

    if (!card) {
      return res.status(404).send("Card not found");
    }

    if (card.linkedAccount.owner.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not allowed to delete this card");
    }

    if (card.cardType === 'credit' && card.creditLimit < card.linkedAccount.balance) {
      return res.status(400).send("Cannot delete the card with outstanding debt");
    }

    await Card.deleteOne({ _id: cardId });
    res.send("Card deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/transfer-to-card", async (req, res) => {
  try {
    const { cardId, amount } = req.body;
    const card = await Card.findById(cardId).populate('linkedAccount');
    const user = await User.findById(req.user._id).populate('account');

    if (!card || !user) {
      return res.status(404).send("User or Card not found");
    }

    if (card.linkedAccount._id.toString() !== user.account._id.toString()) {
      return res.status(403).send("Not allowed to transfer to this card");
    }

    if (card.cardType === 'debit' && user.account.balance < amount) {
      return res.status(400).send("Insufficient funds");
    }

    if (card.cardType === 'credit') {
      const interest = amount * card.interestRate;
      card.creditLimit = card.creditLimit - amount - interest; 
    } else {
      user.account.balance -= amount; 
    }

    const transaction = new Transaction({
      accountFrom: user.account.accountNumber,
      accountTo: null,
      amount: amount,
      date: new Date(),
      type: "To Card"
    });

    await transaction.save();
    await user.account.save();
    await card.save(); 

    res.send("Transfer successful");
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get("/cards", async (req, res) => {
    const user = await User.findById(req.user._id).populate('account');
    if (!user) {
      return res.status(404).send("User not found");
    }
    const cards = await Card.find({linkedAccount: user.account._id}).populate('linkedAccount');

    res.send(cards)
});

app.post("/cards/approve/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send("Card not found");
    }

    card.status = "active";
    await card.save();

    res.send("Card approved successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post("/cards/disable/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send("Card not found");
    }

    card.status = "inactive";
    await card.save();

    res.send("Card disabled successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/allCards", async (req, res) => {
    const cards = await Card.find();
    res.send(cards);
});

export default app;
