

require('dotenv').config()
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripePaymentIntent = async (req) => {
    try {
        const { id, amount, uuid } = req.body;

        const payment = await stripe.paymentIntents.create({
            payment_method: id,
            confirm: true,
            amount,
            currency: 'gbp',
        }, { idempotencyKey: uuid });

        return { payment, error: false };
    } catch (error) {
        return { payment: false, error };
    }
}

module.exports = stripePaymentIntent; 