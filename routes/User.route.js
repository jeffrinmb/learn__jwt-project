import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import auth from '../middleware/Auth.js';
import logger from '../config/Logger.js';

const router = new Router();

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send('All input is required');
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (user && isValidPassword) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      );
      user.token = token;
      res.status(200).json(user);
    } else {
      res.status(400).send('Invalid Credentials');
    }
  } catch (err) {
    logger.error(err);
  }
});

router.post('/welcome', auth, (req, res) => {
  res.status(200).send('Welcome 🙌 ');
});

export default router;
