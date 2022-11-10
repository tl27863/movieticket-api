const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(cors());

const authRoute = require('./routes/auth');
const dataRoute = require('./routes/data');

dotenv.config();

mongoose.connect(process.env.db_url, () => console.log('DB Connected'));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', authRoute);
app.use('/api/data', dataRoute);

app.listen(3000, () => console.log('API Up'));
