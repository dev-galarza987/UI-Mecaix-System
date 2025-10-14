import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ServicePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Gestión de servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Lista de servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Ver, editar y eliminar servicios existentes.</p>
            <Button onClick={() => navigate('/services/list')}>Ir a la lista</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Crear nuevo servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Añadir un nuevo servicio al sistema.</p>
            <Button onClick={() => navigate('/services/new')}>Crear Servicio</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
