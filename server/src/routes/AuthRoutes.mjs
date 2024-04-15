//routes/AuthRoutes.js

import express from "express";
import passport from "passport";
import User from "../models/user.mjs";
import Account from "../models/account.mjs";
import multer from "multer";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads"),
    filename: (req, file, cb) => cb(null, file.fieldname + "-" + Date.now() + ".jpg"),
});

const upload = multer({ storage: storage });

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            res.statusCode = 401;
            return res.send("No User Exists");
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            res.send(user);
        });
    })(req, res, next);
});



app.post("/register", upload.single("img"), async (req, res) => {
    try {
        let userExists = await User.findOne({ username: req.body.username });
        if (userExists) {
            res.statusCode = 400;
            return res.send("User Already Exists");
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let newAccount = new Account({
            title: req.body.name,
            accountType: req.body.accountType, 
            branch: req.body.branch, 
            balance: 0, 
            transactions: [],
            cards: []
        });
        await newAccount.save();
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            account: newAccount._id,
            img: req.file ? "http://localhost:4000/uploads/" + req.file.filename : "",
            role: "user",
        });

        await newUser.save();
        res.send("User Created");
    } catch (err) {
        res.statusCode = 500;
        res.send(err.message);
    }
});

app.post("/logout", (req, res) => {
    req.logout();
    res.send();
});

app.get("/user", (req, res) => {
    if (req.user) {
        User.findById(req.user._id)
            .populate('account') 
            .then((user) => res.send({ user: user }))
            .catch((err) => {
                res.statusCode = 500;
                res.send(err.message);
            });
    } else {
        res.statusCode = 201;
        res.send({});
    }
});

app.get("/allUsers", (req, res) => {
    User.find({role: 'user'})
    .populate('account') 
    .then((users) => res.send(users))
    .catch((err) => {
        res.statusCode = 500;
        res.send(err.message);
    });
})

app.post("/account/enable/:accountId", (req, res)=> {
    User.findById(req.params.accountId)
    .then(account => {
        account.status = 'active';
        account.save();
        res.send(account);
    })
    .catch(err => {
        res.statusCode = 500;
        res.send(err.message);
    })
})


app.post("/account/disable/:accountId", (req, res)=> {
    User.findById(req.params.accountId)
    .then(account => {
        account.status = 'inactive';
        account.save();
        res.send(account);
    })
    .catch(err => {
        res.statusCode = 500;
        res.send(err.message);
    })
})

export default app;
