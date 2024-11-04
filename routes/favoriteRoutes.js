// routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// Agregar un producto a favoritos
router.post('/favorites', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        // Verificar si el producto ya está en favoritos
        let favorite = await Favorite.findOne({ userId, productId });
        
        if (!favorite) {
            // Si no existe, crea un nuevo favorito
            favorite = new Favorite({ userId, productId });
            await favorite.save();
            return res.status(201).json({ message: 'Producto agregado a favoritos' });
        }

        res.status(400).json({ message: 'El producto ya está en favoritos' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar a favoritos', error });
    }
});

// Obtener los productos favoritos de un usuario
router.get('/favorites/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const favorites = await Favorite.find({ userId }).populate('productId');
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener favoritos', error });
    }
});

// Eliminar un producto de favoritos
router.delete('/favorites', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const favorite = await Favorite.findOneAndDelete({ userId, productId });
        if (favorite) {
            return res.status(200).json({ message: 'Producto eliminado de favoritos' });
        }
        res.status(404).json({ message: 'Producto no encontrado en favoritos' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar de favoritos', error });
    }
});

module.exports = router;
