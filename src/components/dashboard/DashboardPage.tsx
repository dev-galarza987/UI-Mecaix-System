import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Car, Wrench, CalendarCheck } from 'lucide-react';

const modules = [
  {
    title: "Gestión de Clientes",
    description: "Gestionar todas las operaciones relacionadas con el cliente.",
    path: "/clients",
    icon: <Users className="w-8 h-8 text-primary" />
  },
  {
    title: "Gestión de Vehículos",
    description: "Gestionar todas las operaciones relacionadas con el vehículo.",
    path: "/vehicles",
    icon: <Car className="w-8 h-8 text-primary" />
  },
  {
    title: "Gestión de Servicios",
    description: "Gestionar todas las operaciones relacionadas con el servicio.",
    path: "/services",
    icon: <Wrench className="w-8 h-8 text-primary" />
  },
  {
    title: "Gestión de Reservaciones",
    description: "Gestionar todas las operaciones relacionadas con la reservación.",
    path: "/reservates",
    icon: <CalendarCheck className="w-8 h-8 text-primary" />
  },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <div className='text-center mb-10'>
        <h1 className='text-4xl font-bold text-primary'>Panel de Control Principal</h1>
        <p className='text-muted-foreground'>Selecciona un módulo para comenzar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.title} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              {module.icon}
              <CardTitle>{module.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-muted-foreground mb-4 flex-grow">{module.description}</p>
              <Button onClick={() => navigate(module.path)}>
                Ir a {module.title.split(' ')[0]}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}