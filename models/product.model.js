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
    category: String,
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    image: String,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        comment: String,
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    seller: String,
    sku: { type: String, unique: true },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    tags: [String],
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function () {
  return this.price - (this.price * this.discount) / 100;
});

// Virtual for average rating
productSchema.virtual('averageRating').get(function () {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / this.reviews.length;
});

// Virtual to check stock availability
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// Instance method to update stock
productSchema.methods.updateStock = function (quantity) {
  this.stock -= quantity;
  if (this.stock <= 0) {
    this.isAvailable = false;
  }
  return this;
};

// Instance method to restock
productSchema.methods.restock = function (quantity) {
  this.stock += quantity;
  this.isAvailable = true;
  return this;
};

// Instance method to add review
productSchema.methods.addReview = function (userId, comment, rating) {
  this.reviews.push({ userId, comment, rating });
  return this;
};

// Instance method to apply discount
productSchema.methods.applyDiscount = function (discountPercent) {
  this.discount = Math.min(discountPercent, 100);
  return this;
};

// Static method to find by category
productSchema.statics.findByCategory = function (category) {
  return this.find({ category });
};

// Static method to search products
productSchema.statics.searchProducts = function (query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  });
};

// Static method to find available products
productSchema.statics.findAvailable = function () {
  return this.find({ isAvailable: true, stock: { $gt: 0 } });
};

module.exports = mongoose.model('Product', productSchema);
