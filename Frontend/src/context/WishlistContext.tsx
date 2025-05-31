import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getWishlist, addToWishlist, removeFromWishlist, fetchProductById } from "../services/apiService";
import { useAuth } from "./AuthContext";

// Define Product Type
interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
}

// Define WishlistContext type
interface WishlistContextType {
    wishlist: Product[];
    fetchWishlist: () => Promise<void>;
    toggleWishlist: (productId: number) => Promise<void>;
}

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<Product[]>([]);

    // Fetch wishlist from API and get product details
    const fetchWishlist = async () => {
        if (!user) return;

        try {
            const response = await getWishlist(user.id); 
            const productData = await Promise.all(
                response.data.map(async (item: { productId: number }) => {
                    try {
                        const product = await fetchProductById(item.productId);
                        return product; // ✅ Extract product details
                    } catch (error) {
                        console.error(`Error fetching product ${item.productId}:`, error);
                        return null;
                    }
                })
            );

            setWishlist(productData.filter(Boolean)); // ✅ Remove null responses
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            setWishlist([]); // Handle failure case
        }
    };

    // Toggle wishlist (add or remove)
    const toggleWishlist = async (productId: number) => {
        if (!user) return;
        console.log(user.id);
        console.log(productId);
    
        const isInWishlist = wishlist.some(item => item.id === productId);
        try {
            if (isInWishlist) {
                await removeFromWishlist(user.id, productId); // ✅ Remove product from wishlist
            } else {
                await addToWishlist( user.id, productId ); // ✅ Fix: Pass single object
            }
    
            await fetchWishlist(); // Refresh wishlist after updating
        } catch (error) {
            console.error("Error updating wishlist:", error);
        }
    };
    

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    return (
        <WishlistContext.Provider value={{ wishlist, fetchWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

// Custom hook
export const useWishlist = (): WishlistContextType => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
