import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Car, List, Plus, Gauge, Calendar, Wrench, ArrowRight } from 'lucide-react';

export function VehiclePage() {
  const navigate = useNavigate();

  // Mock stats data - replace with real data from your service
  const stats = {
    total: 156,
    active: 134,
    maintenance: 8,
    recent: 14
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-4 -right-4 w-96 h-96 bg-cyan-400/10 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-4 w-80 h-80 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-teal-400/10 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [180, 360, 180],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Car className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 dark:from-cyan-400 dark:via-blue-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
            Gestión de Vehículos
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Control total de tu flota vehicular con herramientas avanzadas de gestión
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border-0 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
                <motion.p 
                  className="text-3xl font-bold text-cyan-600 dark:text-cyan-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {stats.total}
                </motion.p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border-0 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Activos</p>
                <motion.p 
                  className="text-3xl font-bold text-green-600 dark:text-green-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  {stats.active}
                </motion.p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Gauge className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border-0 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Mantenimiento</p>
                <motion.p 
                  className="text-3xl font-bold text-amber-600 dark:text-amber-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  {stats.maintenance}
                </motion.p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <Wrench className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border-0 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Nuevos</p>
                <motion.p 
                  className="text-3xl font-bold text-blue-600 dark:text-blue-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  {stats.recent}
                </motion.p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer"
            onClick={() => navigate('/vehicles/list')}
          >
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-cyan-50/90 dark:from-slate-800/90 dark:to-slate-700/90 backdrop-blur-lg hover:shadow-cyan-500/20 transition-all duration-500">
              <CardHeader className="text-center pb-4">
                <motion.div
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-4 group-hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <List className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Listar Vehículos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Explora, edita y gestiona todos los vehículos registrados en el sistema con herramientas avanzadas de búsqueda y filtrado.
                </p>
                <div className="flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400 font-medium group-hover:gap-4 transition-all duration-300">
                  Ver Lista
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer"
            onClick={() => navigate('/vehicles/new')}
          >
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-slate-700/90 backdrop-blur-lg hover:shadow-blue-500/20 transition-all duration-500">
              <CardHeader className="text-center pb-4">
                <motion.div
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl mb-4 group-hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ rotate: -5, scale: 1.1 }}
                >
                  <Plus className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Crear Nuevo Vehículo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Registra un nuevo vehículo en el sistema con toda la información necesaria de forma rápida y sencilla.
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-4 transition-all duration-300">
                  Registrar Vehículo
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-500/5 backdrop-blur-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    💡 Tips para la gestión de vehículos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="space-y-2">
                      <p>• Mantén actualizada la información de cada vehículo</p>
                      <p>• Programa mantenimientos preventivos regularmente</p>
                    </div>
                    <div className="space-y-2">
                      <p>• Utiliza los filtros para encontrar vehículos específicos</p>
                      <p>• Revisa el estado de cada vehículo periódicamente</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
