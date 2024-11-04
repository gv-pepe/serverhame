// routes/contactRoutes.js
const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// Ruta para recibir y guardar los datos del formulario
router.post('/contact', async (req, res) => {
    try {
        const { nombre, apellidos, correo, mensaje } = req.body;
        
        // Crear un nuevo documento de contacto
        const newContact = new Contact({
            nombre,
            apellidos,
            correo,
            mensaje
        });
        
        // Guardar en la base de datos
        const savedContact = await newContact.save();
        
        res.status(201).json({
            message: 'Contacto guardado exitosamente',
            contact: savedContact
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al guardar el contacto',
            error: error.message
        });
    }
});

module.exports = router;
