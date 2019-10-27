require('dotenv').config({ path: '.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Chatkit = require('@pusher/chatkit-server');
const admin = require('firebase-admin');

const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyBJmX9yLGMgYEdRKLAGfILlWlANaBGg3Lc",
  authDomain: "intervert-24030.firebaseapp.com",
  databaseURL: "https://intervert-24030.firebaseio.com",
  projectId: "intervert-24030",
  storageBucket: "intervert-24030.appspot.com",
  messagingSenderId: "961427042717",
  appId: "1:961427042717:web:5b5d7d91db4a9918a4bf74",
  measurementId: "G-YPHLJW2G5F",
  credential: admin.credential.cert('_tokens/firebaseServiceAccount.json')
};

admin.initializeApp(firebaseConfig);
const db = admin.firestore();

const chatkit = new Chatkit.default({
  instanceLocator: process.env.CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_SECRET_KEY,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users', (req, res) => {
  const { userId } = req.body;

  chatkit
    .createUser({
      id: userId,
      name: userId,
    })
    .then(() => {
      res.sendStatus(201);
    })
    .catch(err => {
      if (err.error === 'services/chatkit/user_already_exists') {
        console.log(`User already exists: ${userId}`);
        res.sendStatus(200);
      } else {
        res.status(err.status).json(err);
      }
    });
});

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id,
  });
  res.status(authData.status).send(authData.body);
});

app.set('port', process.env.PORT || 5200);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
