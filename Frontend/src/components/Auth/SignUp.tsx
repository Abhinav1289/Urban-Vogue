import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/apiService";
import "./Auth.scss";

const SignUp: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await api.post("/Auth/signup", {
                name,
                email,
                password,
            });

            if (response.status === 200 || response.status === 201) {
                alert("Signup successful! Redirecting to login.");
                navigate("/login");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed. Try again.");
        }
    };

    return (
        <div className="auth">
            <div className="container">
                <h1 className="title">SHOP.CO</h1>
                <form onSubmit={handleSubmit}>
                    <h3>Sign Up</h3>
                    {error && <p className="error">{error}</p>}
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
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
                    <button type="submit">Sign Up</button>
                </form>
                <span>
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </div>
        </div>
    );
};

export default SignUp;
