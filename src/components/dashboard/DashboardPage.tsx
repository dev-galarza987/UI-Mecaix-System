import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Car, Wrench } from 'lucide-react';

const modules = [
  {
    title: "Gestión de clientes",
    description: "Gestiona todas las operaciones relacionadas con los clientes.",
    path: "/clients",
    icon: <Users className="w-8 h-8 text-primary" />
  },
  {
    title: "Gestión de vehículos",
    description: "Gestiona todas las operaciones relacionadas con los vehículos.",
    path: "/vehicles",
    icon: <Car className="w-8 h-8 text-primary" />
  },
  {
    title: "Gestión de servicios",
    description: "Gestiona todas las operaciones relacionadas con los servicios.",
    path: "/services",
    icon: <Wrench className="w-8 h-8 text-primary" />
  },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <div className='text-center mb-10'>
        <h1 className='text-4xl font-bold text-primary'>Dashboard principal</h1>
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
              <Button onClick={() => navigate(module.path)} disabled={module.path === "/services"}>
                Ir a {module.title.split(' ')[0]}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
