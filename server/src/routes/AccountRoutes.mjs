import express  from "express";
import User from "../models/user.mjs";
import Account from "../models/account.mjs";
import Transaction from "../models/transaction.mjs";

const app = express();
app.use(express.json());

app.post("/transfer", async (req, res) => {
    try {
        const senderUsername = req.body.sender;
        const receiverEmail = req.body.email;
        const amount = parseInt(req.body.amount);

        if (amount <= 0) {
            return res.status(400).send("Amount must be greater than 0");
        }

        const senderUser = await User.findOne({ username: senderUsername }).populate('account');
        if (!senderUser) {
            return res.status(404).send("Sender not found");
        }
        if (senderUser.account.balance < amount) {
            return res.status(400).send("Insufficient funds");
        }

        const receiverUser = await User.findOne({ email: receiverEmail }).populate('account');
        if (!receiverUser) {
            return res.status(404).send("Receiver not found");
        }

        const transaction = new Transaction({
            accountFrom: senderUser.account.accountNumber,
            accountTo: receiverUser.account.accountNumber,
            amount: amount,
            sender: senderUser.username,
            receiver: receiverUser.username,
            date: new Date(),
            type:"Transfer",
        });

        await transaction.save();

        senderUser.account.balance -= amount;
        receiverUser.account.balance += amount;
        await senderUser.account.save();
        await receiverUser.account.save();

        res.send("Transfer successful");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post("/withdraw", async (req, res) => {
    try {
        const username = req.body.username;
        const amount = parseInt(req.body.amount);

        if (amount <= 0) {
            return res.status(400).send("Amount must be greater than 0");
        }

        const user = await User.findOne({ username: username }).populate('account');
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.account.balance < amount) {
            return res.status(400).send("Insufficient funds");
        }

        const transaction = new Transaction({
            accountFrom: user.account.accountNumber,
            accountTo: null, 
            amount: amount,
            sender: user.username,
            receiver: null,
            date: new Date(),
            type: 'Withdrawal' 
        });

        await transaction.save();

        user.account.balance -= amount;
        await user.account.save();

        res.send("Withdrawal successful");
    } catch (error) {
        res.status(500).send(error.message);
    }
});



app.post("/deposit", async (req, res) => {
    try {
        const username = req.body.username;
        const amount = parseInt(req.body.amount);

        if (amount <= 0) {
            return res.status(400).send("Amount must be greater than 0");
        }

        const user = await User.findOne({ username: username }).populate('account');
        if (!user) {
            return res.status(404).send("User not found");
        }

        const transaction = new Transaction({
            accountFrom: null,
            accountTo: user.account.accountNumber,
            amount: amount,
            sender: null,
            receiver: user.username,
            date: new Date(),
            type: 'Deposit' 
        });

        await transaction.save();

        user.account.balance += amount;
        await user.account.save();

        res.send("Deposit successful");
    } catch (error) {
        res.status(500).send(error.message);
    }
});



app.get("/transactions", async (req, res) => {
  try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate('account');
      if (!user || !user.account) {
          return res.status(404).send('User or account not found');
      }
      const accountNumber = user.account.accountNumber;
      const transactions = await Transaction.find({
          $or: [
              { accountFrom: accountNumber },
              { accountTo: accountNumber }
          ]
      });
      res.send(transactions);
  } catch (error) {
      res.status(500).send(error.message);
  }
});


export default app;
