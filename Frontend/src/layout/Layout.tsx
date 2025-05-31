import React, { useContext } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/footer';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useWishlist } from "../../context/WishlistContext";


interface LayoutProps { }

const Layout: React.FC<LayoutProps> = () => {
    return (
        <div className='layout'>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};


const RequireAuth: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext || !authContext.currentUser) {
        return <Navigate to="/login" />;
    } else {
        return (
            <div className="layout">
                <Header />
                <div className="content">
                    <Outlet />
                </div>
                <Footer />
            </div>
        );
    }
}
export { Layout, RequireAuth };
