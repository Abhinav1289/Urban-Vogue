import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/apiService";
import { useNavigate } from "react-router-dom";
// import "./userOrders.scss";

interface OrderItem {
    productId: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    orderItems: OrderItem[];
    totalAmount: number;
    deliveryAddress: string;
    status: string;
}

const UserOrders: React.FC = () => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/orders/user/${user.id}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching user orders:", error);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [user]);

    const handleCancelOrder = async (orderId: number) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        
        try {
            await api.delete(`/orders/${orderId}`);
            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
            alert("Order cancelled successfully.");
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("Failed to cancel order.");
        }
    };

    if (!user) {
        return <h2>Please log in to view your orders.</h2>;
    }

    return (
        <div className="user-orders">
            <h1>Your Orders</h1>
            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div className="order-card" key={order.id}>
                        <h3>Order #{order.id}</h3>
                        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                        <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <div className="order-items">
                            {order.orderItems.map((item, index) => (
                                <div className="order-item" key={index}>
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <h4>{item.name}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="order-actions">
                            <button onClick={() => navigate(`/orders/${order.id}`)}>View Details</button>
                            {order.status === "Pending" && (
                                <button className="cancel" onClick={() => handleCancelOrder(order.id)}>Cancel Order</button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default UserOrders;
