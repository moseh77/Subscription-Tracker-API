import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    plan: {
        type: String,
        required: true,
        enum: ['basic', 'premium', 'enterprise']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'JPY'],
        required: true
    },
    frequency: {
        type: String,
        required: true,
        enum: ['monthly', 'quarterly', 'annually', 'one-time']
    },
    category: {
        type: String,
        required: true,
        enum: ['streaming', 'software', 'utilities', 'education', 'entertainment', 'other']
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Other'],
        default: 'Credit Card'
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;

//

