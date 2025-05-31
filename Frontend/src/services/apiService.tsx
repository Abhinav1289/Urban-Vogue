import axios from "axios";

const API_BASE_URL = "http://localhost:5160/api"; // Update with your actual backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Authentication
export const signup = (userData) => api.post("/Auth/signup", userData);
export const login = (credentials) => api.post("/Auth/login", credentials);
export const logout = () => api.post("/Auth/logout");

// Products
export const fetchProducts = () => api.get("/Products");
export const fetchProductById = async (id: number) => {
  try {
    const response = await api.get(`/Products/${id}`);
    return response.data; // ✅ Ensure we return the actual product data
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

export const fetchTrendingProducts = () => api.get("/Products/trending");

// Cart
export const addToCart = (data) => api.post("/cart/add", data);
export const removeFromCart = (userId, productId) => api.delete(`/cart/remove`, { params: { userId, productId } });
export const getCartItems = (userId) => api.get(`/cart/${userId}`);

// Wishlist
export const addToWishlist = (data, productId: number) => api.post("/Wishlist/add", data);
export const removeFromWishlist = (userId, productId) =>
  api.delete("/Wishlist/remove", { data: { userId, productId } });
export const getWishlist = (userId) => api.get(`/Wishlist/${userId}`);

// Orders
export const fetchOrders = () => api.get("/orders");
export const fetchUserOrders = (userId) => api.get(`/orders/user/${userId}`);
export const createOrder = (orderData) => api.post("/orders", orderData);
export const cancelOrder = (id) => api.delete(`/orders/${id}`);

// ✅ Get order details by order ID
export const fetchOrderById = (orderId) => api.get(`/orders/${orderId}`);

// ✅ Update order status
export const updateOrderStatus = (orderId, status) => api.put(`/orders/${orderId}/status`, { status });

// ✅ Fetch order items of a specific order
export const fetchOrderItems = (orderId) => api.get(`/orders/${orderId}/items`);

// Reviews
export const addReview = (reviewData) => api.post("/review/add", reviewData);
export const getReviews = (productId) => api.get(`/review/${productId}`);
export const getAverageRating = (productId) => api.get(`/review/${productId}/average-rating`);

export default api;
