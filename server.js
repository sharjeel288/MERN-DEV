const express = require('express');
const path = require('path');
const dbConnect = require('./config/config');
const authApi = require('./routes/auth');
const postApi = require('./routes/posts');
const profileApi = require('./routes/profile');
const userApi = require('./routes/user');

dbConnect();

const app = express();
const PORT = process.env.PORT || 8080;

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

app.listen(PORT);
