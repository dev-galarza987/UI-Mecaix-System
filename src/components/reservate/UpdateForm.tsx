import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Check, 
  ChevronsUpDown, 
  ArrowLeft, 
  Save,
  AlertCircle
} from 'lucide-react';
import { reservateService, type ReservateData } from '../../services/reservateService';
import { getAllClients, type Client } from '../../services/clientService';
import { serviceService, type Service } from '../../services/serviceService';
import { useNavigate, useParams } from 'react-router-dom';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  reservationDate: z.date(),
  state: z.string().min(1, "El estado es requerido"),
  clientId: z.number(),
  serviceIds: z.array(z.number()).min(1, { message: 'Debe seleccionar al menos un servicio.' }),
  totalPrice: z.string().optional(),
  notes: z.string().optional(),
});

export default function ReservateUpdateForm() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  // code ya es string, no necesitamos convertirlo

  const [isLoading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!code) {
        toast.error('Código de reserva no válido');
        navigate('/reservates/list');
        return;
      }

      console.log('📝 [UPDATE FORM] Iniciando carga de datos para reserva:', code);

      try {
        const [clientsData, servicesData, reservateData] = await Promise.all([
          getAllClients(),
          serviceService.getAllServices(),
          reservateService.getReservate(code)
        ]);
        
        console.log('✅ [UPDATE FORM] Datos cargados:', {
          clients: clientsData.length,
          services: servicesData.length,
          reservate: reservateData
        });

        setClients(clientsData);
        setServices(servicesData);

        if (reservateData && reservateData.client && reservateData.services) {
          form.reset({
            code: reservateData.code,
            reservationDate: new Date(reservateData.reservationDate),
            state: reservateData.state,
            clientId: reservateData.client.id,
            serviceIds: reservateData.services.map((s: Service) => s.id),
            totalPrice: reservateData.totalPrice.toString(),
            notes: '',
          });
          setSelectedServices(reservateData.services);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar los datos');
      }
    };

    fetchData();
  }, [code, form, navigate]);

  // Calculate total price when services change
  useEffect(() => {
    const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
    form.setValue('totalPrice', total.toString());
  }, [selectedServices, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('🔥 [UPDATE FORM] onSubmit INICIADO!');
    console.log('📝 [UPDATE FORM] Valores del formulario:', values);
    console.log('🔑 [UPDATE FORM] Código de reserva (URL param):', code);
    console.log('👥 [UPDATE FORM] Clientes disponibles:', clients.length);
    console.log('🛠️ [UPDATE FORM] Servicios seleccionados:', selectedServices);

    try {
      setLoading(true);
      console.log('⏳ [UPDATE FORM] Estado de loading activado');
      
      const client = clients.find(c => c.id === values.clientId);
      console.log('🔍 [UPDATE FORM] Cliente encontrado:', client);
      
      if (!client) {
        console.error('❌ [UPDATE FORM] Cliente no encontrado para ID:', values.clientId);
        toast.error('Cliente no encontrado');
        return;
      }

      const reservateData: Partial<ReservateData> = {
        code: values.code,
        reservationDate: values.reservationDate.toISOString(),
        state: values.state as "pending" | "confirmed" | "in_progress" | "completed" | "cancelled",
        clientId: values.clientId,
        serviceIds: values.serviceIds,
        totalPrice: parseFloat(values.totalPrice || '0'),
      };

      console.log('📦 [UPDATE FORM] Datos preparados para enviar:', reservateData);
      console.log('🌐 [UPDATE FORM] Llamando a reservateService.updateReservate...');
      
      const result = await reservateService.updateReservate(code!, reservateData);
      console.log('✅ [UPDATE FORM] Respuesta del servidor:', result);
      
      toast.success('Reservación actualizada exitosamente');
      navigate('/reservates/list');
    } catch (error) {
      console.error('❌ [UPDATE FORM] Error completo:', error);
      console.error('❌ [UPDATE FORM] Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('❌ [UPDATE FORM] Error stack:', error instanceof Error ? error.stack : 'No stack');
      toast.error('Error al actualizar la reserva: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setLoading(false);
      console.log('✅ [UPDATE FORM] Estado de loading desactivado');
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300/20 dark:bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-teal-300/20 dark:bg-teal-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-green-300/20 dark:bg-green-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
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
              onClick={() => navigate('/reservates/list')} 
              className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 dark:from-emerald-400 dark:via-teal-400 dark:to-green-300 bg-clip-text text-transparent mb-2">
              Editar Reservación
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Modifique los datos de la reservación
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-emerald-700 dark:text-emerald-300 flex items-center text-xl">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  Modificar Información de la Reserva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Código</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1001" 
                              disabled 
                              className="bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reservationDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Fecha de reservación</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Seleccionar una fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Estado</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">
                                <SelectValue placeholder="Seleccionar un estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="confirmed">Confirmada</SelectItem>
                              <SelectItem value="in_progress">En Progreso</SelectItem>
                              <SelectItem value="completed">Completada</SelectItem>
                              <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Cliente</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">
                                <SelectValue placeholder="Seleccionar un cliente" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map(client => (
                                <SelectItem key={client.id} value={client.id?.toString() || ''}>
                                  {client.nombre} {client.apellido}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Servicios</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700",
                                    !field.value?.length && "text-muted-foreground"
                                  )}
                                >
                                  {selectedServices.length
                                    ? selectedServices.map(s => s.title).join(', ')
                                    : "Seleccionar servicios"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Buscar servicios..." />
                                <CommandEmpty>No se encontraron servicios.</CommandEmpty>
                                <CommandGroup>
                                  {services.map((service) => (
                                    <CommandItem
                                      key={service.id}
                                      onSelect={() => {
                                        const isSelected = selectedServices.some(s => s.id === service.id);
                                        const newSelected = isSelected
                                          ? selectedServices.filter(s => s.id !== service.id)
                                          : [...selectedServices, service];
                                        setSelectedServices(newSelected);
                                        field.onChange(newSelected.map(s => s.id));
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedServices.some(s => s.id === service.id) ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {service.title}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="totalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Precio Total</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="border-gray-200 dark:border-slate-600" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Notas</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Notas adicionales..." 
                                className="border-gray-200 dark:border-slate-600" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Spinner className="mr-2 h-4 w-4 animate-spin" />
                            Actualizando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Actualizar Reservación
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}