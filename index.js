const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 10000;

// Clave del servidor FCM Legacy (¡no compartas esta clave en público!)
const FCM_SERVER_KEY = 'CJ7ME0zIQfbL06V1dzCmpZ85s74x4G5Ab1zJCR7GvS4';

// Middleware
app.use(bodyParser.json());

// Ruta para verificar estado
app.get('/', (req, res) => {
  res.send('Servidor de notificaciones activo 🚀');
});

// Ruta para enviar notificación
app.post('/send-notification', async (req, res) => {
  const { tokens, titulo, cuerpo } = req.body;

  if (!tokens || tokens.length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron tokens' });
  }

  try {
    for (const token of tokens) {
      const response = await fetch('https://fcm.googleapis.com/v1/projects/253977310621/messages:send', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${accessToken}`, // Obtenido desde tu JWT
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        message: {
            token: token,
            notification: {
                title: titulo,
                body: cuerpo
            }
        }
    })
});

      const resultado = await respuesta.json();
      console.log(`Resultado para token ${token}:`, resultado);
    }

    res.status(200).json({ message: 'Notificaciones enviadas' });
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).json({ error: 'Fallo al enviar notificación' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

