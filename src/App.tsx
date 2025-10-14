import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { Layout } from './components/layout/Layout';

// Auth Components
import { LoginForm } from './components/Auth/Login';
import { RegisterForm } from './components/Auth/Register'; /* No Cambies la importación de este componentes de auth */

// Client Components
import { ClientPage } from './components/client/ClientPage';
import ClientList from './components/client/ListAll';
import ClientRegisterForm from './components/client/RegisterForm';
import ClientUpdateForm from './components/client/UpdateForm';

// Vehicle Components
import { VehiclePage } from './components/vehicle/VehiclePage';
import VehicleList from './components/vehicle/ListAll';
import VehicleRegisterForm from './components/vehicle/RegisterForm';
import VehicleUpdateForm from './components/vehicle/UpdateForm';

// Service Components
import { ServicePage } from './components/service/ServicePage';
import ServiceList from './components/service/ListAll';
import ServiceRegisterForm from './components/service/RegisterForm';
import ServiceUpdateForm from './components/service/UpdateForm';

// Reservate Components
import { ReservatePage } from './components/reservate/ReservatePage';
import ReservateList from './components/reservate/ListAll';
import ReservateRegisterForm from './components/reservate/RegisterForm';
import ReservateUpdateForm from './components/reservate/UpdateForm';

// Error Components
import { NotFoundPage } from './components/error/Not-Found-404';

import './App.css';

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

        {/* Service Routes */}
        <Route path="/services" element={<ServicePage />} />
        <Route path="/services/list" element={<ServiceList />} />
        <Route path="/services/new" element={<ServiceRegisterForm />} />
        <Route path="/services/update/:code" element={<ServiceUpdateForm />} />

        {/* Reservate Routes */}
        <Route path="/reservates" element={<ReservatePage />} />
        <Route path="/reservates/list" element={<ReservateList />} />
        <Route path="/reservates/new" element={<ReservateRegisterForm />} />
        <Route path="/reservates/update/:code" element={<ReservateUpdateForm />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
