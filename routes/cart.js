// routes/cart.js
const express = require('express');
const CartItem = require('../models/CartItem');
const Compra = require('../models/Compra'); // Asegúrate de tener el modelo Compra creado
const router = express.Router();

// Agregar un artículo al carrito
router.post('/cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cartItem = await CartItem.findOne({ userId, productId });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
            return res.status(200).json(cartItem);
        } else {
            cartItem = new CartItem({ userId, productId, quantity });
            await cartItem.save();
            return res.status(201).json(cartItem);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al agregar al carrito', error });
    }
});

// Obtener artículos del carrito para un usuario
router.get('/cart', async (req, res) => {
    const { userId } = req.query;

    try {
        const cartItems = await CartItem.find({ userId });
        return res.status(200).json(cartItems);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener artículos del carrito', error });
    }
});

// Eliminar todos los artículos del carrito para un usuario
router.delete('/cart', async (req, res) => {
    const { userId } = req.body;

    try {
        const deletedItems = await CartItem.deleteMany({ userId });
        return res.status(200).json({ message: 'Carrito eliminado correctamente', deletedCount: deletedItems.deletedCount });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar artículos del carrito', error });
    }
});

// Mover artículos del carrito a Compras y eliminar el carrito después del pago
router.post('/checkout', async (req, res) => {
    const { userId, paymentDetails } = req.body;

    try {
        // Verificar si el pago fue exitoso (esto depende de tu implementación de CreditCardForm)
        const paymentSuccessful = paymentDetails.status === 'success';
        if (!paymentSuccessful) {
            return res.status(400).json({ message: 'Pago no exitoso' });
        }

        // Obtener todos los artículos del carrito del usuario
        const cartItems = await CartItem.find({ userId });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        // Crear un solo documento en Compras con todos los artículos del carrito
        const newCompra = new Compra({
            userId,
            items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            date: new Date(),
            paymentDetails,
        });
        await newCompra.save();

        // Eliminar todos los artículos del carrito del usuario
        await CartItem.deleteMany({ userId });

        return res.status(200).json({ message: 'Compra realizada y carrito eliminado', compra: newCompra });
    } catch (error) {
        return res.status(500).json({ message: 'Error al procesar la compra', error });
    }
});

module.exports = router;
