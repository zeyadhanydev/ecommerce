import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret: _clientSecret }: { clientSecret: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, totalPrice, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            toast.error("Payment system is not ready. Please wait a moment and try again.");
            return;
        }

        if (!user) {
            toast.error("You must be logged in to complete payment.");
            return;
        }

        setIsLoading(true);

        try {
            // Submit the payment to Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation`,
                },
                redirect: 'if_required',
            });

            if (stripeError) {
                toast.error(stripeError.message || 'Payment failed. Please try again.');
                setIsLoading(false);
                return;
            }

            // Verify payment was successful
            if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Payment successful, now create order in Supabase
                const totalAmount = totalPrice + 3.95;
                
                // 1. Create the order
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        user_id: user.id,
                        total_amount: totalAmount,
                        status: 'paid',
                    })
                    .select()
                    .single();

                if (orderError) {
                    console.error("Order creation error:", orderError);
                    throw new Error("Failed to create order record");
                }

                // 2. Create order items
                const orderItems = cartItems.map(item => ({
                    order_id: orderData.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                }));

                const { error: itemsError } = await supabase
                    .from('order_items')
                    .insert(orderItems);
                
                if (itemsError) {
                    console.error("Order items error:", itemsError);
                    throw new Error("Failed to save order items");
                }

                // 3. Clear cart and navigate
                toast.success("Payment successful! Your order has been placed.");
                clearCart();
                navigate('/order-confirmation', { 
                    state: { 
                        orderId: orderData.id,
                        paymentIntentId: paymentIntent.id 
                    } 
                });
            } else {
                toast.error("Payment processing failed. Please try again.");
                setIsLoading(false);
            }

        } catch (dbError: any) {
            console.error("Database error after payment:", dbError);
            toast.error("Payment was successful, but we encountered an error saving your order. Please contact support with your payment confirmation.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <Button type="submit" className="w-full" disabled={isLoading || !stripe || !elements}>
                {isLoading ? 'Processing...' : `Pay €${(totalPrice + 3.95).toFixed(2)}`}
            </Button>
        </form>
    );
};

const CheckoutPaymentPage = () => {
    const { totalPrice, cartCount, cartItems } = useCart();
    const { user } = useAuth();
    const [clientSecret, setClientSecret] = useState('');
    const [loadingSecret, setLoadingSecret] = useState(true);

    useEffect(() => {
        if (cartCount === 0) {
            setLoadingSecret(false);
            return;
        }

        const createPaymentIntent = async () => {
            setLoadingSecret(true);
            try {
                const { data, error } = await supabase.functions.invoke('create-payment-intent', {
                    body: { 
                        amount: totalPrice + 3.95,
                        userId: user?.id,
                        cartItems: cartItems.map(item => ({
                            id: item.id,
                            title: item.title,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    },
                });

                if (error) {
                    console.error("Payment intent error:", error);
                    throw error;
                }
                
                if (data?.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    throw new Error("No client secret received");
                }
            } catch (err: any) {
                console.error("Failed to create payment intent:", err);
                toast.error(err.message || "Could not initialize payment. Please try again.");
            } finally {
                setLoadingSecret(false);
            }
        };
        createPaymentIntent();
    }, [totalPrice, cartCount, user?.id]);

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#282828',
                colorBackground: '#FEFEFE',
                colorText: '#282828',
                colorDanger: '#BC575F',
                fontFamily: 'Montserrat, sans-serif',
                borderRadius: '0.375rem',
            },
        } as const,
    };

    return (
        <div className="bg-brand-gray-light min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-12">
                    <Link to="/cart" >1. My Bag</Link>
                    <div className="flex-grow h-px bg-brand-black"></div>
                    <Link to="/checkout/delivery" >2. Delivery</Link>
                    <div className="flex-grow h-px bg-brand-black"></div>
                    <span className="font-semibold">3. Review & Payment</span>
                </div>

                {cartCount === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="font-heading text-2xl mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some items to your cart before proceeding to payment.</p>
                        <Link to="/">
                            <Button>Continue Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 bg-white p-8 space-y-6 rounded-lg shadow-sm">
                            <h2 className="font-heading text-2xl">Payment Method</h2>
                            
                            {!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && (
                                <div className="text-center text-brand-red p-4 bg-red-50 rounded-md">
                                    Stripe is not configured. Please add your publishable key to the .env file.
                                </div>
                            )}

                            {(loadingSecret || !clientSecret) && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-black"></div>
                                    <p className="mt-4 text-gray-600">Loading payment form...</p>
                                </div>
                            )}

                            {clientSecret && (
                                <Elements stripe={stripePromise} options={options}>
                                    <CheckoutForm clientSecret={clientSecret} />
                                </Elements>
                            )}
                        </div>
                        
                        <div className="bg-white p-8 h-fit rounded-lg shadow-sm">
                            <h2 className="font-heading text-2xl mb-6">Order summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>€{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span>€3.95</span>
                                </div>
                                <hr className="border-brand-gray-dark my-4"/>
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span>€{(totalPrice + 3.95).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPaymentPage;
