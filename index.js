const mongoose = require('mongoose');
const app = require("./app");

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  IP_SERVER,
  API_VERSION
} = require('./constante');

const PORT = process.env.POST || 3977;

// Construir la URL de conexión
const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}`;

// Función asíncrona para conectar
/*async function conectarDB() {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    process.exit(1); // Detiene el servidor si no se puede conectar
  }
}
conectarDB();*/

mongoose.connect(DB_URI)
.then(() => {

  console.log("✅ Conexión exitosa a MongoDB");
  app.listen(PORT, () => {
    console.log("######################");
    console.log("####### API REST - con Express #######");
    console.log("######################");
    console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}/`);
  });
})
.catch(err => console.error("❌ Error al conectar con MongoDB: ", err))