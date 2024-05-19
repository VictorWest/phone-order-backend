import mongoose from "mongoose";

const Schema = mongoose.Schema
const orderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const Order = mongoose.model('Order', orderSchema)