const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Make sure you have this in your .env

router.post('/charge', async (req, res) => {
  const { amount, paymentMethodId } = req.body;

  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Convert dollars to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true, // Confirm the payment immediately
      
    });

    res.status(200).send({ success: true, paymentIntent });
  } catch (error) {
    console.error('Payment failed:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
