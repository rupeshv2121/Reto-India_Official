import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadCart, resetCart } from "../Redux/CartSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();

  // In your AuthProvider or main App component:
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        dispatch(loadCart(JSON.parse(savedCart)));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("fullName");

    if (token) {
      setIsLoggedIn(true);
      setFullName(storedUser);
      setUserId(localStorage.getItem("userId"));
      console.log("AuthContext Loaded: ", { token, storedUser });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("fullName", user.fullName);
    setIsLoggedIn(true);
    setFullName(user.fullName);
    console.log("User logged in: ", { token, fullName });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("fullName");
    dispatch(resetCart()); // Reset cart state
    // localStorage.removeItem('cart'); // Remove cart from localStorage
    setIsLoggedIn(false);
    setFullName("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, fullName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
