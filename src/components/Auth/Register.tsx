import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  UserPlus, 
  CheckCircle, 
  Shield, 
  Zap,
  Star,
  Users,
  Wrench,
  Car,
  Calendar
} from "lucide-react";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    setIsLoading(true);
    // Simular registro
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50/50 to-purple-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -right-4 w-96 h-96 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/3 -left-4 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-8 right-1/4 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        {/* Left Panel */}
        <motion.div
          className="hidden lg:flex bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-700 relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"
              animate={{
                background: [
                  "linear-gradient(0deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
                  "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
                  "linear-gradient(0deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)"
                ]
              }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </div>

          <div className="relative flex flex-col items-center justify-center h-full p-12 text-white text-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Logo */}
              <motion.div
                className="mx-auto w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,255,255,0.2)",
                    "0 0 60px rgba(255,255,255,0.4)",
                    "0 0 20px rgba(255,255,255,0.2)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <UserPlus className="h-16 w-16 text-white" />
              </motion.div>

              {/* Title */}
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">¡Únete a Galarza Techcorp!</h2>
                <p className="text-xl opacity-90">Comienza tu gestión mecánica profesional</p>
                <p className="text-white/80 max-w-md mx-auto leading-relaxed">
                  Crea tu cuenta y accede a las mejores herramientas de gestión para talleres mecánicos
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                <motion.div
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 flex items-center gap-4"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle className="h-6 w-6 text-emerald-300" />
                  <div className="text-left">
                    <div className="font-semibold">Gestión Completa</div>
                    <div className="text-sm opacity-80">Clientes, vehículos y servicios</div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 flex items-center gap-4"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Shield className="h-6 w-6 text-blue-300" />
                  <div className="text-left">
                    <div className="font-semibold">Datos Seguros</div>
                    <div className="text-sm opacity-80">Protección total garantizada</div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 flex items-center gap-4"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Zap className="h-6 w-6 text-yellow-300" />
                  <div className="text-left">
                    <div className="font-semibold">Fácil de Usar</div>
                    <div className="text-sm opacity-80">Interface intuitiva y moderna</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          className="flex items-center justify-center py-12 px-4 lg:px-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mx-auto w-full max-w-md space-y-8">
            {/* Header */}
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div
                className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="h-10 w-10 text-white" />
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Crear Cuenta
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Únete a nuestra plataforma de gestión
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Nombre
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input
                            id="firstName"
                            placeholder="Juan"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-emerald-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Apellido
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Pérez"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-emerald-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Correo electrónico
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="juan@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-emerald-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 pr-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-emerald-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Confirmar Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Repite tu contraseña"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pl-10 pr-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-emerald-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Register Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Creando cuenta...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Crear cuenta
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Login Link */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p className="text-sm text-slate-600 dark:text-slate-400">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold transition-colors"
                >
                  Iniciar sesión
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
