const express = require('express');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

const app = express();
app.use(express.json());

const auth = new GoogleAuth({
  keyFile: 'service_account.json', // tu archivo descargado desde Firebase
  scopes: ['https://www.googleapis.com/auth/firebase.messaging']
});

app.post('/sendNotification', async (req, res) => {
  const { token, title, body } = req.body;

  try {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const response = await axios.post(
      `https://fcm.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/messages:send`,
      {
        message: {
          token,
          notification: {
            title,
            body
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({ success: true, response: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

