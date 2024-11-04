const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./Auth/auth');
const contactRoutes = require('./routes/contactRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes'); // Importa las rutas de favoritos
const cart = require('./routes/cart')
const purchaseRoutes = require('./routes/compras')
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('No se pudo conectar a MongoDB:', err));

// Usar rutas de autenticación
app.use('/api/auth', authRoutes);

// Usar rutas de contacto
app.use('/api', contactRoutes);

app.use('/api', cart);

app.use('/api', purchaseRoutes);

// Usar rutas de favoritos
app.use('/api', favoriteRoutes); // Agrega esta línea

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
