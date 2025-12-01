import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GlowingCard,
  StatusIndicator,
} from "@/components/ui/animated-components";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import {
  Users,
  Car,
  Wrench,
  CalendarCheck,
  TrendingUp,
  Clock,
  Settings,
  BarChart3,
} from "lucide-react";

const modules = [
  {
    title: "Gestión de Clientes",
    description: "Gestionar todas las operaciones relacionadas con el cliente.",
    path: "/clients",
    icon: <Users className="w-8 h-8" />,
    color: "from-blue-500 to-blue-600",
    stats: "150+ Clientes",
    trend: "+12% este mes",
  },
  {
    title: "Gestión de Vehículos",
    description:
      "Gestionar todas las operaciones relacionadas con el vehículo.",
    path: "/vehicles",
    icon: <Car className="w-8 h-8" />,
    color: "from-green-500 to-green-600",
    stats: "89 Vehículos",
    trend: "+5% esta semana",
  },
  {
    title: "Gestión de Servicios",
    description:
      "Gestionar todas las operaciones relacionadas con el servicio.",
    path: "/services",
    icon: <Wrench className="w-8 h-8" />,
    color: "from-purple-500 to-purple-600",
    stats: "25 Servicios",
    trend: "Activos",
  },
  {
    title: "Gestión de Reservaciones",
    description:
      "Gestionar todas las operaciones relacionadas con la reservación.",
    path: "/reservates",
    icon: <CalendarCheck className="w-8 h-8" />,
    color: "from-orange-500 to-orange-600",
    stats: "32 Pendientes",
    trend: "+8 hoy",
  },
];

const quickStats = [
  {
    title: "Ingresos del Mes",
    value: "Bs.24.580",
    change: "+15.3%",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-green-600",
  },
  {
    title: "Servicios Completados",
    value: "143",
    change: "+8.2%",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "text-blue-600",
  },
  {
    title: "Tiempo Promedio",
    value: "2.4h",
    change: "-12%",
    icon: <Clock className="w-5 h-5" />,
    color: "text-purple-600",
  },
];

// Datos para los gráficos
const monthlyRevenueData = [
  { month: "Ene", revenue: 18500, services: 45 },
  { month: "Feb", revenue: 20300, services: 52 },
  { month: "Mar", revenue: 22100, services: 58 },
  { month: "Abr", revenue: 19800, services: 49 },
  { month: "May", revenue: 24580, services: 63 },
  { month: "Jun", revenue: 26200, services: 67 },
];

const serviceDistribution = [
  { name: "Mantenimiento", value: 45, color: "#3b82f6" },
  { name: "Reparación", value: 30, color: "#ef4444" },
  { name: "Inspección", value: 15, color: "#f59e0b" },
  { name: "Otros", value: 10, color: "#8b5cf6" },
];

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "#3b82f6",
  },
  services: {
    label: "Servicios",
    color: "#10b981",
  },
} satisfies ChartConfig;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardHoverVariants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.03,
    y: -5,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50">
      <motion.div
        className="container mx-auto p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.h1
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" as const, stiffness: 120 }}
          >
            Panel de Control Mecanix
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Gestiona tu taller mecánico de manera eficiente y moderna
          </motion.p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={itemVariants}
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <GlowingCard
                glowColor={`rgba(${
                  index === 0
                    ? "59, 130, 246"
                    : index === 1
                    ? "34, 197, 94"
                    : "168, 85, 247"
                }, 0.3)`}
              >
                <CardContent className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                        {stat.title}
                      </p>
                      <motion.p
                        className="text-3xl font-bold text-slate-900 dark:text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.5 + index * 0.1,
                          type: "spring" as const,
                          stiffness: 200,
                        }}
                      >
                        {stat.value}
                      </motion.p>
                      <StatusIndicator status="online">
                        <p
                          className={`text-sm ${stat.color} flex items-center gap-1 mt-2`}
                        >
                          {stat.icon}
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            {stat.change}
                          </motion.span>
                        </p>
                      </StatusIndicator>
                    </div>
                    <motion.div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        index === 0
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : index === 1
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-purple-100 dark:bg-purple-900/30"
                      }`}
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring" as const, stiffness: 300 }}
                    >
                      <div
                        className={`${
                          index === 0
                            ? "text-blue-600"
                            : index === 1
                            ? "text-green-600"
                            : "text-purple-600"
                        }`}
                      >
                        {stat.icon}
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </GlowingCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
        >
          {/* Revenue Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Evolución de Ingresos
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Ingresos mensuales de los últimos 6 meses
                </p>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-full"
                >
                  <AreaChart
                    data={monthlyRevenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                    />
                    <YAxis hide />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          className="w-40"
                          formatter={(value) => [
                            `$${value.toLocaleString()}`,
                            "Ingresos",
                          ]}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                    />
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Services Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Tipos de Servicio
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Distribución por categoría
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ChartContainer
                    config={chartConfig}
                    className="h-[180px] w-[180px]"
                  >
                    <PieChart>
                      <Pie
                        data={serviceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {serviceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) => [`${value}%`, "Porcentaje"]}
                          />
                        }
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="mt-6 space-y-3">
                  {serviceDistribution.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Modules Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
          variants={containerVariants}
        >
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants}>
                <Card className="h-full border-0 shadow-xl overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                  <motion.div
                    className={`h-2 bg-gradient-to-r ${module.color}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  />

                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`p-3 rounded-full bg-gradient-to-r ${module.color} text-white shadow-lg`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          {module.icon}
                        </motion.div>
                        <div>
                          <CardTitle className="text-xl text-slate-900 dark:text-white">
                            {module.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              {module.stats}
                            </Badge>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              {module.trend}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 15 }}
                        transition={{ type: "spring" as const, stiffness: 300 }}
                      >
                        <Settings className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      </motion.div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {module.description}
                    </p>{" "}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => navigate(module.path)}
                        className={`w-full bg-gradient-to-r ${module.color} border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                        size="lg"
                      >
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          Acceder al Módulo
                        </motion.span>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12 mb-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Sistema
                  </span>
                </div>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Operativo
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    API
                  </span>
                </div>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  Conectado
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Base de Datos
                  </span>
                </div>
                <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                  Simulado
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Respaldos
                  </span>
                </div>
                <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  Activo
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center mt-8 pt-8 border-t border-slate-200 dark:border-slate-700"
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © 2025 Mecanix UI System - Sistema de gestión para talleres
            mecánicos
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
