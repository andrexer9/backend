const express = require('express');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

const app = express();
app.use(express.json());

const auth = new GoogleAuth({
  keyFile: 'service_account.json',
  scopes: ['https://www.googleapis.com/auth/firebase.messaging']
});

app.post('/sendNotification', async (req, res) => {
  const { tokens, title, body } = req.body;

  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return res.status(400).json({ success: false, error: 'Se requiere una lista de tokens válida.' });
  }

  try {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const results = [];

    for (const token of tokens) {
      try {
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
        results.push({ token, status: 'ok', response: response.data });
      } catch (err) {
        results.push({
          token,
          status: 'error',
          error: err.response?.data || err.message
        });
      }
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
