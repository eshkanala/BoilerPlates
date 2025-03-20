import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY is not set in environment variables.");
    throw new Error("Stripe secret key is missing.");
}
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16', // or your preferred API version
});

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { priceId } = req.body; // Assuming frontend sends the Stripe Price ID
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId, // Stripe Price ID of the subscription plan
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout_success=true`, // Redirect on success
            cancel_url: `${process.env.NEXTAUTH_URL}/pricing?checkout_canceled=true`, // Redirect on cancel
            customer_email: req.body.customerEmail, // Or get from authenticated user
        });

        res.json({ sessionId: session.id }); // Send session ID back to frontend to redirect to Stripe
    } catch (error: any) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: error.message });
    }
};