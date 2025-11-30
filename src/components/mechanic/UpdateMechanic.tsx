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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Save,
  UserCog,
  Calendar,
  Clock,
  Star,
  Award,
  AlertCircle
} from 'lucide-react';
import { mechanicService, type MechanicData, type ExperienceLevel, type MechanicStatus, type Specialty, type WorkDay } from '../../services/mechanicService';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const formSchema = z.object({
  employeeCode: z.string().min(1, "El código de empleado es requerido"),
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  phone: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
  hireDate: z.string().min(1, "La fecha de contratación es requerida"),
  yearsExperience: z.number().min(0, "Los años de experiencia deben ser 0 o mayor").max(50, "Los años de experiencia no pueden ser más de 50"),
  experienceLevel: z.enum(['trainee', 'junior', 'senior', 'expert', 'master']),
  status: z.enum(['active', 'inactive', 'on_leave', 'terminated']),
  specialties: z.array(z.enum(['engine', 'transmission', 'brakes', 'suspension', 'electrical', 'air_conditioning', 'bodywork', 'painting', 'diagnostics', 'general'])).min(1, "Debe seleccionar al menos una especialidad"),
  hourlyRate: z.number().min(0, "La tarifa por hora debe ser mayor a 0"),
  workScheduleStart: z.string().min(1, "La hora de inicio es requerida"),
  workScheduleEnd: z.string().min(1, "La hora de fin es requerida"),
  workDays: z.array(z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])).min(1, "Debe seleccionar al menos un día de trabajo"),
});

const experienceLevels: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: 'trainee', label: 'Aprendiz', description: 'En entrenamiento, menos de 1 año' },
  { value: 'junior', label: 'Junior', description: '1-2 años de experiencia' },
  { value: 'senior', label: 'Senior', description: '3-5 años de experiencia' },
  { value: 'expert', label: 'Experto', description: '6-10 años de experiencia' },
  { value: 'master', label: 'Maestro', description: 'Más de 10 años de experiencia' },
];

const statusOptions: { value: MechanicStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Activo', color: 'text-green-600' },
  { value: 'inactive', label: 'Inactivo', color: 'text-red-600' },
  { value: 'on_leave', label: 'De Licencia', color: 'text-yellow-600' },
  { value: 'terminated', label: 'Terminado', color: 'text-gray-600' },
];

const specialties: { value: Specialty; label: string; icon: string }[] = [
  { value: 'engine', label: 'Motor', icon: '🔧' },
  { value: 'transmission', label: 'Transmisión', icon: '⚙️' },
  { value: 'brakes', label: 'Frenos', icon: '🛑' },
  { value: 'suspension', label: 'Suspensión', icon: '🚗' },
  { value: 'electrical', label: 'Eléctrico', icon: '⚡' },
  { value: 'air_conditioning', label: 'Aire Acondicionado', icon: '❄️' },
  { value: 'bodywork', label: 'Carrocería', icon: '🔨' },
  { value: 'painting', label: 'Pintura', icon: '🎨' },
  { value: 'diagnostics', label: 'Diagnósticos', icon: '🔍' },
  { value: 'general', label: 'General', icon: '🛠️' },
];

const workDays: { value: WorkDay; label: string }[] = [
  { value: 'Monday', label: 'Lunes' },
  { value: 'Tuesday', label: 'Martes' },
  { value: 'Wednesday', label: 'Miércoles' },
  { value: 'Thursday', label: 'Jueves' },
  { value: 'Friday', label: 'Viernes' },
  { value: 'Saturday', label: 'Sábado' },
  { value: 'Sunday', label: 'Domingo' },
];

export default function UpdateMechanic() {
  const navigate = useNavigate();
  const { employeeCode } = useParams<{ employeeCode: string }>();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingData, setLoadingData] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchMechanic = async () => {
      if (!employeeCode) {
        console.error('❌ [UPDATE MECHANIC] Código de empleado no proporcionado');
        toast.error('Código de mecánico no válido');
        navigate('/mechanics/list');
        return;
      }

      console.log('📝 [UPDATE MECHANIC] Cargando datos para mecánico:', employeeCode);

      try {
        setLoadingData(true);
        console.log('🔍 [UPDATE MECHANIC] Intentando cargar mecánico con código:', employeeCode);
        
        // Primero intentemos con getMechanicByCode (mismo que funciona en detalles)
        const mechanicData = await mechanicService.getMechanicByCode(employeeCode);
        
        console.log('✅ [UPDATE MECHANIC] Datos del mecánico cargados exitosamente:', mechanicData);

        if (mechanicData) {
          form.reset({
            employeeCode: mechanicData.employeeCode,
            firstName: mechanicData.firstName,
            lastName: mechanicData.lastName,
            phone: mechanicData.phone,
            hireDate: mechanicData.hireDate.split('T')[0], // Format date for input
            yearsExperience: mechanicData.yearsExperience,
            experienceLevel: mechanicData.experienceLevel,
            status: mechanicData.status,
            specialties: mechanicData.specialties,
            hourlyRate: mechanicData.hourlyRate,
            workScheduleStart: mechanicData.workScheduleStart,
            workScheduleEnd: mechanicData.workScheduleEnd,
            workDays: mechanicData.workDays,
          });
          console.log('✅ [UPDATE MECHANIC] Formulario configurado exitosamente');
        } else {
          console.error('❌ [UPDATE MECHANIC] Datos de mecánico incompletos');
          toast.error('Error al cargar los datos del mecánico');
        }
      } catch (error) {
        console.error('❌ [UPDATE MECHANIC] Error detallado al cargar datos:', error);
        console.error('❌ [UPDATE MECHANIC] Error type:', typeof error);
        console.error('❌ [UPDATE MECHANIC] Error message:', error instanceof Error ? error.message : 'Error desconocido');
        console.error('❌ [UPDATE MECHANIC] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        
        if (error instanceof Error) {
          toast.error(`Error al cargar los datos del mecánico: ${error.message}`);
        } else {
          toast.error('Error desconocido al cargar los datos del mecánico');
        }
        
        // No navegar inmediatamente, dar una oportunidad al usuario
        console.log('⏳ [UPDATE MECHANIC] Esperando 3 segundos antes de redirigir...');
        setTimeout(() => {
          navigate('/mechanics/list');
        }, 3000);
      } finally {
        setLoadingData(false);
      }
    };

    fetchMechanic();
  }, [employeeCode, form, navigate]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('🔥 [UPDATE MECHANIC] onSubmit INICIADO!');
    console.log('📝 [UPDATE MECHANIC] Valores del formulario:', values);
    console.log('🔑 [UPDATE MECHANIC] Código de empleado:', employeeCode);

    try {
      setLoading(true);

      const mechanicData: Partial<MechanicData> = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        hireDate: values.hireDate,
        yearsExperience: values.yearsExperience,
        experienceLevel: values.experienceLevel,
        status: values.status,
        specialties: values.specialties,
        hourlyRate: values.hourlyRate,
        workScheduleStart: values.workScheduleStart,
        workScheduleEnd: values.workScheduleEnd,
        workDays: values.workDays,
      };

      console.log('📦 [UPDATE MECHANIC] Datos preparados:', mechanicData);

      const result = await mechanicService.updateMechanic(employeeCode!, mechanicData);
      console.log('✅ [UPDATE MECHANIC] Mecánico actualizado:', result);

      // Verificar si fue una actualización parcial (solo status)
      if (result.message && result.message.includes('Solo se actualizó el status')) {
        toast.warning('⚠️ Actualización parcial: Solo se pudo actualizar el estado. El backend requiere revisión para actualizar otros campos.');
        // Redirigir después de un momento para que el usuario vea el mensaje
        setTimeout(() => navigate('/mechanics/list'), 2000);
      } else {
        toast.success('✅ Mecánico actualizado exitosamente');
        navigate('/mechanics/list');
      }
    } catch (error) {
      console.error('❌ [UPDATE MECHANIC] Error:', error);
      toast.error('Error al actualizar el mecánico: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  }

  if (isLoadingData) {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/20 dark:bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute top-32 right-10 w-96 h-96 bg-slate-300/20 dark:bg-slate-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
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
              onClick={() => navigate('/mechanics/list')} 
              className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la Lista
            </Button>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-700 dark:from-slate-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent mb-2">
              Editar Mecánico
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 flex items-center">
              <UserCog className="h-6 w-6 mr-2" />
              Actualizar información del mecánico {employeeCode}
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
                <CardTitle className="text-slate-700 dark:text-slate-300 flex items-center text-2xl">
                  <AlertCircle className="h-7 w-7 mr-3 text-blue-600 dark:text-blue-400" />
                  Modificar Información del Mecánico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Información Personal */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600 pb-2">
                        Información Personal
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="employeeCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Código de Empleado</FormLabel>
                              <FormControl>
                                <Input 
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
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Teléfono</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="+1234567890" 
                                  className="border-slate-200 dark:border-slate-600" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Nombre</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Juan" 
                                  className="border-slate-200 dark:border-slate-600" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Apellido</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Pérez" 
                                  className="border-slate-200 dark:border-slate-600" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Información Laboral */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600 pb-2 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Información Laboral
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="hireDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Fecha de Contratación</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  className="border-slate-200 dark:border-slate-600" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="yearsExperience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Años de Experiencia</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0"
                                  max="50"
                                  placeholder="5" 
                                  className="border-slate-200 dark:border-slate-600" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hourlyRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Tarifa por Hora ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0"
                                  step="0.01"
                                  placeholder="25.00" 
                                  className="border-slate-200 dark:border-slate-600" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="experienceLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center">
                                <Award className="h-4 w-4 mr-2" />
                                Nivel de Experiencia
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-slate-200 dark:border-slate-600">
                                    <SelectValue placeholder="Seleccionar nivel" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {experienceLevels.map(level => (
                                    <SelectItem key={level.value} value={level.value}>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{level.label}</span>
                                        <span className="text-xs text-slate-500">{level.description}</span>
                                      </div>
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
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Estado</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-slate-200 dark:border-slate-600">
                                    <SelectValue placeholder="Seleccionar estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {statusOptions.map(status => (
                                    <SelectItem key={status.value} value={status.value}>
                                      <span className={status.color}>{status.label}</span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Especialidades */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600 pb-2 flex items-center">
                        <Star className="h-5 w-5 mr-2" />
                        Especialidades
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="specialties"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                              Seleccionar especialidades (mínimo 1)
                            </FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                              {specialties.map((specialty) => (
                                <FormField
                                  key={specialty.value}
                                  control={form.control}
                                  name="specialties"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(specialty.value)}
                                          onCheckedChange={(checked) => {
                                            const currentSpecialties = field.value || [];
                                            if (checked) {
                                              field.onChange([...currentSpecialties, specialty.value]);
                                            } else {
                                              field.onChange(
                                                currentSpecialties.filter(s => s !== specialty.value)
                                              );
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        <span className="text-base mr-2">{specialty.icon}</span>
                                        {specialty.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Horario de Trabajo */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600 pb-2 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Horario de Trabajo
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="workScheduleStart"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Hora de Inicio</FormLabel>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  className="border-slate-200 dark:border-slate-600" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="workScheduleEnd"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Hora de Fin</FormLabel>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  className="border-slate-200 dark:border-slate-600" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="workDays"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                              Días de Trabajo (mínimo 1)
                            </FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                              {workDays.map((day) => (
                                <FormField
                                  key={day.value}
                                  control={form.control}
                                  name="workDays"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(day.value)}
                                          onCheckedChange={(checked) => {
                                            const currentDays = field.value || [];
                                            if (checked) {
                                              field.onChange([...currentDays, day.value]);
                                            } else {
                                              field.onChange(
                                                currentDays.filter(d => d !== day.value)
                                              );
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        {day.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-6"
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-slate-500 via-blue-500 to-indigo-600 hover:from-slate-600 hover:via-blue-600 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Spinner className="mr-2 h-4 w-4 animate-spin" />
                            Actualizando Mecánico...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Actualizar Mecánico
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