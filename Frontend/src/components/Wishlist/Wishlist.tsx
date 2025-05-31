import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../products/productCard";
import { Link } from "react-router-dom";
import "./Wishlist.scss"; 

const WishlistPage = () => {
    const { user } = useAuth();
    const { wishlist, toggleWishlist } = useWishlist();

    const handleRemove = (productId: number) => {
        if (!user) return;
        toggleWishlist(productId); // Removes item from wishlist
    };

    if (!user) {
        return <p className="wishlist-message">Please log in to view your wishlist.</p>;
    }

    return (
        <div className="wishlist-container">
            <h2>My Wishlist</h2>
            {wishlist.length > 0 ? (
                <div className="wishlist-items">
                    {wishlist.map((product) => (
                        <div key={product.id} className="wishlist-card">
                            <Link to={`/product/${product.id}`}>
                                <ProductCard key={product.id} product={product} />
                            </Link>
                            <button className="remove-btn" onClick={() => handleRemove(product.id)}>
                                Remove ❌
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="wishlist-message">Your wishlist is empty.</p>
            )}
        </div>
    );
};

export default WishlistPage;
