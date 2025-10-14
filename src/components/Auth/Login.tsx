import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "dev.galarza@gmail.com" && password === "12413087") {
      navigate("/home");
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="mx-auto grid w-[400px] gap-6 p-8">
          <div className="grid gap-2 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM9 9V6h2v3h3v2h-3v3H9v-3H6V9h3z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Bienvenido
            </h1>
            <p className="text-balance text-muted-foreground text-lg">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>
          <div className="grid gap-6 bg-card/50 backdrop-blur-sm p-6 rounded-lg border shadow-lg">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-semibold">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background/50 border-2 focus:border-primary transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-sm font-semibold">Contraseña</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm text-primary hover:text-primary/80 underline transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-background/50 border-2 focus:border-primary transition-colors"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                onClick={handleLogin}
              >
                Iniciar sesión
              </Button>
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                </div>
              </div> */}
              {/* <Button variant="outline" className="w-full h-12 border-2 hover:bg-accent transition-colors">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Iniciar sesión con Google
              </Button> */}
            </div>
          </div>
          <div className="text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80 underline font-semibold transition-colors">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
        <div className="relative h-full flex items-center justify-center p-8">
          <div className="text-center space-y-6">
            <div className="mx-auto w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-primary">Galarza Techcorp</h2>
              <p className="text-xl text-muted-foreground">Sistema de Gestión Mecánica</p>
              <p className="text-muted-foreground max-w-md mx-auto">
                Administra tu taller mecánico de manera eficiente con nuestro sistema integral de gestión.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm">
              <div className="bg-card/30 backdrop-blur-sm p-4 rounded-lg border">
                <div className="font-semibold text-primary">Clientes</div>
                <div className="text-muted-foreground">Gestión completa</div>
              </div>
              <div className="bg-card/30 backdrop-blur-sm p-4 rounded-lg border">
                <div className="font-semibold text-primary">Vehículos</div>
                <div className="text-muted-foreground">Control detallado</div>
              </div>
              <div className="bg-card/30 backdrop-blur-sm p-4 rounded-lg border">
                <div className="font-semibold text-primary">Servicios</div>
                <div className="text-muted-foreground">Seguimiento total</div>
              </div>
              <div className="bg-card/30 backdrop-blur-sm p-4 rounded-lg border">
                <div className="font-semibold text-primary">Reportes</div>
                <div className="text-muted-foreground">Análisis avanzado</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}