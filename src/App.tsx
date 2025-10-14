import { Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/Auth/Login";
import { RegisterForm } from "./components/Auth/Register";
import { Layout } from "./components/layout/Layout";
import { DashboardPage } from "./components/dashboard/DashboardPage";

// Client Components
import { ClientPage } from "./components/client/ClientPage";
import ClientList from "./components/client/ListAll";
import ClientRegisterForm from "./components/client/RegisterForm";
import ClientUpdateForm from "./components/client/UpdateForm";

// Vehicle Components
import { VehiclePage } from "./components/vehicle/VehiclePage";
import VehicleList from "./components/vehicle/ListAll";
import VehicleRegisterForm from "./components/vehicle/RegisterForm";
import VehicleUpdateForm from "./components/vehicle/UpdateForm";

import "./App.css";

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<LoginForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Main App Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<DashboardPage />} />

        {/* Client Routes */}
        <Route path="/clients" element={<ClientPage />} />
        <Route path="/clients/list" element={<ClientList />} />
        <Route path="/clients/new" element={<ClientRegisterForm />} />
        <Route path="/clients/update/:code" element={<ClientUpdateForm />} />

        {/* Vehicle Routes */}
        <Route path="/vehicles" element={<VehiclePage />} />
        <Route path="/vehicles/list" element={<VehicleList />} />
        <Route path="/vehicles/new" element={<VehicleRegisterForm />} />
        <Route path="/vehicles/update/:id" element={<VehicleUpdateForm />} />
      </Route>

      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
}

export default App;
