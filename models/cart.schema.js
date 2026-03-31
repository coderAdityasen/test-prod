const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID']
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1']
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'Price cannot be negative']
        }
      }
    ],
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Total price cannot be negative']
    },
    isEmpty: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model('Cart', cartSchema);
