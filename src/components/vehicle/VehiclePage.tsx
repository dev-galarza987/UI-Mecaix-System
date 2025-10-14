import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function VehiclePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Gestión de vehiculos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Listar Vehículos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Ver, editar y eliminar vehículos existentes.</p>
            <Button onClick={() => navigate('/vehicles/list')}>Ir a Listar</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Crear Nuevo Vehículo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Añadir un nuevo vehículo al sistema.</p>
            <Button onClick={() => navigate('/vehicles/new')}>Crear Vehículo</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
