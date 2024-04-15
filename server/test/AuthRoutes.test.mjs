import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.mjs';
import connectDB from '../src/config/db.mjs';
import User from '../src/models/user.mjs';
import Account from '../src/models/account.mjs'
import bcrypt from 'bcryptjs';

let userId;
let accountId;


before(async () => {
    await connectDB("mongodb://127.0.0.1:27017/testDB");
    User.deleteMany();
    Account.deleteMany();
});
const username = 'newUser';
const pass = 'newPass';

describe('Authentication Routes', function () {
    describe('POST /register', function () {
        it('should register a new user', function (done) {
            request(app)
                .post('/register')
                .send({
                    username: username,
                    password: pass,
                    email: 'newuser@example.com',
                    name: 'New User',
                    accountType: 'Checking',
                    branch: 'Main'
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.text).to.include('User Created');
                    done(err);
                });
        });
    });


    describe('POST /login', function () {
        it('should login the user', function (done) {
            request(app)
                .post('/login')
                .send({ username: username, password: pass })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body).to.have.property('username', username);
                    userId = res.body._id;
                    accountId = res.body.account;
                    done(err);
                });
        });
    });

    describe('GET /user', function () {
        it('should return the user details', function (done) {
            let agent = request.agent(app);
            agent
                .post('/login')
                .send({ username: username, password: pass })
                .end(function (err, res) {
                    agent
                        .get('/user')
                        .expect(200)
                        .end(function (err, res) {
                            expect(res.body).to.have.property('user');
                            done(err);
                        });
                });
        });
    });

    describe('POST /logout', function () {
        it('should logout the user', function (done) {
            request(app)
                .post('/logout')
                .expect(200, done);
        });
    });


    describe('GET /allUsers', function () {
        it('should return all users', function (done) {
            request(app)
                .get('/allUsers')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body).to.be.an('array');
                    done(err);
                });
        });
    });

    describe('POST /account/enable/:accountId', function () {
        it('should enable an account', function (done) {
            request(app)
                .post(`/account/enable/${userId}`)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body).to.have.property('status', 'active');
                    done(err);
                });
        });
    });

    describe('POST /account/disable/:accountId', function () {
        it('should disable an account', function (done) {
            request(app)
                .post(`/account/disable/${userId.toString()}`)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body).to.have.property('status', 'inactive');
                    done(err);
                });
        });
    });


});

after(async () => {
    await User.deleteMany();
    await Account.deleteMany();
    await mongoose.connection.close()
});
