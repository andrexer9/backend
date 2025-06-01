
const express = require("express");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const cors = require("cors");
const serviceAccount = require("./service_account.json");

const app = express();
app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get("/", (req, res) => {
  res.send("Servidor activo");
});

app.post("/send-notification", async (req, res) => {
  const { tokens, titulo, cuerpo } = req.body;

  const message = {
    notification: {
      title: titulo,
      body: cuerpo,
    },
    tokens: tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("Notificación enviada:", response);
    res.status(200).json({ message: "Notificaciones enviadas" });
  } catch (error) {
    console.error("Error al enviar notificación:", error);
    res.status(500).json({ error: "Fallo al enviar notificación" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

