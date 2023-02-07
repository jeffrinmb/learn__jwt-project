const Mongoose = require('mongoose');

const { MONGO_DB_USER_NAME, MONGO_DB_USER_PASSWORD, MONGO_DB_NAME } = process.env;
const MONGO_URI = `mongodb+srv://${MONGO_DB_USER_NAME}:${MONGO_DB_USER_PASSWORD}@cluster0.fferj.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`;

exports.connect = () => {
  Mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Successfully Connected to Database');
    })
    .catch(error => {
      console.log('Connection to Database Failed. Exiting Now.');
      console.error(error);
      process.exit(1);
    });
};
