const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Inicializar Firebase Admin SDK
const serviceAccount = require('/etc/secrets/service_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Ruta para enviar notificaciones
app.post('/send-notification', async (req, res) => {
  const { tokens, title, body } = req.body;

  const message = {
    notification: { title, body },
    tokens: tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    res.status(200).send(response);
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).send({ error: 'Fallo al enviar notificación' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend de notificaciones listo');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

