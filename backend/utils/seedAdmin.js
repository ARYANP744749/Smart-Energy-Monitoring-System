require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const run = async () => {
  await connectDB();
  const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (exists) {
    console.log('Admin exists');
    process.exit(0);
  }
  const user = new User({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    role: 'admin'
  });
  await user.save();
  console.log('Admin created');
  process.exit(0);
};

run();
