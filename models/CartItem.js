// models/CartItem.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
