import * as Mongoose from 'mongoose';

const userSchema = new Mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

export default Mongoose.model('user', userSchema);
