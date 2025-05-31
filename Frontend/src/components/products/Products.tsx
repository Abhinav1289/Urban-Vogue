import { useState, useEffect } from "react";
import apiReq from "../../services/apiService";
import ProductCard from "./productCard";
import "./products.scss";
import { Link } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    rating: number;
}

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [category, setCategory] = useState<string>("");
    const [price, setPrice] = useState<number>(5000);
    const [sortBy, setSortBy] = useState<string>("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiReq.get("/products");
                setProducts(response.data);
                setFilteredProducts(response.data); // Initialize filtered products
            } catch (err: any) {
                setError("Failed to fetch products");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let updatedProducts = [...products];

        // Filter by category
        if (category) {
            updatedProducts = updatedProducts.filter(
                (product) => product.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by price range
        updatedProducts = updatedProducts.filter((product) => product.price <= price);

        // Sorting logic
        if (sortBy === "price-low-high") {
            updatedProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high-low") {
            updatedProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "customer-rating") {
            updatedProducts.sort((a, b) => b.rating - a.rating);
        }

        setFilteredProducts(updatedProducts);
    }, [category, price, sortBy, products]);

    return (
        <div className="products">
            <div className="products-container">
                <div className="filter">
                    {/* Category Filter */}
                    <select id="categories" onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="formal">Formal</option>
                        <option value="casual">Casual</option>
                        <option value="gym">Gym</option>
                        <option value="party">Party</option>
                        <option value="kids">Kids</option>
                    </select>

                    {/* Price Range Filter */}
                    <div className="price-filter">
                        <div className="price-label">
                            Selected Price: $<span>{price}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>

                    {/* Sorting Filter */}
                    <div className="sortby">
                        <select id="sort-by" onChange={(e) => setSortBy(e.target.value)}>
                            <option value="">Sort By</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="customer-rating">Customer Rating</option>
                        </select>
                    </div>
                </div>

                {/* Product Listing */}
                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="bottom">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <Link key={product.id} to={`/product/${product.id}`}>
                                    <ProductCard key={product.id} product={product} />
                                </Link>
                            ))
                        ) : (
                            <p>No products found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
