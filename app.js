require('dotenv').config();
require('./config/Database').connect();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model/User');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password && first_name && last_name)) {
      res.status(400).send('All input is required');
    }
    const emailValue = email.toLowerCase();
    const oldUser = await User.findOne({ emailValue });
    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    );
    user.token = token;
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send('All input is required');
    }
    const emailValue = email.toLowerCase();
    const user = await User.findOne({ emailValue });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      );
      user.token = token;
      res.status(200).json(user);
    }
    res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
  }
});

app.post('/welcome', auth, (req, res) => {
  res.status(200).send('Welcome 🙌 ');
});

module.exports = app;
