const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    image: {
      type: String,
      default: null
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model('Product', productSchema);
