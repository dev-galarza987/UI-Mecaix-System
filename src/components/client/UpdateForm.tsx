import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  getClientById,
  updateClient,
  type Client,
} from "../../services/clientService";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Edit,
  User,
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Save,
  UserCheck,
  Mail,
  MapPin,
  CreditCard,
  Hash,
} from "lucide-react";

export default function UpdateForm() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const clientCode = Number(code);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    ci: "",
    direccion: "",
    genero: "masculino" as "masculino" | "femenino" | "otro",
    metodoPrefContacto: "telefono" as "telefono" | "email" | "ambos",
    estado: "activo" as "activo" | "inactivo",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [originalData, setOriginalData] = useState<any>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await getClientById(clientCode);
        const clientData = {
          nombre: client.nombre || "",
          apellido: client.apellido || "",
          telefono: client.telefono || "",
          email: client.email || "",
          ci: client.ci || "",
          direccion: client.direccion || "",
          genero: client.genero || "masculino",
          metodoPrefContacto: client.metodoPrefContacto || "telefono",
          estado: client.estado || "activo",
        };
        setFormData(clientData);
        setOriginalData(clientData);
      } catch (error) {
        console.error("Failed to fetch client", error);
        setErrors({ fetch: "Error al cargar los datos del cliente" });
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido.trim())
      newErrors.apellido = "El apellido es requerido";
    if (!formData.telefono.trim())
      newErrors.telefono = "El teléfono es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.ci.trim()) newErrors.ci = "El CI es requerido";
    if (!formData.direccion.trim())
      newErrors.direccion = "La dirección es requerida";

    if (
      formData.telefono &&
      !/^\d{8,15}$/.test(formData.telefono.replace(/\D/g, ""))
    ) {
      newErrors.telefono = "Teléfono debe tener entre 8 y 15 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!hasChanges()) {
      navigate("/clients/list");
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      const clientData: Partial<Client> = {
        ...formData,
      };

      await updateClient(clientCode, clientData);

      setTimeout(() => {
        navigate("/clients/list");
      }, 1000);
    } catch (error) {
      console.error("Error updating client:", error);
      setErrors({
        submit: "Error al actualizar el cliente. Inténtalo nuevamente.",
      });
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
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Cargando datos del cliente...
          </p>
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
          <p className="text-xl text-red-600 dark:text-red-400">
            {errors.fetch}
          </p>
          <Button onClick={() => navigate("/clients/list")} variant="outline">
            Volver a la Lista
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="relative container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate("/clients/list")}
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
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
                  {/* Code (Read Only) */}
                  <div className="space-y-2">
                    <Label>Código Cliente</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        value={clientCode}
                        disabled
                        className="pl-10 bg-slate-100 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* CI Field */}
                  <div className="space-y-2">
                    <Label htmlFor="ci">
                      CI / Documento <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="ci"
                        name="ci"
                        value={formData.ci}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.ci && (
                      <p className="text-red-500 text-sm">{errors.ci}</p>
                    )}
                  </div>

                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.nombre && (
                      <p className="text-red-500 text-sm">{errors.nombre}</p>
                    )}
                  </div>

                  {/* Lastname Field */}
                  <div className="space-y-2">
                    <Label htmlFor="apellido">
                      Apellido <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.apellido && (
                      <p className="text-red-500 text-sm">{errors.apellido}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="telefono">
                      Teléfono <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.telefono && (
                      <p className="text-red-500 text-sm">{errors.telefono}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label htmlFor="direccion">
                      Dirección <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.direccion && (
                      <p className="text-red-500 text-sm">{errors.direccion}</p>
                    )}
                  </div>

                  {/* Gender Field */}
                  <div className="space-y-2">
                    <Label htmlFor="genero">Género</Label>
                    <Select
                      value={formData.genero}
                      onValueChange={(value) =>
                        handleSelectChange("genero", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contact Method Field */}
                  <div className="space-y-2">
                    <Label htmlFor="metodoPrefContacto">
                      Preferencia de Contacto
                    </Label>
                    <Select
                      value={formData.metodoPrefContacto}
                      onValueChange={(value) =>
                        handleSelectChange("metodoPrefContacto", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telefono">Teléfono</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="ambos">Ambos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Field */}
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) =>
                        handleSelectChange("estado", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/clients/list")}
                    className="flex-1 h-14 text-lg"
                    disabled={saving}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    disabled={saving || !hasChanges()}
                    className="flex-1 h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold text-lg shadow-xl"
                  >
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
