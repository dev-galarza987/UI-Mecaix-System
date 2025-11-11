import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { serviceService, type ServiceData } from '../../services/serviceService';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Settings, Eye, DollarSign, FileText } from 'lucide-react';

const formSchema = z.object({
  code: z.string(),
  title: z.string().min(2, { message: 'El título debe tener al menos 2 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'El precio debe ser un número positivo.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ServiceUpdateForm() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const serviceCode = Number(code);
  const [isLoading, setIsLoading] = useState(true);
  const [originalService, setOriginalService] = useState<ServiceData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      title: '',
      description: '',
      price: '',
    },
  });

  const watchedFields = form.watch();

  useEffect(() => {
    if (originalService) {
      const formValues = {
        code: String(originalService.code || ''),
        title: originalService.title || '',
        description: originalService.description || '',
        price: String(originalService.price || ''),
      };
      
      const changed = 
        formValues.title !== watchedFields.title ||
        formValues.description !== watchedFields.description ||
        formValues.price !== watchedFields.price;
      
      setHasChanges(changed);
    }
  }, [watchedFields, originalService]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const service = await serviceService.getServiceById(serviceCode);
        setOriginalService(service);
        form.reset({
          code: String(service.code),
          title: service.title,
          description: service.description,
          price: String(service.price),
        });
      } catch (error) {
        console.error('Failed to fetch service', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (serviceCode) {
      fetchService();
    }
  }, [serviceCode, form]);

  async function onSubmit(values: FormValues) {
    try {
      const serviceData: Partial<ServiceData> = {
        code: parseInt(values.code),
        title: values.title,
        description: values.description,
        price: parseFloat(values.price),
      };
      await serviceService.updateService(serviceCode, serviceData);
      navigate('/services/list');
    } catch (error) {
      console.error('Failed to update service', error);
    }
  }

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
                <p className="text-lg text-purple-700 font-medium">Cargando servicio...</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-100">
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
          <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        </div>

        <div className="relative container mx-auto p-6 max-w-7xl">
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
              Regresar a la lista de servicios
            </Button>
            
            <div className="flex items-center mb-2">
              <Settings className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
                Editar Servicio
              </h1>
            </div>
            <p className="text-purple-600/80 text-lg">
              Actualiza los detalles del servicio seleccionado
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Card */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/70 backdrop-blur-xl border-purple-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-700 flex items-center">
                    <FileText className="h-6 w-6 mr-2" />
                    Información del Servicio
                  </CardTitle>
                  <CardDescription className="text-purple-600/70">
                    Modifica los campos necesarios para actualizar el servicio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-700 font-medium">Código</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="101" 
                                {...field} 
                                disabled 
                                className="bg-purple-50/50 border-purple-200 focus:border-purple-400 transition-colors disabled:opacity-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-700 font-medium">Título</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Cambio de Aceite" 
                                {...field} 
                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-700 font-medium">Descripción</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descripción detallada del servicio..." 
                                {...field} 
                                rows={4}
                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 transition-all resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-700 font-medium">Precio</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="50.00" 
                                {...field} 
                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg transition-all duration-300"
                          disabled={!hasChanges}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Actualizar Servicio
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preview Card */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/70 backdrop-blur-xl border-purple-200/50 shadow-xl sticky top-6">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-700 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Vista Previa
                  </CardTitle>
                  <CardDescription className="text-purple-600/70">
                    Previsualiza cómo se verá el servicio actualizado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                        #{watchedFields.code || originalService?.code}
                      </Badge>
                      {hasChanges && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Modificado
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-purple-800 text-lg mb-2 line-clamp-2">
                      {watchedFields.title || 'Sin título'}
                    </h3>
                    
                    <p className="text-purple-600/80 text-sm mb-3 line-clamp-3">
                      {watchedFields.description || 'Sin descripción'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-purple-700">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="font-semibold text-lg">
                          ${Number(watchedFields.price || 0).toFixed(2)}
                        </span>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={`${
                          Number(watchedFields.price || 0) > 100 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : Number(watchedFields.price || 0) > 50 
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {Number(watchedFields.price || 0) > 100 ? 'Premium' : 
                         Number(watchedFields.price || 0) > 50 ? 'Estándar' : 'Básico'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-xs text-purple-600/60 bg-purple-50/50 p-3 rounded-lg">
                    💡 Los cambios se aplicarán automáticamente después de guardar
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
