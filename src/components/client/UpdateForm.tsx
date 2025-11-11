import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { getClientById, updateClient, type Client } from '../../services/clientService';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Edit, 
  User, 
  Phone, 
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Save,
  UserCheck
} from 'lucide-react';

export default function UpdateForm() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const clientCode = Number(code);
  
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    phone: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [originalData, setOriginalData] = useState({
    name: '',
    lastname: '',
    phone: ''
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await getClientById(clientCode);
        const clientData = {
          name: client.nombre || '',
          lastname: client.apellido || '',
          phone: client.telefono || ''
        };
        setFormData(clientData);
        setOriginalData(clientData);
      } catch (error) {
        console.error('Failed to fetch client', error);
        setErrors({ fetch: 'Error al cargar los datos del cliente' });
      } finally {
        setLoading(false);
      }
    };
    
    if (clientCode) {
      fetchClient();
    }
  }, [clientCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.lastname.trim()) newErrors.lastname = 'El apellido es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    
    if (formData.phone && !/^\d{8,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Teléfono debe tener entre 8 y 15 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    return formData.name !== originalData.name ||
           formData.lastname !== originalData.lastname ||
           formData.phone !== originalData.phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!hasChanges()) {
      navigate('/clients/list');
      return;
    }
    
    setSaving(true);
    try {
      const clientData: Partial<Client> = {
        nombre: formData.name,
        apellido: formData.lastname,
        telefono: formData.phone
      };
      await updateClient(clientCode, clientData);
      
      // Success animation delay
      setTimeout(() => {
        navigate('/clients/list');
      }, 1000);
    } catch (error) {
      console.error('Failed to update client', error);
      setErrors({ submit: 'Error al actualizar el cliente. Inténtalo nuevamente.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Spinner className="w-12 h-12" />
          <p className="text-lg text-slate-600 dark:text-slate-400">Cargando datos del cliente...</p>
        </motion.div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          <p className="text-xl text-red-600 dark:text-red-400">{errors.fetch}</p>
          <Button onClick={() => navigate('/clients/list')} variant="outline">
            Volver a la Lista
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-4 -right-4 w-96 h-96 bg-orange-400/10 rounded-full mix-blend-multiply filter blur-xl"
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
          className="absolute bottom-1/4 -left-4 w-80 h-80 bg-amber-400/10 rounded-full mix-blend-multiply filter blur-xl"
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
            onClick={() => navigate('/clients/list')}
            className="hover:bg-orange-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la Lista
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-800 dark:from-orange-400 dark:via-amber-400 dark:to-orange-300 bg-clip-text text-transparent">
              Editar Cliente
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Cliente #{clientCode} - Actualiza la información
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
            <CardHeader className="text-center">
              <motion.div
                className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl mb-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                Actualizar Información
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Juan"
                        required
                        className={`pl-10 h-12 border-2 ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-white/50 dark:bg-slate-800/50 focus:border-orange-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                      />
                    </div>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm flex items-center gap-1"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {errors.name}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Lastname Field */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="lastname" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Apellido <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="lastname"
                        name="lastname"
                        type="text"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Ej: Pérez"
                        required
                        className={`pl-10 h-12 border-2 ${errors.lastname ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-white/50 dark:bg-slate-800/50 focus:border-orange-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                      />
                    </div>
                    {errors.lastname && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm flex items-center gap-1"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {errors.lastname}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Teléfono <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ej: +57 300 123 4567"
                      required
                      className={`pl-10 h-12 border-2 ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-white/50 dark:bg-slate-800/50 focus:border-orange-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                    />
                  </div>
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      {errors.phone}
                    </motion.p>
                  )}
                </motion.div>

                {/* Changes Indicator */}
                {hasChanges() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                      <Edit className="h-5 w-5" />
                      <span className="font-medium">Tienes cambios pendientes por guardar</span>
                    </div>
                  </motion.div>
                )}

                {/* Submit Error */}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-5 w-5" />
                      <span>{errors.submit}</span>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/clients/list')}
                    className="flex-1 h-14 text-lg transition-all duration-300"
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={saving || !hasChanges()}
                      className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Guardando...
                        </div>
                      ) : hasChanges() ? (
                        <div className="flex items-center gap-2">
                          <Save className="h-5 w-5" />
                          Guardar Cambios
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-5 w-5" />
                          Sin Cambios
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-2xl mx-auto mt-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-500/5 dark:to-amber-500/5 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    💡 Consejos para la edición
                  </h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Solo se guardaran los campos que hayas modificado</li>
                    <li>• Verifica que la información sea correcta antes de guardar</li>
                    <li>• Puedes cancelar en cualquier momento para descartar los cambios</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
