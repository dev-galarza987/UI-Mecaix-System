import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <p className="text-2xl font-semibold text-muted-foreground">Oops! No se encontró la página.</p>
        <p className="text-lg text-muted-foreground">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Button onClick={() => navigate("/home")}>Volver a Inicio</Button>
      </div>
    </div>
  );
}
