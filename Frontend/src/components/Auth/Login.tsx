import { useState, FormEvent, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiReq from "../../services/apiService";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.scss";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthContextProvider");
    }

    const { updateUser } = useContext(AuthContext)!;

    const handleLogin = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setError(null);

        try {
            // Send login request
            await apiReq.post("/Auth/login", { email, password });

            // Fetch user details from /api/Auth/token
            const userResponse = await apiReq.get("/Auth/token");
            const { userId, name, email: userEmail } = userResponse.data;

            // Update AuthContext
            updateUser({ id: userId, name, email: userEmail });
            console.log("Login successful");
            navigate("/");
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="auth">
            <div className="container">
                <h1 className="title">SHOP.CO</h1>
                <form onSubmit={handleLogin}>
                    <h3>Sign In</h3>
                    {error && <p className="error">{error}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <span>
                    New user? <Link to="/signup">Sign Up</Link>
                </span>
            </div>
        </div>
    );
};

export default Login;