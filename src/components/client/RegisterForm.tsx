import React, { useState } from "react";
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
import { createClient, type Client } from "../../services/clientService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserPlus,
  User,
  Phone,
  Hash,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Save,
  Mail,
  Lock,
  MapPin,
  CreditCard,
} from "lucide-react";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    lastname: "",
    phone: "",
    ci: "",
    email: "",
    password: "",
    address: "",
    gender: "masculino",
    preferredContactMethod: "telefono",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    if (!formData.code.trim()) newErrors.code = "El código es requerido";
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.lastname.trim())
      newErrors.lastname = "El apellido es requerido";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
    if (!formData.ci.trim()) newErrors.ci = "El CI es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.password.trim())
      newErrors.password = "La contraseña es requerida";
    if (!formData.address.trim())
      newErrors.address = "La dirección es requerida";

    if (
      formData.phone &&
      !/^\d{8,15}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Teléfono debe tener entre 8 y 15 dígitos";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const clientData: Client = {
        code: Number(formData.code),
        nombre: formData.name,
        apellido: formData.lastname,
        telefono: formData.phone,
        ci: formData.ci,
        email: formData.email,
        password: formData.password,
        direccion: formData.address,
        genero: formData.gender as "masculino" | "femenino" | "otro",
        metodoPrefContacto: formData.preferredContactMethod as
          | "telefono"
          | "email"
          | "ambos",
        estado: "activo",
      };

      await createClient(clientData);

      setTimeout(() => {
        navigate("/clients/list");
      }, 1000);
    } catch (error) {
      console.error("Failed to create client", error);
      setErrors({
        submit:
          "Error al crear el cliente. Verifica que el código o email no existan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="relative container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate("/clients/list")}
            className="hover:bg-green-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 dark:from-green-400 dark:via-emerald-400 dark:to-green-300 bg-clip-text text-transparent">
              Registrar Nuevo Cliente
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Completa la información completa del cliente
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
                className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl mb-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                Información del Cliente
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Code Field */}
                  <div className="space-y-2">
                    <Label htmlFor="code">
                      Código Cliente <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Ej: 1001"
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.code && (
                      <p className="text-red-500 text-sm">{errors.code}</p>
                    )}
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
                        placeholder="Ej: 12345678"
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
                    <Label htmlFor="name">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Juan"
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  {/* Lastname Field */}
                  <div className="space-y-2">
                    <Label htmlFor="lastname">
                      Apellido <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Ej: Pérez"
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.lastname && (
                      <p className="text-red-500 text-sm">{errors.lastname}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Teléfono <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ej: 70123456"
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
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
                        placeholder="Ej: juan@email.com"
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Contraseña <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Dirección <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Ej: Av. Principal 123"
                        required
                        className="pl-10"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address}</p>
                    )}
                  </div>

                  {/* Gender Field */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleSelectChange("gender", value)
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
                    <Label htmlFor="preferredContactMethod">
                      Preferencia de Contacto
                    </Label>
                    <Select
                      value={formData.preferredContactMethod}
                      onValueChange={(value) =>
                        handleSelectChange("preferredContactMethod", value)
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
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg shadow-xl"
                >
                  {loading ? "Guardando..." : "Registrar Cliente"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
