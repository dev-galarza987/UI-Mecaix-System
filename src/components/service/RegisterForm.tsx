import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { serviceService, type ServiceData } from '../../services/serviceService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  ArrowLeft, 
  DollarSign, 
  FileText, 
  Tag, 
  Save, 
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  code: z.number().int().positive(),
  title: z.string().min(2, { message: 'El título debe tener al menos 2 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  price: z.number().positive({ message: 'El precio debe ser mayor a 0.' }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function ServiceRegisterForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: 0,
      title: '',
      description: '',
      price: 0,
    },
  });

  async function onSubmit(values: FormSchema) {
    setIsSubmitting(true);
    try {
      const serviceData: ServiceData = values;
      await serviceService.createService(serviceData);
      setSubmitSuccess(true);
      
      // Show success for 2 seconds then navigate
      setTimeout(() => {
        navigate('/services/list');
      }, 2000);
    } catch (error) {
      console.error('Failed to create service', error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl"
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
          className="absolute bottom-1/4 -left-4 w-80 h-80 bg-violet-400/10 rounded-full mix-blend-multiply filter blur-xl"
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
            onClick={() => navigate('/services')}
            className="hover:bg-slate-50 dark:hover:bg-slate-800"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Regresar
          </Button>

          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Plus className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Nuevo Servicio
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Agrega un nuevo servicio al catálogo
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl text-slate-900 dark:text-white">
                  <Settings className="h-5 w-5" />
                  Información del Servicio
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Complete todos los campos para registrar el nuevo servicio
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Code Field */}
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                            <Tag className="h-4 w-4" />
                            Código del Servicio
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="Ej: 101"
                                className="pl-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                value={field.value || ''}
                              />
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-sm">#</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                            <FileText className="h-4 w-4" />
                            Título del Servicio
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Cambio de Aceite Completo"
                              className="border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description Field */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-900 dark:text-white font-medium">
                            Descripción Detallada
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe el servicio, incluye detalles importantes, duración aproximada, qué incluye..."
                              rows={4}
                              className="border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price Field */}
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                            <DollarSign className="h-4 w-4" />
                            Precio del Servicio
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-8 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                value={field.value || ''}
                              />
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-sm">$</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="pt-6 border-t border-slate-200 dark:border-slate-700"
                    >
                      {!submitSuccess ? (
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg py-6 text-lg font-medium"
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Creando Servicio...
                            </>
                          ) : (
                            <>
                              <Save className="h-5 w-5 mr-3" />
                              Crear Servicio
                            </>
                          )}
                        </Button>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full bg-green-600 text-white py-6 px-4 rounded-lg flex items-center justify-center text-lg font-medium"
                        >
                          <CheckCircle className="h-5 w-5 mr-3" />
                          ¡Servicio creado exitosamente!
                        </motion.div>
                      )}
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tips Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 dark:from-purple-500/5 dark:to-violet-500/5 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                  <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Consejos Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <p><strong>Código único:</strong> Asegúrate de usar un código que no exista previamente</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    <p><strong>Título claro:</strong> Usa un nombre descriptivo y fácil de entender</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <p><strong>Descripción completa:</strong> Incluye todos los detalles importantes del servicio</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <p><strong>Precio justo:</strong> Considera el valor del mercado y tus costos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-900 dark:text-white">
                  Vista Previa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                      #{form.watch('code') || '000'}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {form.watch('title') || 'Título del servicio'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-3">
                      {form.watch('description') || 'La descripción aparecerá aquí...'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Precio:</span>
                      <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
                        ${form.watch('price') ? Number(form.watch('price')).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
