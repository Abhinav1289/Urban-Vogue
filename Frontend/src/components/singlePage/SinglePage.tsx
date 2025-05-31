import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/apiService"; // API service
import "./SinglePage.scss";
import { AuthContext } from "../../context/AuthContext";
import ProductCard from "../products/productCard";
import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    description: string;
    rating: number;
    ratingCount: number;
    category: string;
}

interface Review {
    id: number;
    productId: number;
    rating: number;
    comment: string;
    createdAt: string;
    userName: string;
}

const SinglePage: React.FC = () => {
    const { user } = useContext(AuthContext) || {}; // Get logged-in user
    const { id } = useParams<{ id: string }>(); // Get product ID
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { toggleWishlist } = useWishlist();
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/Products/${id}`);
                setProduct(response.data);
                fetchAllProducts(response.data.category);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await api.get(`/review/${id}`);
                setReviews(response.data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            }
        };

        const fetchAllProducts = async (category: string) => {
            try {
                const response = await api.get(`/Products`);
                // Filter products with the same category but exclude the current product
                const filteredProducts = response.data.filter(
                    (p: Product) => p.category === category && p.id !== Number(id)
                );
                setAllProducts(filteredProducts);
            } catch (error) {
                console.error("Error fetching all products:", error);
            }
        };

        fetchProduct();
        fetchReviews();
    }, [id]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("Please log in to submit a review.");
            return;
        }
        if (newReview.comment.trim() === "") {
            setError("Review comment cannot be empty.");
            return;
        }

        try {
            const reviewData = {
                userId: user.id,
                productId: Number(id),
                rating: newReview.rating,
                comment: newReview.comment,
            };

            const response = await api.post("/review/add", reviewData);

            setReviews([...reviews, response.data]); // Update UI instantly
            setNewReview({ rating: 5, comment: "" }); // Reset form
            setError(null);
            setSuccess("Review submitted successfully!");
        } catch (err) {
            console.error("Failed to submit review:", err);
            setError("Failed to submit review. Please try again.");
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            setError("Please log in to add items to your cart.");
            return;
        }

        try {
            await api.post("/cart/add", { userId: user.id, productId: product.id, quantity: 1 });
            setSuccess("Item added to cart successfully!");
            setError(null);
        } catch (err: any) {
            console.error("Error adding to cart:", err);
            setError("Failed to add item to cart. Please try again.");
        }
    };

    const handleWishlist = async () => {
        if (!user) {
            setError("Please log in to add items to your wishlist.");
            return;
        }
    
        try {
            await api.post("/Wishlist/add", { userId: user.id, productId: product.id }); // API call
            toggleWishlist(product.id); // ✅ Update WishlistContext
            setSuccess("Item added to wishlist successfully!");
            setError(null);
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            setError("Failed to add item to wishlist. Please try again.");
        }
    };    

    if (loading) return <div className="loading">Loading product...</div>;
    if (!product) return <div className="error">Product not found.</div>;

    return (
        <div className="SinglePage">
            <div className="single-container">
                <div className="top">
                    <div className="left">
                        <img src={product.image} alt={product.title} />
                    </div>
                    <div className="right">
                        <h1 className="title">{product.title}</h1>
                        <span className="price">${product.price}</span>
                        <p>{product.description}</p>

                        <div className="size">
                            <span>Small</span>
                            <span>Medium</span>
                            <span>Large</span>
                            <span>X-Large</span>
                        </div>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                        <div className="buttons">
                            <button className="btn" onClick={handleWishlist}>
                                Add to Wishlist 🤍
                            </button>
                            <button className="btn" onClick={handleAddToCart}>Add to Cart</button>
                        </div>
                    </div>
                </div>

                <div className="reviews">
                    <h2>Customer Reviews</h2>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((review) => (
                                <li key={review.id} className="review-card">
                                    <strong>{review.userName}</strong> ★ {review.rating}/5
                                    <p>{review.comment}</p>
                                    <small>{new Date(review.createdAt).toLocaleString()}</small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reviews yet. Be the first to review!</p>
                    )}

                    {user && (
                        <form className="review-form" onSubmit={handleReviewSubmit}>
                            <label>
                                <select
                                    value={newReview.rating}
                                    onChange={(e) =>
                                        setNewReview({ ...newReview, rating: Number(e.target.value) })
                                    }
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>{num} Stars</option>
                                    ))}
                                </select>
                            </label>
                            <textarea
                                placeholder="Write your review..."
                                value={newReview.comment}
                                onChange={(e) =>
                                    setNewReview({ ...newReview, comment: e.target.value })
                                }
                            />
                            <button type="submit">Submit Review</button>
                        </form>
                    )}
                </div>

                {/* Related Products */}
                <div className="bottom">
                    <h1>YOU MAY ALSO LIKE</h1>
                    <div className="dress">
                        {allProducts.length > 0 ? (
                            allProducts.slice(0, 3).map((item) => (
                                <Link key={item.id} to={`/product/${item.id}`}>
                                    <ProductCard product={item} />
                                </Link>
                            ))
                        ) : (
                            <p>No similar products found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePage;
