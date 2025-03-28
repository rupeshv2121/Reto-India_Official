import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { signUpUser } from "../../API/api";
import { useAuth } from "../../Context/AuthContext";
import "./Signup.css";
import LottieAnimation from "../LottieAnimation/LottieAnimation";
import ArtisticAnimation from "../../Lottie/Animation_artistic_3.json";

const Signup = () => {
  const {login} = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNo: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (user) => signUpUser(user),
    onSuccess: (response) => {
      console.log("Signup successful - onSuccess triggered", response);

      setTimeout(() => {
        setShowAnimation(false);
        setUser({ fullName: "", email: "", password: "", phoneNo: "" });

        if (!response.token) {
          console.error("Signup response missing required fields:", response);
          toast.error("Signup failed. Please try again.", { position: "top-center" });
          return;
        }

        toast.success("Signup successful", { position: "top-center" });

        login(response.token, { fullName: user.fullName, email: user.email });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }, 2000);
    },
    onError: (error) => {
      console.error("Error signing up:", error.message);
      setTimeout(() => {
        setShowAnimation(false);
        toast.error("Signup failed. Please try again.", { position: "top-center" });
      }, 2000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.fullName || !user.email || !user.password || !user.phoneNo) {
      toast.warn("Please fill out all fields!", { position: "top-center" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(user.email)) {
      toast.warn("Invalid email format", { position: "top-center" });
      return;
    }
    if (!/^\d{10}$/.test(user.phoneNo)) {
      toast.warn("Invalid phone number format", { position: "top-center" });
      return;
    }
    if (user.password.length < 6) {
      toast.warn("Password must be at least 6 characters long", { position: "top-center" });
      return;
    }
    setShowAnimation(true);
    console.log(user);
    mutate(user);
  };

  const handleGoogleSignup = () => {
    window.location.href = "https://reto-india-backend.onrender.com/auth/google";
  };

  return (
    <div className="ca-signup-container" style={{ backgroundColor: "#ffdaaa" }}>
      <div className="signup-card mt-5">
        <div className="card-content" style={{ backgroundColor: "#fff", borderRadius: "24px" }}>
          <ToastContainer />
          <h1 className="heading-text epilogue">SignUp To View Our Services</h1>
          <div className="signup-content has-text-centered">
            <form onSubmit={handleSubmit} className="signup-content has-text-centered">
              <div className="field input-field">
                <input
                  className="input is-medium"
                  type="text"
                  id="username"
                  value={user.fullName}
                  name="fullName"
                  placeholder="Full Name"
                  onChange={handleOnChange}
                />
              </div>
              <div className="field input-field" style={{ marginTop: "2rem" }}>
                <input
                  className="input is-medium"
                  type="email"
                  id="email"
                  value={user.email}
                  name="email"
                  placeholder="Email ID"
                  onChange={handleOnChange}
                />
              </div>
              <div className="field input-field" style={{ marginTop: "2rem" }}>
                <input
                  className="input is-medium"
                  type="tel"
                  id="phoneNo"
                  value={user.phoneNo}
                  name="phoneNo"
                  placeholder="Phone Number"
                  onChange={handleOnChange}
                />
              </div>
              <div className="field input-field" style={{ marginTop: "2rem", marginBottom: "3rem" }}>
                <div className="password-input-container">
                  <input
                    className="input is-medium"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={user.password}
                    name="password"
                    placeholder="Password"
                    onChange={handleOnChange}
                  />
                  <IconButton
                    aria-label={showPassword ? "hide the password" : "display the password"}
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
                <div className="already-account">
                  <NavLink to={'/auth/login'}>Already have account ?</NavLink>
                </div>
              </div>
              <button
                className="button signup-btn-border is-large is-responsive mt-5"
                id="submitButton"
                style={{ borderRadius: "8px", color: "#000" }}
                disabled={isLoading || showAnimation}
              >
                {isLoading || showAnimation ? "Signing Up..." : "SIGNUP →"}
              </button>
              {showAnimation && (
                <div className="full-screen-loader">
                  <LottieAnimation animationData={ArtisticAnimation} className="full-screen-animation" />
                </div>
              )}
              <div className="divider-wrapper mt-4 mb-4">
                <span>OR</span>
              </div>
              <button className="button signup-btn-border" type="button" onClick={handleGoogleSignup}>
                <i className="icon icon-google"></i>
                Sign up with Google →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;