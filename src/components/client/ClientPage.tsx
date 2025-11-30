import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getClientStats, type ClientStats } from "../../services/clientService";
import {
  Users,
  UserPlus,
  Search,
  FileText,
  TrendingUp,
  ArrowRight,
  Star,
  Activity,
  UserCheck,
  UserX,
} from "lucide-react";

export function ClientPage() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getClientStats();
        setStatsData(data);
      } catch (error) {
        console.error("Error loading client stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      label: "Total Clientes",
      value: loading ? "..." : statsData?.total.toString() || "0",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Activos",
      value: loading ? "..." : statsData?.activos.toString() || "0",
      icon: UserCheck,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Inactivos",
      value: loading ? "..." : statsData?.inactivos.toString() || "0",
      icon: UserX,
      color: "from-red-500 to-red-600",
    },
    {
      label: "Nuevos (Recientes)",
      value: loading ? "..." : statsData?.clientesRecientes.toString() || "0",
      icon: Star,
      color: "from-amber-500 to-amber-600",
    },
  ];

  const actions = [
    {
      title: "Ver Todos los Clientes",
      description:
        "Explora, busca y gestiona todos los clientes registrados en el sistema.",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      action: () => navigate("/clients/list"),
      features: ["Búsqueda avanzada", "Filtros múltiples", "Exportar datos"],
    },
    {
      title: "Registrar Nuevo Cliente",
      description:
        "Añade nuevos clientes con toda su información personal y de contacto.",
      icon: UserPlus,
      color: "from-emerald-500 to-emerald-600",
      hoverColor: "hover:from-emerald-600 hover:to-emerald-700",
      action: () => navigate("/clients/new"),
      features: [
        "Formulario completo",
        "Validación automática",
        "Datos seguros",
      ],
    },
    {
      title: "Búsqueda Rápida",
      description:
        "Encuentra clientes específicos usando filtros avanzados y búsqueda inteligente.",
      icon: Search,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      action: () => navigate("/clients/list"),
      features: [
        "Búsqueda instantánea",
        "Filtros inteligentes",
        "Resultados precisos",
      ],
    },
    {
      title: "Reportes y Análisis",
      description:
        "Genera reportes detallados y análisis sobre la base de clientes.",
      icon: FileText,
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
      action: () => navigate("/clients/list"),
      features: ["Reportes PDF", "Gráficos interactivos", "Exportar Excel"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-4 -right-4 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-4 w-80 h-80 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative container mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
            Gestión de Clientes
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Administra eficientemente toda tu base de clientes con herramientas
            modernas y potentes
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                    >
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
            >
              <Card className="h-full border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg hover:shadow-3xl transition-all duration-500 group overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                <CardHeader className="relative">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <action.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        {action.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    {action.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2">
                    {action.features.map((feature, idx) => (
                      <motion.div
                        key={feature}
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${action.color}`}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={action.action}
                      size="lg"
                      className={`w-full h-12 bg-gradient-to-r ${action.color} ${action.hoverColor} text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group/btn`}
                    >
                      <span className="flex items-center gap-2">
                        Acceder
                        <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  💡 Consejos Rápidos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div>
                    • Usa filtros para encontrar clientes específicos
                    rápidamente
                  </div>
                  <div>• Mantén actualizada la información de contacto</div>
                  <div>• Revisa regularmente los reportes de actividad</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
