import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { loginUser } from "../../API/api";
import { useAuth } from "../../Context/AuthContext";
import "./Login.css";
import Lottie from "lottie-react";
import ArtisticAnimation from "../../Lottie/Animation_artistic_3.json";
import { useDispatch, useSelector } from "react-redux";
import { loadCart } from "../../Redux/CartSlice";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleCartSync = async () => {
    try {
      if (cartItems.length > 0) {
        // If user had items in cart before logging in, save them to database
        await saveCartToDatabase(cartItems);
      } else {
        // Otherwise, load their saved cart from database
        const dbCart = await loadCartFromDatabase();
        if (dbCart && dbCart.length > 0) {
          dispatch(
            loadCart({
              items: dbCart,
              totalQuantity: dbCart.reduce(
                (sum, item) => sum + item.quantity,
                0
              ),
            })
          );
        }
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
      // Don't show error to user as this is a background operation
    }
  };


  const { mutate } = useMutation({
    mutationFn: (user) => loginUser(user),
    onMutate: () => setIsLoading(true),
    onSuccess: async (response) => {
      console.log(response);
      toast.success("Login Successfully");
      console.log(response.data);
      login(response.token, response.user);
      // Then sync the cart
      await handleCartSync();
      setUser({
        email: "",
        password: "",
      });
      navigate("/");
      window.location.reload();
    },

    onError: (error) => {
      setIsLoading(false);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
        { position: "top-center" }
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      toast.warn("Please fill out all fields!", { position: "top-center" });
      return;
    }
    console.log(user);
    mutate(user);
  };

  return (
    <div className="unique-login-wrapper">
      <ToastContainer style={{ zIndex: "10000000" }} />
      {isLoading && (
        <div className="full-screen-loader">
          <Lottie
            animationData={ArtisticAnimation}
            className="full-screen-animation"
          />
        </div>
      )}
      <div className="unique-login-container">
        <h1>Login</h1>
        <h2>One Aim. More Organic Traffic to you, effortlessly.</h2>

        {!isLoading && (
          <div className="unique-login-card">
            <form>
              <div className="unique-login-content">
                {/* Email Input */}

                <div>
                  <input
                    id="unique-email"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleOnChange}
                    placeholder="Email ID"
                  />
                </div>
                {/* Password Input */}
                <div>
                  <input
                    id="unique-password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleOnChange}
                  />
                  <span className="unique-eye-icon">
                    <i className="unique-eye-icon"></i>
                  </span>
                </div>
                <button
                  id="unique-loginButton"
                  className="unique-login-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  LOGIN →
                </button>
                
                <div className="unique-divider">
                  <span>OR</span>
                </div>
                <button
                  id="unique-googleLoginButton"
                  className="unique-google-login-btn"
                >
                  <i className="unique-google-icon"></i> Sign in with Google →
                </button>
              </div>
              <div className="user-login">
                <NavLink
                  to="/auth/signup"
                  className="has-text-black is-underlined"
                  id="createAccountLink"
                >
                  Create New Account
                </NavLink>
                <span className="has-text-black">
                  <span className="unique-divider">|</span>
                </span>
                <NavLink
                  href="#"
                  className="has-text-black is-underlined"
                  id="forgotPasswordLink"
                >
                  Forgot Password?
                </NavLink>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
