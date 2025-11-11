import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { serviceService, type Service } from '../../services/serviceService';
import { 
  ArrowLeft, 
  Edit, 
  DollarSign, 
  FileText, 
  Hash, 
  Calendar,
  Clock,
  Settings
} from 'lucide-react';

export default function ServiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const serviceId = Number(id);
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const serviceData = await serviceService.getServiceById(serviceId);
        setService(serviceData);
      } catch (error) {
        console.error('Failed to fetch service', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-100">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
            <div className="absolute top-32 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
            <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          </div>
          <div className="relative container mx-auto p-6 flex items-center justify-center min-h-screen">
            <motion.div 
              className="bg-white/70 backdrop-blur-xl rounded-3xl border border-purple-200/50 shadow-xl p-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center">
                <Spinner className="h-12 w-12 text-purple-500 mb-4" />
                <p className="text-lg text-purple-700 font-medium">Cargando detalles del servicio...</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Servicio no encontrado</h2>
          <Button onClick={() => navigate('/services/list')} variant="outline">
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  const getPriceTier = (price: number) => {
    if (price > 100) return { tier: 'Premium', color: 'emerald' };
    if (price > 50) return { tier: 'Estándar', color: 'blue' };
    return { tier: 'Básico', color: 'purple' };
  };

  const priceTier = getPriceTier(service.price);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-100">
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
          <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        </div>

        <div className="relative container mx-auto p-6 max-w-4xl">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/services/list')} 
              className="mb-6 bg-white/70 backdrop-blur-sm border-purple-200/50 hover:bg-purple-50/70 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center mb-2">
                <Settings className="h-8 w-8 text-purple-600 mr-3" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
                  Detalles del Servicio
                </h1>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate(`/services/update/${service.id}`)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Servicio
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Service Details */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/70 backdrop-blur-xl border-purple-200/50 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl text-purple-800 mb-2">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-purple-600/80 text-lg">
                      Información detallada del servicio
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-lg px-4 py-2 bg-${priceTier.color}-50 text-${priceTier.color}-700 border-${priceTier.color}-200`}
                  >
                    {priceTier.tier}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200/50">
                      <Hash className="h-6 w-6 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-purple-600/80 font-medium">Código del Servicio</p>
                        <p className="text-2xl font-bold text-purple-800">#{service.code}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg border border-indigo-200/50">
                      <DollarSign className="h-6 w-6 text-indigo-600 mr-3" />
                      <div>
                        <p className="text-sm text-indigo-600/80 font-medium">Precio</p>
                        <p className="text-2xl font-bold text-indigo-800">${service.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {service.createdAt && (
                      <div className="flex items-center p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200/50">
                        <Calendar className="h-6 w-6 text-violet-600 mr-3" />
                        <div>
                          <p className="text-sm text-violet-600/80 font-medium">Fecha de Creación</p>
                          <p className="text-lg font-semibold text-violet-800">
                            {new Date(service.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {service.updatedAt && (
                      <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                        <Clock className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm text-blue-600/80 font-medium">Última Actualización</p>
                          <p className="text-lg font-semibold text-blue-800">
                            {new Date(service.updatedAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-violet-50 rounded-xl border border-purple-200/50">
                  <div className="flex items-start">
                    <FileText className="h-6 w-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-purple-800 mb-3">Descripción del Servicio</h3>
                      <p className="text-purple-700/90 leading-relaxed text-base">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full max-w-md"
                  >
                    <Button
                      onClick={() => navigate(`/services/update/${service.id}`)}
                      className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg text-lg py-3"
                    >
                      <Edit className="h-5 w-5 mr-2" />
                      Editar este Servicio
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}