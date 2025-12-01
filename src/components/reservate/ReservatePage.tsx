import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reservateService } from "../../services/reservateService";

export function ReservatePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const reservates = await reservateService.getAllReservates();
        if (reservates && Array.isArray(reservates)) {
          const newStats = reservates.reduce(
            (acc, reservate) => {
              acc.total += 1;
              acc.totalRevenue += reservate.totalPrice || 0;
              switch (reservate.state) {
                case "pending":
                  acc.pending += 1;
                  break;
                case "confirmed":
                  acc.confirmed += 1;
                  break;
                case "in_progress":
                  acc.inProgress += 1;
                  break;
                case "completed":
                  acc.completed += 1;
                  break;
                case "cancelled":
                  acc.cancelled += 1;
                  break;
              }
              return acc;
            },
            {
              total: 0,
              pending: 0,
              confirmed: 0,
              inProgress: 0,
              completed: 0,
              cancelled: 0,
              totalRevenue: 0,
            }
          );
          setStats(newStats);
        }
      } catch (error) {
        console.error("Error fetching reservates:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
            Gestión de Reservaciones
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-600">
                Total Reservas
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-600">Pendientes</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-600">En Progreso</h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.inProgress}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-600">Completadas</h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.completed}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <CardContent className="p-8">
            <h3 className="text-emerald-100 text-sm">Ingresos Totales</h3>
            <p className="text-4xl font-bold">
              Bs.{stats.totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="bg-white/70 backdrop-blur-sm border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate("/reservates/new")}
          >
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Nueva Reserva</h3>
              <p className="text-gray-600 mb-4">Crear una nueva reservación</p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Crear Reserva
              </Button>
            </CardContent>
          </Card>

          <Card
            className="bg-white/70 backdrop-blur-sm border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate("/reservates/list")}
          >
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Ver Todas</h3>
              <p className="text-gray-600 mb-4">
                Lista completa de reservaciones
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Ver Lista
              </Button>
            </CardContent>
          </Card>

          {/*<Card
            className="bg-white/70 backdrop-blur-sm border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate("/reservates/analytics")}
          >
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Reportes</h3>
              <p className="text-gray-600 mb-4">Análisis y reportes</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Ver Reportes
              </Button>
            </CardContent>
          </Card>*/}
        </div>
      </div>
    </div>
  );
}
