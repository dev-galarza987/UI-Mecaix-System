import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Award,
  Plus,
  List,
  TrendingUp,
  Wrench,
  Calendar,
  Search,
} from "lucide-react";
import {
  mechanicService,
  type Mechanic,
  type MechanicStatistics,
} from "../../services/mechanicService";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function MechanicPage() {
  const navigate = useNavigate();
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [statistics, setStatistics] = useState<MechanicStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First try to get mechanics data
        const mechanicsData = await mechanicService.getAllMechanics();
        setMechanics(mechanicsData.data || []);

        // Try to get statistics (optional)
        try {
          const statsData = await mechanicService.getStatistics();

          // Fallback inteligente: Si la API devuelve 0 mecánicos pero tenemos mecánicos en la lista,
          // usar el cálculo local. Esto corrige el caso donde la API devuelve datos parciales o incorrectos.
          if (
            statsData.totalMechanics === 0 &&
            mechanicsData.data &&
            mechanicsData.data.length > 0
          ) {
            console.warn(
              "⚠️ Estadísticas de API parecen vacías pero hay mecánicos. Usando cálculo local."
            );
            toast.warning(
              "Usando estadísticas calculadas localmente (Datos de API inconsistentes)"
            );
            throw new Error("Datos de API inconsistentes");
          }

          setStatistics(statsData);
          toast.success("Estadísticas cargadas desde API");
        } catch (statsError) {
          console.warn("Statistics not available or invalid:", statsError);
          // Generate basic statistics from mechanics data
          const mechanicsArray = mechanicsData.data || [];
          const activeCount = mechanicsArray.filter(
            (m) => m.status === "active"
          ).length;
          const inactiveCount = mechanicsArray.length - activeCount;
          const avgExperience =
            mechanicsArray.length > 0
              ? mechanicsArray.reduce((sum, m) => sum + m.yearsExperience, 0) /
                mechanicsArray.length
              : 0;

          setStatistics({
            totalMechanics: mechanicsArray.length,
            activeMechanics: activeCount,
            inactiveMechanics: inactiveCount,
            averageExperience: avgExperience,
            experienceLevelDistribution: {
              trainee: 0,
              junior: 0,
              senior: 0,
              expert: 0,
              master: 0,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching mechanics data:", error);
        toast.error("Error al cargar los datos de mecánicos");
        setMechanics([]);
        setStatistics({
          totalMechanics: 0,
          activeMechanics: 0,
          inactiveMechanics: 0,
          averageExperience: 0,
          experienceLevelDistribution: {
            trainee: 0,
            junior: 0,
            senior: 0,
            expert: 0,
            master: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsCards = [
    {
      title: "Total Mecánicos",
      value: statistics?.totalMechanics || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Mecánicos Activos",
      value: statistics?.activeMechanics || 0,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Mecánicos Inactivos",
      value: statistics?.inactiveMechanics || 0,
      icon: UserX,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
    },
    {
      title: "Experiencia Promedio",
      value: `${statistics?.averageExperience?.toFixed(1) || 0} años`,
      icon: Award,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
  ];

  const quickActions = [
    {
      title: "Nuevo Mecánico",
      description: "Agregar un nuevo mecánico al sistema",
      icon: Plus,
      action: () => navigate("/mechanics/create"),
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Lista de Mecánicos",
      description: "Ver y gestionar todos los mecánicos",
      icon: List,
      action: () => navigate("/mechanics/list"),
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Buscar Mecánico",
      description: "Buscar mecánicos por especialidad o código",
      icon: Search,
      action: () => navigate("/mechanics/search"),
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Horarios",
      description: "Gestionar horarios de trabajo",
      icon: Calendar,
      action: () => navigate("/mechanics/schedules"),
      color: "from-orange-500 to-red-600",
    },
  ];

  // Safe array slice with fallback
  const recentMechanics = Array.isArray(mechanics) ? mechanics.slice(0, 3) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/20 dark:bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-slate-300/20 dark:bg-slate-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <div className="relative container mx-auto p-6">
          {/* Header */}
          <motion.div className="text-center mb-12" variants={cardVariants}>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-700 dark:from-slate-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent mb-4">
              Gestión de Mecánicos
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Sistema completo para gestionar tu equipo de mecánicos
              profesionales
            </p>
            <div className="flex items-center justify-center mt-4">
              <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Panel de Control Mecánicos
              </span>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsCards.map((stat, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${stat.bgColor} dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <stat.icon
                          className={`h-8 w-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div className="mb-12" variants={cardVariants}>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-700 dark:text-slate-200 flex items-center text-xl">
                  <TrendingUp className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={action.action}
                        className={`w-full h-auto p-6 bg-gradient-to-br ${action.color} hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-white border-0`}
                      >
                        <action.icon className="h-8 w-8 mb-3" />
                        <span className="font-semibold text-sm mb-1">
                          {action.title}
                        </span>
                        <span className="text-xs opacity-90 text-center leading-tight">
                          {action.description}
                        </span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Mechanics */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-700 dark:text-slate-200 flex items-center text-xl">
                  <Clock className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                  Mecánicos Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentMechanics.length > 0 ? (
                  <div className="space-y-4">
                    {recentMechanics.map((mechanic) => (
                      <div
                        key={mechanic.id}
                        className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 gap-4"
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                            {mechanic.firstName[0]}
                            {mechanic.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {mechanic.firstName} {mechanic.lastName}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {mechanic.employeeCode} •{" "}
                              {mechanic.experienceLevel}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              mechanic.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                          >
                            {mechanic.status === "active"
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => navigate("/mechanics/list")}
                      variant="outline"
                      className="w-full mt-4 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Ver todos los mecánicos
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      No hay mecánicos registrados
                    </p>
                    <Button
                      onClick={() => navigate("/mechanics/create")}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar primer mecánico
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
