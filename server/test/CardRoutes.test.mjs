import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.mjs';
import connectDB from '../src/config/db.mjs';
import User from '../src/models/user.mjs';
import bcrypt from 'bcryptjs';
import Account from '../src/models/account.mjs';

let userId;
let accountId;


before(async () => {
  await connectDB("mongodb://127.0.0.1:27017/testDB");
  await User.deleteMany();
  await Account.deleteMany();
});

const username = 'newUser';
const pass = 'newPass';

describe('Card Routes', function () {
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


  describe('POST /cards', () => {
    it('should create a new card successfully', async () => {
      let agent = request.agent(app);
      agent
        .post('/login')
        .send({ username: username, password: pass })
        .end(async function (err, resLogin) {
          const res = await request(app)
            .post('/cards')
            .send({
              cardType: 'debit',
              securityCode: '123',
              pin: '1234'
            })
            .expect(201);
          expect(res.body).to.have.property('cardNumber').that.is.a('string');
          expect(res.body).to.include({
            cardType: 'debit',
            status: 'inactive',
          });
          // it ends here          
        });
    });
  });

  describe('POST /cards', () => {
    it('should require authentication to create a card', async () => {
      await request(app)
        .post('/cards')
        .send({
          cardType: 'credit',
          securityCode: '123',
          pin: '4321'
        })
        .expect(401);
    });
  });

  describe('DELETE /cards/:cardId', () => {
    it('should delete a card successfully', async () => {
      let agent = request.agent(app);
      agent
        .post('/login')
        .send({ username: username, password: pass })
        .end(async function (err, resLogin) {
          const cardId = 'someCardId'; // Use a real card ID
          await agent
            .delete(`/cards/${cardId}`)
            .expect(200);
        });
    });
  });


  describe('DELETE /cards/:cardId', () => {
    it('should not allow deletion of a card by a user who does not own the card', async () => {
      let agent = request.agent(app);
      agent
        .post('/login')
        .send({ username: username, password: pass })
        .end(async function (err, resLogin) {
          const cardId = '1111111111'; 
          await agent
            .delete(`/cards/${cardId}`)
            .expect(403);
        });
    });
  });

  describe('POST /transfer-to-card', () => {
    it('should transfer to card successfully', async () => {
      let agent = request.agent(app);
      agent
        .post('/login')
        .send({ username: username, password: pass })
        .end(async function (err, resLogin) {
          const cardId = '111111111111'; 
          await agent
            .post('/transfer-to-card')
            .send({
              cardId: cardId,
              amount: 100
            })
            .expect(200);
        });
    });
  });


  describe('POST /transfer-to-card', () => {
    it('should not allow transfer to debit card due to insufficient funds', async () => {
      let agent = request.agent(app);
      agent
        .post('/login')
        .send({ username: username, password: pass })
        .end(async function (err, resLogin) {
          const cardId = '11111111'; 
          await agent
            .post('/transfer-to-card')
            .send({
              cardId: cardId,
              amount: 10000000000
            })
            .expect(400);
        });
    });
  });



});

after(async () => {
  await mongoose.connection.close();
});
