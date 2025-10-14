import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export function RegisterForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Registration Form */}
        <Card className="mx-auto w-full max-w-md shadow-2xl border-2 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
              </svg>
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Crear Cuenta
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Únete a Galarza Techcorp y comienza a gestionar tu taller
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name" className="text-sm font-semibold">Nombre</Label>
                  <Input 
                    id="first-name" 
                    placeholder="Juan" 
                    required 
                    className="h-12 bg-background/50 border-2 focus:border-primary transition-colors"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name" className="text-sm font-semibold">Apellido</Label>
                  <Input 
                    id="last-name" 
                    placeholder="Pérez" 
                    required 
                    className="h-12 bg-background/50 border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-semibold">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@example.com"
                  required
                  className="h-12 bg-background/50 border-2 focus:border-primary transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm font-semibold">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Mínimo 8 caracteres"
                  className="h-12 bg-background/50 border-2 focus:border-primary transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-sm font-semibold">Confirmar Contraseña</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="Repite tu contraseña"
                  className="h-12 bg-background/50 border-2 focus:border-primary transition-colors"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Crear cuenta
              </Button>
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">O regístrate con</span>
                </div>
              </div> */}
              {/* <Button variant="outline" className="w-full h-12 border-2 hover:bg-accent transition-colors">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Registrarse con Google
              </Button> */}
            </div>
            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 underline font-semibold transition-colors">
                Iniciar sesión
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Information Panel */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-primary">¡Únete a nosotros!</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Gestiona tu taller mecánico con las mejores herramientas disponibles
            </p>
          </div>

          <div className="grid gap-6 max-w-md mx-auto">
            <div className="flex items-center space-x-4 bg-card/30 backdrop-blur-sm p-4 rounded-lg border">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-primary">Gestión Completa</h3>
                <p className="text-sm text-muted-foreground">Clientes, vehículos y servicios en un solo lugar</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-card/30 backdrop-blur-sm p-4 rounded-lg border">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-primary">Fácil de Usar</h3>
                <p className="text-sm text-muted-foreground">Interface intuitiva y amigable</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-card/30 backdrop-blur-sm p-4 rounded-lg border">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-primary">Seguro y Confiable</h3>
                <p className="text-sm text-muted-foreground">Tus datos protegidos al máximo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
