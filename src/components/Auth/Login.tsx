import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Wrench, Users, Car, Calendar } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email === "dev.galarza@gmail.com" && password === "12413087") {
      setIsLoading(true);
      // Simular loading
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -left-4 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-4 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-1/3 w-72 h-72 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        {/* Login Form */}
        <motion.div
          className="flex items-center justify-center py-12 px-4 lg:px-8"
          initial={{ opacity: 0, x: -50 }}
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
                className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Lock className="h-10 w-10 text-white" />
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
                  Bienvenido de vuelta
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Accede a tu panel de control
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
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Contraseña
                        </Label>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-blue-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                          placeholder="••••••••"
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

                    {/* Login Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Iniciando sesión...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Iniciar sesión
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Register Link */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p className="text-sm text-slate-600 dark:text-slate-400">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          className="hidden lg:flex bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20"
              animate={{
                background: [
                  "linear-gradient(0deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
                  "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
                  "linear-gradient(0deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>

          <div className="relative flex flex-col items-center justify-center h-full p-12 text-white text-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {/* Logo */}
              <motion.div
                className="mx-auto w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,255,255,0.2)",
                    "0 0 40px rgba(255,255,255,0.4)",
                    "0 0 20px rgba(255,255,255,0.2)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Wrench className="h-16 w-16 text-white" />
              </motion.div>

              {/* Title */}
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">Galarza Techcorp</h2>
                <p className="text-xl opacity-90">Sistema de Gestión Mecánica</p>
                <p className="text-white/80 max-w-md mx-auto leading-relaxed">
                  Transforma la gestión de tu taller con nuestro sistema integral y moderno
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                <motion.div
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Users className="h-8 w-8 mx-auto mb-3" />
                  <div className="font-semibold">Clientes</div>
                  <div className="text-sm opacity-80">Gestión integral</div>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Car className="h-8 w-8 mx-auto mb-3" />
                  <div className="font-semibold">Vehículos</div>
                  <div className="text-sm opacity-80">Control total</div>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Wrench className="h-8 w-8 mx-auto mb-3" />
                  <div className="font-semibold">Servicios</div>
                  <div className="text-sm opacity-80">Seguimiento</div>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Calendar className="h-8 w-8 mx-auto mb-3" />
                  <div className="font-semibold">Reservas</div>
                  <div className="text-sm opacity-80">Programación</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}