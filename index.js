const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const serviceAccount = require('./service_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(bodyParser.json());

app.post('/send-notification', async (req, res) => {
  const { tokens, titulo, cuerpo } = req.body;

  if (!tokens || !titulo || !cuerpo) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  const payload = {
    notification: {
      title: titulo,
      body: cuerpo,
    }
  };

  try {
    const response = await admin.messaging().sendToDevice(tokens, payload);
    console.log('Notificación enviada:', response);
    res.status(200).json({ message: 'Notificaciones enviadas', response });
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).json({ error: 'Falló el envío de notificaciones', details: error });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
