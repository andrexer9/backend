
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./service_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json());

app.post('/send-notification', async (req, res) => {
  const { title, body, tokens } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
    tokens, // arreglo de FCM tokens
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, error });
  }
});

app.listen(10000, () => {
  console.log('Servidor corriendo en el puerto 10000');
});
