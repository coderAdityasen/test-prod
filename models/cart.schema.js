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
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for checking if cart is empty
cartSchema.virtual('isEmpty').get(function () {
  return this.items.length === 0;
});

// Virtual for item count
cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Instance method to add item to cart
cartSchema.methods.addItem = function (productId, quantity, price) {
  const existingItem = this.items.find(item =>
    item.productId.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ productId, quantity, price });
  }

  this.updateTotal();
  return this;
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    item => item.productId.toString() !== productId.toString()
  );
  this.updateTotal();
  return this;
};

// Instance method to clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.totalPrice = 0;
  return this;
};

// Instance method to update total price
cartSchema.methods.updateTotal = function () {
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};

// Static method to find cart by userId
cartSchema.statics.findByUserId = function (userId) {
  return this.findOne({ userId });
};

// Static method to create/get cart for user
cartSchema.statics.getOrCreateCart = async function (userId) {
  let cart = await this.findByUserId(userId);
  if (!cart) {
    cart = await this.create({ userId, items: [] });
  }
  return cart;
};

module.exports = mongoose.model('Cart', cartSchema);
