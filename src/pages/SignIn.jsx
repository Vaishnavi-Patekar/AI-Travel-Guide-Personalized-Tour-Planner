import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate(); 
  
  const [isLogin, setIsLogin] = useState(true);

  // State to capture form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '', // Key for the confirm password field
  });

  const [message, setMessage] = useState(''); 
  const [loading, setLoading] = useState(false); 

  // ------------------------------------------------------------------
  // 🛑 FIX IS HERE: Using e.target.name to correctly identify the field
  // ------------------------------------------------------------------
  const handleChange = (e) => {
    // Dynamically update the state key matching the input's 'name' attribute
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // --- SIGN UP LOGIC ---
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setMessage("Error: Passwords do not match!");
        setLoading(false);
        return;
      }
      
      try {
        // Ensure this URL matches your server's address
        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        // if (response.ok) {
        //   setMessage(`Success! ${data.message} Redirecting...`);
          
        //   setTimeout(() => {
        //     navigate('/itinerary-builder'); 
        //   }, 1500); 

        // } 
        
        
        // File: SignIn.jsx (inside handleSubmit)
if (response.ok) {
  setMessage(`Success! ${data.message} Redirecting...`);
  
  setTimeout(() => {
    // 🛑 CHANGE THIS: Use the correct path from App.jsx
    navigate('/itinerary'); // <-- Changed from '/itinerary-builder'
  }, 1500); 

}else {
          setMessage(`Error: ${data.error || 'Signup failed.'}`);
        }
      } catch (error) {
        console.error("Client-side signup error:", error);
        setMessage("Network error. Could not connect to the server.");
      }
    } 
    // --- SIGN IN (LOGIN) LOGIC (Placeholder for now) ---
    else {
      console.log("Attempting Login with:", formData.email);
      setMessage("Login functionality is not yet implemented.");
    }

    setLoading(false);
  };

  // Toggle function
  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setMessage(''); 
    setFormData({ // Reset form data when toggling mode
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="signin-container">
        <h2>{isLogin ? "Welcome Back! (Sign In)" : "Create Account (Sign Up)"}</h2>

        {message && (
            <p style={{ 
                color: message.startsWith('Error') || message.startsWith('Network') ? 'red' : 'green', 
                marginBottom: '15px', 
                fontWeight: 'bold' 
            }}>{message}</p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* 1. Full Name Input (Added name="fullName") */}
          {!isLogin && (
            <input 
              type="text" 
              name="fullName" // <-- NEW: Unique name attribute
              placeholder="Full Name" 
              required 
              value={formData.fullName}
              onChange={handleChange}
            />
          )}

          {/* 2. Email Input (Added name="email") */}
          <input 
            type="email" 
            name="email" // <-- NEW: Unique name attribute
            placeholder="Email" 
            required 
            value={formData.email}
            onChange={handleChange}
          />

          {/* 3. Password Input (Added name="password") */}
          <input 
            type="password" 
            name="password" // <-- NEW: Unique name attribute
            placeholder="Password" 
            required 
            value={formData.password}
            onChange={handleChange}
          />
          
          {/* 4. Confirm Password (Added name="confirmPassword") */}
          {!isLogin && (
            <input 
              type="password" 
              name="confirmPassword" // <-- NEW: Unique name attribute
              placeholder="Confirm Password" 
              required 
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        {/* 5. Toggle Link */}
        <p className="toggle-text">
          {isLogin ? "New user? " : "Already have an account? "}
          <span onClick={toggleMode} className="toggle-link">
            {isLogin ? "Create an account" : "Sign In here"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;