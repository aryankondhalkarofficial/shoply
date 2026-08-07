import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },

        name: {
          type: String,
          required: [true, "Product name is required"],
        },

        image: {
          type: String,
          required: [true, "Image is required"],
        },

        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity cannot be less than 1"],
        },

        amount: {
          type: Number,
          required: [true, "Amount is required"],
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },

    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
