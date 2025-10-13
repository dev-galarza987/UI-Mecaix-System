import { Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/Auth/Login";
import { RegisterForm } from "./components/Auth/Register";
import { Home } from "./Home";
import "./App.css";
import { Client } from "./components/client/ClientMain";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/home" element={<Home />} />
      {/* Client */}
      <Route path="/client" element={<Client />} />
      {/* <Route path="/client/:id" element={<Client />} /> */}
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
}

export default App;
