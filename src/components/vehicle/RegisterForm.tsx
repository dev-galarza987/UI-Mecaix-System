import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  vehicleService,
  type VehicleData,
} from "../../services/vehicleService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Car,
  CreditCard,
  Tag,
  Calendar,
  Plus,
  AlertTriangle,
  CheckCircle,
  Loader,
} from "lucide-react";

const formSchema = z.object({
  board: z
    .string()
    .min(3, { message: "La placa debe tener al menos 3 caracteres." })
    .max(10, { message: "La placa no puede tener más de 10 caracteres." })
    .regex(/^[A-Z0-9-]+$/, {
      message:
        "La placa solo puede contener letras mayúsculas, números y guiones.",
    }),
  brand: z
    .string()
    .min(2, { message: "La marca debe tener al menos 2 caracteres." })
    .max(50, { message: "La marca no puede tener más de 50 caracteres." }),
  model: z
    .string()
    .min(2, { message: "El modelo debe tener al menos 2 caracteres." })
    .max(50, { message: "El modelo no puede tener más de 50 caracteres." }),
  year: z
    .number()
    .int({ message: "El año debe ser un número entero." })
    .min(1900, { message: "El año debe ser mayor a 1900." })
    .max(new Date().getFullYear() + 1, {
      message: "El año no puede ser mayor al próximo año.",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function VehicleRegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      board: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setIsLoading(true);
      setSubmitError("");

      const vehicleData: VehicleData = {
        ...values,
        board: values.board.toUpperCase(),
      };

      await vehicleService.createVehicle(vehicleData);

      // Success animation delay
      setTimeout(() => {
        navigate("/vehicles/list");
      }, 1000);
    } catch (error) {
      console.error("Failed to create vehicle", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al crear el vehículo. Inténtalo nuevamente.";
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleBoardInput = (value: string) => {
    // Auto-format plate to uppercase
    return value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  };

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
            ease: "linear",
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
            ease: "linear",
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
            onClick={() => navigate("/vehicles")}
            className="hover:bg-cyan-50 dark:hover:bg-slate-800"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Menú Principal
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 dark:from-cyan-400 dark:via-blue-400 dark:to-teal-400 bg-clip-text text-transparent">
              Nuevo Vehículo
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Registra un nuevo vehículo en el sistema
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
                className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl mb-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Car className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                Información del Vehículo
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Board Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="board"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Placa del Vehículo{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                  placeholder="Ej: ABC-123"
                                  {...field}
                                  onChange={(e) => {
                                    const formatted = handleBoardInput(
                                      e.target.value
                                    );
                                    field.onChange(formatted);
                                  }}
                                  className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-cyan-500 transition-all duration-300 font-mono text-lg font-bold text-cyan-600 dark:text-cyan-400 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {/* Brand Field */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Marca <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                  placeholder="Ej: Toyota"
                                  {...field}
                                  className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-cyan-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Model Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Modelo <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                  placeholder="Ej: Corolla"
                                  {...field}
                                  className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-cyan-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {/* Year Field */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Año <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                  type="number"
                                  placeholder="2024"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) ||
                                        new Date().getFullYear()
                                    )
                                  }
                                  className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:border-cyan-500 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  {/* Submit Error */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                        <span>{submitError}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col md:flex-row gap-4"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/vehicles")}
                      className="flex-1 h-14 text-lg transition-all duration-300"
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>

                    <motion.div
                      className="flex-1"
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Loader className="w-5 h-5" />
                            </motion.div>
                            Registrando...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Registrar Vehículo
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-2xl mx-auto mt-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-500/5 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    💡 Consejos para el registro
                  </h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>
                      • La placa se convertirá automáticamente a mayúsculas
                    </li>
                    <li>
                      • Asegúrate de ingresar el año correcto del vehículo
                    </li>
                    <li>
                      • Todos los campos son obligatorios para completar el
                      registro
                    </li>
                    <li>• Verifica la información antes de guardar</li>
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
