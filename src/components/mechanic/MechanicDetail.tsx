import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit3,
  Phone,
  Calendar,
  Award,
  Clock,
  Star,
  User,
  Wrench,
  Users,
  Activity
} from 'lucide-react';
import { mechanicService, type Mechanic } from '../../services/mechanicService';
import { Spinner } from '@/components/ui/spinner';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Helper functions
const getExperienceLevelLabel = (level: string): string => {
  switch (level) {
    case 'trainee': return 'Aprendiz';
    case 'junior': return 'Junior';
    case 'senior': return 'Senior';
    case 'expert': return 'Experto';
    case 'master': return 'Maestro';
    default: return level;
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'active': return 'Activo';
    case 'inactive': return 'Inactivo';
    case 'on_leave': return 'En Licencia';
    case 'terminated': return 'Terminado';
    default: return status;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'inactive': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'on_leave': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'terminated': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getSpecialtyLabel = (specialty: string): string => {
  const specialtyLabels: Record<string, string> = {
    'engine': 'Motor',
    'transmission': 'Transmisión',
    'brakes': 'Frenos',
    'suspension': 'Suspensión',
    'electrical': 'Eléctrico',
    'air_conditioning': 'Aire Acond.',
    'bodywork': 'Carrocería',
    'painting': 'Pintura',
    'diagnostics': 'Diagnóstico',
    'general': 'General'
  };
  return specialtyLabels[specialty] || specialty;
};

const getWorkDayLabel = (day: string): string => {
  const dayLabels: Record<string, string> = {
    'Monday': 'Lunes',
    'Tuesday': 'Martes', 
    'Wednesday': 'Miércoles',
    'Thursday': 'Jueves',
    'Friday': 'Viernes',
    'Saturday': 'Sábado',
    'Sunday': 'Domingo'
  };
  return dayLabels[day] || day;
};

export default function MechanicDetail() {
  const { employeeCode } = useParams<{ employeeCode: string }>();
  const navigate = useNavigate();
  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMechanic = async () => {
      if (!employeeCode) {
        setError('Código de empleado no válido');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 [MECHANIC DETAIL] Buscando mecánico con código:', employeeCode);
        setLoading(true);
        const mechanicData = await mechanicService.getMechanicByCode(employeeCode);
        console.log('📋 [MECHANIC DETAIL] Mecánico encontrado:', mechanicData);
        setMechanic(mechanicData);
        setError(null);
      } catch (err) {
        console.error('❌ [MECHANIC DETAIL] Error al cargar mecánico:', err);
        setError('Error al cargar los detalles del mecánico');
      } finally {
        setLoading(false);
      }
    };

    fetchMechanic();
  }, [employeeCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Cargando detalles del mecánico...
          </p>
        </div>
      </div>
    );
  }

  if (error || !mechanic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <User className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {error || 'Mecánico no encontrado'}
          </p>
          <Button onClick={() => navigate('/mechanics/list')} variant="outline">
            Volver a la lista
          </Button>
        </div>
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
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/20 dark:bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-32 right-10 w-96 h-96 bg-slate-300/20 dark:bg-slate-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="relative container mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <Button 
            variant="outline" 
            onClick={() => navigate('/mechanics/list')} 
            className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la Lista
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-700 dark:from-slate-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent mb-2">
                Detalles del Mecánico
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {mechanic.firstName} {mechanic.lastName}
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate(`/mechanics/${mechanic.employeeCode}/edit`)}
                className="bg-gradient-to-r from-slate-500 via-blue-500 to-indigo-600 hover:from-slate-600 hover:via-blue-600 hover:to-indigo-700 text-white shadow-lg"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar Mecánico
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div variants={cardVariants} className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {mechanic.firstName[0]}{mechanic.lastName[0]}
                </div>
                <CardTitle className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                  {mechanic.firstName} {mechanic.lastName}
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  {mechanic.employeeCode}
                </p>
                <Badge className={`mt-2 ${getStatusColor(mechanic.status)}`}>
                  {getStatusLabel(mechanic.status)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-slate-700 dark:text-slate-300">{mechanic.phone}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Contratado: {new Date(mechanic.hireDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {mechanic.yearsExperience} años de experiencia
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {getExperienceLevelLabel(mechanic.experienceLevel)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details Cards */}
          <motion.div variants={cardVariants} className="lg:col-span-2 space-y-6">
            {/* Work Schedule */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-700 dark:text-slate-200 flex items-center">
                  <Clock className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                  Horario de Trabajo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Horario:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {mechanic.workScheduleStart} - {mechanic.workScheduleEnd}
                  </span>
                </div>
                
                <Separator />
                
                <div>
                  <span className="text-slate-600 dark:text-slate-400 block mb-2">Días de trabajo:</span>
                  <div className="flex flex-wrap gap-2">
                    {mechanic.workDays?.map((day, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                        {getWorkDayLabel(day)}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Tarifa por hora:</span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                    ${mechanic.hourlyRate?.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-700 dark:text-slate-200 flex items-center">
                  <Wrench className="h-6 w-6 mr-3 text-orange-600 dark:text-orange-400" />
                  Especialidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mechanic.specialties?.map((specialty, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200 dark:border-orange-700 rounded-lg p-3 text-center"
                    >
                      <span className="font-medium text-orange-700 dark:text-orange-300">
                        {getSpecialtyLabel(specialty)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-700 dark:text-slate-200 flex items-center">
                  <Activity className="h-6 w-6 mr-3 text-indigo-600 dark:text-indigo-400" />
                  Información Adicional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block mb-1">Fecha de registro:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {mechanic.createdAt ? new Date(mechanic.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block mb-1">Última actualización:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {mechanic.updatedAt ? new Date(mechanic.updatedAt).toLocaleDateString('es-ES') : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Estado del perfil:</span>
                  <Badge className={mechanic.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                    {mechanic.isActive ? 'Perfil Activo' : 'Perfil Inactivo'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}