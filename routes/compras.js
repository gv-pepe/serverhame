const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Purchase = require('../models/Compra'); 

// Ruta para guardar la compra
router.post('/compras', async (req, res) => {
    const { userId, userEmail, cartItems, totalAmount } = req.body;

    try {
        const newPurchase = new Purchase({
            userId,
            userEmail,
            cartItems,
            totalAmount,
            createdAt: new Date(),
        });

        await newPurchase.save();
        res.status(201).json({ message: 'Compra guardada correctamente' });
    } catch (error) {
        console.error('Error saving purchase:', error);
        res.status(500).json({ message: 'Error al guardar la compra' });
    }
});

// Ruta para obtener todas las compras
router.get('/compras', async (req, res) => {
    try {
        const purchases = await Purchase.find(); // Recupera todas las compras
        res.status(200).json(purchases); // Devuelve las compras encontradas
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ message: 'Error al obtener las compras' });
    }
});

module.exports = router;
