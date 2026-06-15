const mongoose = require('mongoose');
const Counter = require('./Counter');

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
      index: true
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    parentCategory: {
      type: String,
      required: [true, 'Parent category is required'],
      enum: {
        values: ['Electrical', 'Hardware'],
        message: '{VALUE} is not a valid parent category'
      },
      index: true
    },
    size: {
      type: String,
      trim: true
    },
    brand: {
      type: String,
      trim: true,
      index: true
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
      default: 0
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
      default: 0
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    reorderLevel: {
      type: Number,
      required: [true, 'Reorder level is required'],
      min: [0, 'Reorder level cannot be negative'],
      default: 0
    },
    supplierName: {
      type: String,
      trim: true,
      index: true
    },
    supplierContact: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v || v === '') return true; // Allow empty
          // Email or typical phone format validation
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$|^\+?[0-9\s\-()]{7,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid email or phone number!`
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save hook to generate unique sequential ID
productSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'productId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.productId = `PROD-${String(counter.seq).padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Virtual property for threatLevel
productSchema.virtual('threatLevel').get(function() {
  if (this.quantity <= this.reorderLevel) {
    return 'Critical';
  } else if (this.quantity <= this.reorderLevel * 2) {
    return 'Low Stock';
  } else {
    return 'Safe';
  }
});

module.exports = mongoose.model('Product', productSchema);
