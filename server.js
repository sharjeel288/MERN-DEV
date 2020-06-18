const express = require('express');

const dbConnect = require('./config/config');
const authApi = require('./routes/auth');
const postApi = require('./routes/posts');
const profileApi = require('./routes/profile');
const userApi = require('./routes/user');

dbConnect();

const app = express();
const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Method', 'GET,POST,PUT,DELETE,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-auth-token');
  next();
});

app.use(express.json());

app.use('/api/profile', profileApi);
app.use('/api/auth', authApi);
app.use('/api/user', userApi);
app.use('/api/post', postApi);

app.listen(PORT);
