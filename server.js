const express = require('express');
const path = require('path');

const authApi = require('./routes/auth');
const DbConnect = require('./config/config');
const postApi = require('./routes/posts');
const profileApi = require('./routes/profile');
const userApi = require('./routes/user');

const app = express();

DbConnect();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(__dirname, 'client', 'build', 'index.html');
  });
}

app.use(express.json());

app.use('/api/profile', profileApi);
app.use('/api/auth', authApi);
app.use('/api/user', userApi);
app.use('/api/post', postApi);

const PORT = process.env.PORT || 8080;
app.listen(PORT);
