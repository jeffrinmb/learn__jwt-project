import * as dotenv from 'dotenv';
import * as Mongoose from 'mongoose';
import logger from './Logger.js';

dotenv.config();

const { MONGO_DB_USER_NAME, MONGO_DB_USER_PASSWORD, MONGO_DB_NAME } =
  process.env;
const MONGO_URI = `mongodb+srv://${MONGO_DB_USER_NAME}:${MONGO_DB_USER_PASSWORD}@cluster0.fferj.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;

const connect = () => {
  Mongoose.connect(MONGO_URI)
    .then(() => {
      logger.info('Successfully Connected to Database');
    })
    .catch(error => {
      logger.error('Connection to Database Failed. Exiting Now.');
      logger.error(error);
      process.exit(1);
    });
};

export default connect;
