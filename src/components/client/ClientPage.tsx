import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ClientPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Gestión de clientes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Listar Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Ver, editar y eliminar clientes existentes.</p>
            <Button onClick={() => navigate('/clients/list')}>Ir a la lista de clientes</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Crear Nuevo Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Agregar un nuevo cliente al sistema.</p>
            <Button onClick={() => navigate('/clients/new')}>Crear Cliente</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
