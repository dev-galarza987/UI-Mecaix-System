import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Search, 
  Plus,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Users,
  Star,
  Phone,
  Clock,
  Award,
  MoreHorizontal,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mechanicService, type Mechanic } from '../../services/mechanicService';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'inactive': return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'on_leave': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'terminated': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Activo';
    case 'inactive': return 'Inactivo';
    case 'on_leave': return 'De Licencia';
    case 'terminated': return 'Terminado';
    default: return status;
  }
};

const getExperienceLevelColor = (level: string) => {
  switch (level) {
    case 'trainee': return 'bg-blue-100 text-blue-800';
    case 'junior': return 'bg-green-100 text-green-800';
    case 'senior': return 'bg-purple-100 text-purple-800';
    case 'expert': return 'bg-orange-100 text-orange-800';
    case 'master': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getExperienceLevelLabel = (level: string) => {
  switch (level) {
    case 'trainee': return 'Aprendiz';
    case 'junior': return 'Junior';
    case 'senior': return 'Senior';
    case 'expert': return 'Experto';
    case 'master': return 'Maestro';
    default: return level;
  }
};

export default function ListAllMechanics() {
  const navigate = useNavigate();
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [filteredMechanics, setFilteredMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMechanics = async () => {
    try {
      setLoading(true);
      const response = await mechanicService.getAllMechanics(currentPage, 10);
      setMechanics(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching mechanics:', error);
      toast.error('Error al cargar los mecánicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    // Filter mechanics based on search term
    const filtered = mechanics.filter(mechanic =>
      mechanic.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.experienceLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mechanic.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredMechanics(filtered);
  }, [searchTerm, mechanics]);

  const handleDelete = async (employeeCode: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este mecánico?')) {
      try {
        await mechanicService.deleteMechanic(employeeCode);
        toast.success('Mecánico eliminado exitosamente');
        fetchMechanics();
      } catch (error) {
        console.error('Error deleting mechanic:', error);
        toast.error('Error al eliminar el mecánico. Puede que tenga servicios asignados.');
      }
    }
  };

  const handleStatusUpdate = async (employeeCode: string, newStatus: 'active' | 'inactive' | 'on_leave' | 'terminated') => {
    try {
      await mechanicService.updateMechanicStatus(employeeCode, newStatus);
      toast.success('Estado actualizado exitosamente');
      fetchMechanics();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar el estado del mecánico');
    }
  };

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
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/mechanics')} 
              className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-700 dark:from-slate-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent mb-2">
                  Lista de Mecánicos
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {filteredMechanics.length} mecánico(s) encontrado(s)
                </p>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate('/mechanics/create')}
                  className="bg-gradient-to-r from-slate-500 via-blue-500 to-indigo-600 hover:from-slate-600 hover:via-blue-600 hover:to-indigo-700 text-white shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Mecánico
                </Button>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <motion.div 
              className="flex flex-col md:flex-row gap-4 mb-6"
              variants={itemVariants}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, código, teléfono, nivel o especialidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-lg"
                />
              </div>
              <Button
                variant="outline"
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </motion.div>
          </motion.div>

          {/* Mechanics Table */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-700 dark:text-slate-200 flex items-center">
                  <User className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                  Mecánicos Registrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredMechanics.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      No se encontraron mecánicos
                    </h3>
                    <p className="text-slate-500 dark:text-slate-500 mb-4">
                      {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer mecánico'}
                    </p>
                    {!searchTerm && (
                      <Button
                        onClick={() => navigate('/mechanics/create')}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Mecánico
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold">Mecánico</TableHead>
                          <TableHead className="font-semibold">Código</TableHead>
                          <TableHead className="font-semibold">Contacto</TableHead>
                          <TableHead className="font-semibold">Experiencia</TableHead>
                          <TableHead className="font-semibold">Especialidades</TableHead>
                          <TableHead className="font-semibold">Estado</TableHead>
                          <TableHead className="font-semibold">Horario</TableHead>
                          <TableHead className="font-semibold text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMechanics.map((mechanic) => (
                          <TableRow key={mechanic.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {mechanic.firstName[0]}{mechanic.lastName[0]}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {mechanic.firstName} {mechanic.lastName}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {mechanic.yearsExperience} años de experiencia
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm font-mono">
                                {mechanic.employeeCode}
                              </code>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                <Phone className="h-3 w-3 mr-1" />
                                {mechanic.phone}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getExperienceLevelColor(mechanic.experienceLevel)}>
                                <Award className="h-3 w-3 mr-1" />
                                {getExperienceLevelLabel(mechanic.experienceLevel)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {mechanic.specialties.slice(0, 2).map((specialty, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    {specialty}
                                  </Badge>
                                ))}
                                {mechanic.specialties.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{mechanic.specialties.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(mechanic.status)}>
                                {getStatusLabel(mechanic.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                <Clock className="h-3 w-3 mr-1" />
                                {mechanic.workScheduleStart} - {mechanic.workScheduleEnd}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/mechanics/${mechanic.employeeCode}/view`)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/mechanics/${mechanic.employeeCode}/edit`)}
                                    className="cursor-pointer"
                                  >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  
                                  {/* Status Update Options */}
                                  {mechanic.status !== 'active' && (
                                    <DropdownMenuItem
                                      onClick={() => handleStatusUpdate(mechanic.employeeCode, 'active')}
                                      className="cursor-pointer text-green-600"
                                    >
                                      <Star className="h-4 w-4 mr-2" />
                                      Activar
                                    </DropdownMenuItem>
                                  )}
                                  {mechanic.status !== 'inactive' && (
                                    <DropdownMenuItem
                                      onClick={() => handleStatusUpdate(mechanic.employeeCode, 'inactive')}
                                      className="cursor-pointer text-yellow-600"
                                    >
                                      <Clock className="h-4 w-4 mr-2" />
                                      Desactivar
                                    </DropdownMenuItem>
                                  )}
                                  
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(mechanic.employeeCode)}
                                    className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-6">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Anterior
                    </Button>
                    
                    <span className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400">
                      Página {currentPage} de {totalPages}
                    </span>
                    
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Siguiente
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