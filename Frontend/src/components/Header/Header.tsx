import './Header.scss';
import { FaShoppingCart, FaUser, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthContextProvider");
    }

    const { user, logout } = authContext;

    // Handle logout function
    const handleLogout = async () => {
        try {
            await api.post("/Auth/logout", {}, { withCredentials: true });
            logout(); // ✅ Update user state to null
            navigate("/login"); // ✅ Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header>
            <div className="top">
                Sign up and get 20% off on your first order.
            </div>

            <div className="bottom">
                <nav className="nav">
                    <h2 className='logo'><Link to="/">Urban Vogue</Link></h2>
                    <Link to="/products">Shop</Link>
                    <a href="#">On Sale</a>
                    <a href="#">New Arrivals</a>
                    <a href="#dress-style">Categories</a>
                </nav>

                <input type="text" placeholder="Search for Products..." />

                <div className='user'>
                    <Link to="/wishlist">
                        <FaHeart />
                    </Link>
                    <Link to="/cart">
                        <FaShoppingCart />
                    </Link>

                    {user ? (
                        <>
                            <span>Hi, {user.name}</span>
                            <button onClick={handleLogout} className="logout-btn">
                                <FaSignOutAlt /> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login">
                            <FaUser /> Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
