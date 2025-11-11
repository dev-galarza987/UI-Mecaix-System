import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService, type Vehicle } from '../../services/vehicleService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Car, 
  Edit, 
  Trash2, 
  Grid3X3, 
  Table as TableIcon,
  Plus,
  Calendar,
  Tag,
  AlertTriangle,
  Filter,
  SortAsc
} from 'lucide-react';

type ViewMode = 'cards' | 'table';
type SortOption = 'board' | 'brand' | 'year' | 'model';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [sortBy, setSortBy] = useState<SortOption>('board');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await vehicleService.getAllVehicles();
        setVehicles(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los vehículos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Filter and sort vehicles
  useEffect(() => {
    let filtered = vehicles.filter(vehicle => 
      vehicle.board.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.year.toString().includes(searchTerm)
    );

    if (brandFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.brand === brandFilter);
    }

    // Sort vehicles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'board':
          return a.board.localeCompare(b.board);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'model':
          return a.model.localeCompare(b.model);
        case 'year':
          return b.year - a.year;
        default:
          return 0;
      }
    });

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, brandFilter, sortBy]);

  const handleDeleteClick = (id: number) => {
    setVehicleToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (vehicleToDelete !== null) {
      try {
        await vehicleService.deleteVehicle(vehicleToDelete);
        setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete));
      } catch (err) {
        setError('Error al eliminar el vehículo.');
        console.error(err);
      }
    }
    setShowDeleteAlert(false);
    setVehicleToDelete(null);
  };

  // Get unique brands for filter
  const uniqueBrands = Array.from(new Set(vehicles.map(v => v.brand))).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Spinner className="w-12 h-12" />
          <p className="text-lg text-slate-600 dark:text-slate-400">Cargando vehículos...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Intentar de nuevo
          </Button>
        </motion.div>
      </div>
    );
  }

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
      </div>

      <div className="relative container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button 
            variant="outline" 
            onClick={() => navigate('/vehicles')}
            className="hover:bg-cyan-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Menú Principal
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 dark:from-cyan-400 dark:via-blue-400 dark:to-teal-400 bg-clip-text text-transparent">
              Lista de Vehículos
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {filteredVehicles.length} de {vehicles.length} vehículos
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Buscar por placa, marca, modelo o año..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-cyan-500 transition-all duration-300"
                  />
                </div>

                {/* Brand Filter */}
                <div className="relative">
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrar por marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las marcas</SelectItem>
                      {uniqueBrands.map((brand) => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="relative">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                      <SortAsc className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="board">Placa</SelectItem>
                      <SelectItem value="brand">Marca</SelectItem>
                      <SelectItem value="model">Modelo</SelectItem>
                      <SelectItem value="year">Año (más reciente)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode & Add Button */}
                <div className="flex gap-2">
                  <div className="flex border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/50">
                    <Button
                      variant={viewMode === 'cards' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('cards')}
                      className={`h-10 ${viewMode === 'cards' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                      className={`h-10 ${viewMode === 'table' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}`}
                    >
                      <TableIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={() => navigate('/vehicles/new')}
                    className="h-12 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium shadow-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'cards' ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                            <Car className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                              {vehicle.board}
                            </CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {vehicle.year}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-slate-500" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{vehicle.brand}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-600 dark:text-slate-400">{vehicle.model}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-600 dark:text-slate-400">{vehicle.year}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/vehicles/update/${vehicle.id}`)}
                          className="flex-1 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:border-cyan-300 transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(vehicle.id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 dark:border-slate-700">
                      <TableHead className="font-bold text-slate-700 dark:text-slate-300">Placa</TableHead>
                      <TableHead className="font-bold text-slate-700 dark:text-slate-300">Marca</TableHead>
                      <TableHead className="font-bold text-slate-700 dark:text-slate-300">Modelo</TableHead>
                      <TableHead className="font-bold text-slate-700 dark:text-slate-300">Año</TableHead>
                      <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle, index) => (
                      <motion.tr
                        key={vehicle.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-slate-200 dark:border-slate-700 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 transition-colors"
                      >
                        <TableCell className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                          {vehicle.board}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                          {vehicle.brand}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400">
                          {vehicle.model}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {vehicle.year}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/vehicles/update/${vehicle.id}`)}
                              className="hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(vehicle.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredVehicles.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Car className="h-24 w-24 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">
              {searchTerm || brandFilter !== 'all' ? 'No se encontraron vehículos' : 'No hay vehículos registrados'}
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6">
              {searchTerm || brandFilter !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'Comienza agregando tu primer vehículo al sistema'
              }
            </p>
            {(!searchTerm && brandFilter === 'all') && (
              <Button onClick={() => navigate('/vehicles/new')} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Vehículo
              </Button>
            )}
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent className="max-w-md mx-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-0 shadow-2xl">
            <AlertDialogHeader className="space-y-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
              >
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </motion.div>
              <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                ¿Eliminar Vehículo?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Esta acción no se puede deshacer. El vehículo será eliminado permanentemente del sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-3 pt-6">
              <AlertDialogCancel className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-700">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
