import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./cart.scss";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/apiService";

interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    product: {
        id: number;
        title: string;
        price: number;
        image: string;
        category: string;
        description: string;
    };
}

const Cart: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [deliveryAddress, setDeliveryAddress] = useState(""); // New state for address
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        const fetchCart = async () => {
            try {
                const response = await api.get(`/cart/${user.id}`);
                setCartItems(response.data);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };
        fetchCart();
    }, [user]);

    // Increase quantity (Frontend only)
    const increment = (id: number) => {
        setCartItems((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Decrease quantity (Frontend only)
    const decrement = (id: number) => {
        setCartItems((prevCart) =>
            prevCart.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    // Remove item from cart (API call)
    const removeFromCart = async (productId: number) => {
        if (!user) return;
        try {
            await api.delete("/cart/remove", {
                data: { userId: user.id, productId },
            });
            setCartItems((prevCart) => prevCart.filter((item) => item.productId !== productId));
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = subtotal * 0.1; // Example: 10% discount
    const deliveryFee = subtotal > 100 ? 0 : 15; // Free delivery if subtotal > $100
    const total = subtotal - discount + deliveryFee;

    // Proceed to Checkout
    const handleCheckout = () => {
        if (!deliveryAddress.trim()) {
            alert("Please enter a delivery address.");
            return;
        }

        // Prepare order data
        const orderData = {
            userId: user?.id,
            orderItems: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                name: item.product.title,  // ✅ Pass product name
                image: item.product.image,
                price: item.product.price, // Include price for order details
            })),
            totalAmount: total,
            deliveryAddress,
        };

        // Navigate to Checkout Page with order details
        navigate("/orders/checkout", { state: orderData });
    };

    return (
        <div className="cart">
            <h1>YOUR CART</h1>
            <div className="cart-container">
                <div className="left">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-img">
                                    <img src={item.product.image} alt={item.product.title} />
                                </div>
                                <div className="detail">
                                    <div className="item">
                                        <span className="name">{item.product.title}</span>
                                        <span>${item.product.price.toFixed(2)}</span>
                                    </div>
                                    <div className="controle">
                                        <RiDeleteBin6Fill onClick={() => removeFromCart(item.productId)} />
                                        <div className="count">
                                            <button onClick={() => decrement(item.id)}>-</button>
                                            {item.quantity}
                                            <button onClick={() => increment(item.id)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="right">
                    <h3>Order Summary</h3>
                    <div className="order">
                        <div className="order-detail">
                            <span>Subtotal</span>
                            <span className="amount">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="order-detail">
                            <span>Discount</span>
                            <span className="amount">-${discount.toFixed(2)}</span>
                        </div>
                        <div className="order-detail">
                            <span>Delivery Fee</span>
                            <span className="amount">${deliveryFee.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="order-detail">
                            <span>Total</span>
                            <span className="amount">${total.toFixed(2)}</span>
                        </div>
                        {/* New Input for Delivery Address */}
                        <label>Delivery Address:</label>
                        <input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Enter delivery address"
                        />
                        <button onClick={handleCheckout}>Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
