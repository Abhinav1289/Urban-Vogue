import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/apiService";
import "./checkout.scss";

interface OrderItem {
    productId: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

const Checkout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const [loading, setLoading] = useState(false);

    const orderData = location.state;
    if (!orderData || !user) {
        return <h2>No order data available. Please go back to the cart.</h2>;
    }

    const { orderItems, totalAmount, deliveryAddress } = orderData;

    const handlePlaceOrder = async () => {
        if (!deliveryAddress.trim()) {
            alert("Please enter a delivery address.");
            return;
        }
        setLoading(true);
        try {
            const response = await api.post("/orders", { 
                userId: user.id, 
                orderItems, 
                totalAmount, 
                deliveryAddress 
            });

            console.log("Order Response:", response);

            if (response.status >= 200 && response.status < 300) { 
                alert("Order placed successfully!");
                navigate("/orders");
            } else {
                alert("Unexpected response. Please check the logs.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Try again.");
        }
        setLoading(false);
    };
    

    return (
        <div className="checkout">
            <h1>Checkout</h1>
            <div className="checkout-container">
                <h3>Order Summary</h3>
                {orderItems.map((item: OrderItem, index: number) => (
                    <div className="order-item" key={index}>
                        <img src={item.image} alt={item.name} className="order-img" />
                        <div>
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
                <hr />
                <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</p>
                <p><strong>Delivery Address:</strong> {deliveryAddress}</p>
                <button onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? "Placing Order..." : "Confirm & Place Order"}
                </button>
            </div>
        </div>
    );
};

export default Checkout;

