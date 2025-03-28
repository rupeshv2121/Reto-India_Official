import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./Redux/Store.jsx";
import { BrowserRouter} from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    {/* <AuthProvider> */}
      <App />
    {/* </AuthProvider> */}
    </Provider>
  </StrictMode>
);
