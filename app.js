import * as dotenv from 'dotenv';
import express from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import connect from './config/Database.js';
import User from './model/User.js';
import auth from './middleware/Auth.js';
import logger from './config/Logger.js';

dotenv.config();
connect();

const app = express();

app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(email && password && firstName && lastName)) {
      res.status(400).send('All input is required');
    }
    const emailValue = email.toLowerCase();
    const oldUser = await User.findOne({ emailValue });
    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
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
    logger.error(err);
  }
  return 0;
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
    logger.error(err);
  }
});

app.post('/welcome', auth, (req, res) => {
  res.status(200).send('Welcome 🙌 ');
});

export default app;
