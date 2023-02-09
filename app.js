import * as dotenv from 'dotenv';
import express from 'express';
import connect from './config/Database.js';
import v1Routes from './routes/index.js';

dotenv.config();
connect();

const app = express();

app.use(express.json());

app.use('/v1', v1Routes);

export default app;
