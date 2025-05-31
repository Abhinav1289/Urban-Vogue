import { Link } from "react-router-dom";
import ProductCard from "./productCard";
import App from "../crousel/src/js/index"
import './HomePage.scss'
import { useEffect, useState } from "react";
import { fetchTrendingProducts } from "../../services/apiService"; // Import API function

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
}

const HomePage: React.FC = () => {
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTrendingProducts = async () => {
            try {
                const response = await fetchTrendingProducts(); // Fetch trending products
                console.log(response.data);
                setTrendingProducts(response.data); // Store products
            } catch (error) {
                console.error("Error fetching trending products:", error);
            } finally {
                setLoading(false);
            }
        };

        getTrendingProducts();
    }, []);

    return (

        <div className='main-container'>
            <div className="img-cont">

                <div className='abs-container'>

                    <div className="image_heading">
                        <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
                    </div>
                    <p>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
                    <div className="image_button">
                        <button>Shop Now</button>
                    </div>
                    <div className='bottom-rating'>
                        <div className='content'>
                            <span className='count'>200 +</span>
                            <span className='text-content'>International Brands</span>
                        </div>
                        <div className='content' >
                            <span className='count'>2000 +</span>
                            <span className='text-content'>Products</span>
                        </div>
                        <div className='content'>
                            <span className='count'>30000 +</span>
                            <span className='text-content'>Happy Customers</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="moving-strip">
                <img src="./s1.png" alt="" />
                <img src="./s2.png" alt="" />
                <img src="./s3.png" alt="" />
                <img src="./s4.png" alt="" />
                <img src="./s5.png" alt="" />
            </div>

            <div className="products">
            <h1>NEW ARRIVALS</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="products-cont">
                    {trendingProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
            <Link to="/products" className="viewMore">
                View More
            </Link>
        </div>
            <hr />
            <div className="products">
            <h1>TOP SELLING</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="products-cont">
                    {trendingProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
            <Link to="/products" className="viewMore">
                View More
            </Link>
        </div>









            <div className="dress-style" id="dress-style">
                <div className="dress-style-container">
                    <h2>BROWSE BY DRESS STYLE</h2>
                    <div className="upper">
                        <div className="left">
                            <span className="abs-cat">Casual</span>
                        </div>
                        <div className="right">
                            <span className="abs-cat">Formal</span>
                        </div>
                    </div>
                    <div className="lower">
                        <div className="left">  <span className="abs-cat">Party</span></div>
                        <div className="right">  <span className="abs-cat">gym</span></div>
                    </div>
                </div>
            </div>

            <div className='cardContainer'>
                <h2>OUR HAPPY CUSTOMERS</h2>
                <App />


            </div>


        </div>

    );

}
export default HomePage