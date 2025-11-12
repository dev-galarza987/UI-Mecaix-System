import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { reservateService } from '../../services/reservateService';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  Plus, 
  List, 
  Settings,
  TrendingUp,
  DollarSign
} from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      console.log('🏁 [RESERVATE PAGE] Iniciando fetchStats...');
      try {
        const reservates = await reservateService.getAllReservates();
        console.log('✅ [RESERVATE PAGE] Reservas obtenidas:', reservates);
        console.log('✅ [RESERVATE PAGE] Número de reservas:', reservates?.length);
        console.log('✅ [RESERVATE PAGE] Primera reserva:', reservates?.[0]);
        
        if (!reservates || !Array.isArray(reservates)) {
          console.error('❌ [RESERVATE PAGE] Las reservas no son un array válido:', reservates);
          return;
        }
        
        const stats = reservates.reduce((acc, reservate) => {
          console.log('🔍 [RESERVATE PAGE] Procesando reserva:', { id: reservate.id, code: reservate.code, state: reservate.state, price: reservate.totalPrice });
          acc.total += 1;
          acc.totalRevenue += reservate.totalPrice || 0;
          
          switch (reservate.state) {
            case 'pending':
              acc.pending += 1;
              break;
            case 'confirmed':
              acc.confirmed += 1;
              break;
            case 'in_progress':
              acc.inProgress += 1;
              break;
            case 'completed':
              acc.completed += 1;
              break;
            case 'cancelled':
              acc.cancelled += 1;
              break;
            default:
              console.warn('⚠️ [RESERVATE PAGE] Estado desconocido:', reservate.state);
              break;
          }
          
          return acc;
        }, {
          total: 0,
          pending: 0,
          confirmed: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0,
          totalRevenue: 0,
        });

        console.log('📊 [RESERVATE PAGE] Stats calculadas:', stats);
        setStats(stats);
      } catch (error) {
        console.error('❌ [RESERVATE PAGE] Error fetching reservates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
          <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        </div>

        <div className="relative container mx-auto p-4 max-w-7xl">
          {/* Header */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <CalendarDays className="h-10 w-10 text-emerald-600 mr-4" />
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent">
                  Gestión de Reservas
                </h1>
                <p className="text-emerald-600/80 text-xl mt-2">
                  Sistema completo de administración de reservaciones
                </p>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-xl border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600/80 text-sm font-medium">Total Reservas</p>
                      <p className="text-3xl font-bold text-emerald-800">
                        {isLoading ? '...' : stats.total}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                      <CalendarDays className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-xl border-green-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600/80 text-sm font-medium">En Progreso</p>
                      <p className="text-3xl font-bold text-green-800">
                        {isLoading ? '...' : stats.inProgress}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-xl border-teal-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-600/80 text-sm font-medium">Completadas</p>
                      <p className="text-3xl font-bold text-teal-800">
                        {isLoading ? '...' : stats.completed}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-xl border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600/80 text-sm font-medium">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-emerald-800">
                        ${isLoading ? '...' : stats.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Status Overview */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/70 backdrop-blur-xl border-emerald-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-emerald-700 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  Estado de las Reservas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mb-2">
                      Pendientes
                    </Badge>
                    <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-2">
                      Confirmadas
                    </Badge>
                    <p className="text-2xl font-bold text-blue-700">{stats.confirmed}</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mb-2">
                      En Progreso
                    </Badge>
                    <p className="text-2xl font-bold text-orange-700">{stats.inProgress}</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2">
                      Completadas
                    </Badge>
                    <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mb-2">
                      Canceladas
                    </Badge>
                    <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Cards - Compactas */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-xl border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 group h-full">
                <CardContent className="flex flex-col justify-between h-32 p-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <List className="h-5 w-5 text-emerald-600 mr-2" />
                      <h3 className="text-lg font-semibold text-emerald-700">Listar Reservas</h3>
                    </div>
                    <p className="text-emerald-600/80 text-sm">Ver y gestionar todas las reservaciones</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/reservates/list')}
                    className="w-full h-8 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg font-semibold text-sm mt-3"
                  >
                    <List className="h-4 w-4 mr-2" />
                    Ir a la lista
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-xl border-green-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 group h-full">
                <CardContent className="flex flex-col justify-between h-32 p-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Plus className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-green-700">Nueva Reserva</h3>
                    </div>
                    <p className="text-green-600/80 text-sm">Crear nueva reservación con servicios</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/reservates/new')}
                    className="w-full h-8 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg font-semibold text-sm mt-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Reserva
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-xl border-teal-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 group h-full">
                <CardContent className="flex flex-col justify-between h-32 p-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Settings className="h-5 w-5 text-teal-600 mr-2" />
                      <h3 className="text-lg font-semibold text-teal-700">Administración</h3>
                    </div>
                    <p className="text-teal-600/80 text-sm">Herramientas y configuración del sistema</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/reservates/list')}
                    className="w-full h-8 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg font-semibold text-sm mt-3"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Ver Panel
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}