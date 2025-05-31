import "./ProductCard.scss";
import { Link } from "react-router-dom";

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    rating: number;
    ratingCount: number;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <Link to={`/product/${product.id}`} className="Pcard">
            <div className="img_cont">
                <img src={product.image} alt={product.title} />
            </div>
            <div className="details">
                <span>{product.title}</span>
                <span>${product.price}</span>
                <div className="rating">
                    ⭐ {product.averageRating} (123 reviews)
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
