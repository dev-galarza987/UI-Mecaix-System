import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCog } from "lucide-react";
import {
  mechanicService,
  type MechanicData,
} from "../../services/mechanicService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { MechanicForm, type MechanicFormValues } from "./MechanicForm";

export default function UpdateMechanic() {
  const navigate = useNavigate();
  const { employeeCode } = useParams<{ employeeCode: string }>();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingData, setLoadingData] = useState(true);
  const [initialValues, setInitialValues] = useState<
    Partial<MechanicFormValues>
  >({});

  useEffect(() => {
    const fetchMechanic = async () => {
      if (!employeeCode) {
        console.error(
          "❌ [UPDATE MECHANIC] Código de empleado no proporcionado"
        );
        toast.error("Código de mecánico no válido");
        navigate("/mechanics/list");
        return;
      }

      console.log(
        "📝 [UPDATE MECHANIC] Cargando datos para mecánico:",
        employeeCode
      );

      try {
        setLoadingData(true);
        console.log(
          "🔍 [UPDATE MECHANIC] Intentando cargar mecánico con código:",
          employeeCode
        );

        const mechanicData = await mechanicService.getMechanicByCode(
          employeeCode
        );

        console.log(
          "✅ [UPDATE MECHANIC] Datos del mecánico cargados exitosamente:",
          mechanicData
        );

        if (mechanicData) {
          setInitialValues({
            employeeCode: mechanicData.employeeCode,
            firstName: mechanicData.firstName,
            lastName: mechanicData.lastName,
            phone: mechanicData.phone,
            hireDate: mechanicData.hireDate.split("T")[0], // Format date for input
            yearsExperience: mechanicData.yearsExperience,
            experienceLevel: mechanicData.experienceLevel,
            status: mechanicData.status,
            specialties: mechanicData.specialties,
            hourlyRate: mechanicData.hourlyRate,
            workScheduleStart: mechanicData.workScheduleStart,
            workScheduleEnd: mechanicData.workScheduleEnd,
            workDays: mechanicData.workDays,
          });
          console.log(
            "✅ [UPDATE MECHANIC] Formulario configurado exitosamente"
          );
        } else {
          console.error("❌ [UPDATE MECHANIC] Datos de mecánico incompletos");
          toast.error("Error al cargar los datos del mecánico");
        }
      } catch (error) {
        console.error(
          "❌ [UPDATE MECHANIC] Error detallado al cargar datos:",
          error
        );

        if (error instanceof Error) {
          toast.error(
            `Error al cargar los datos del mecánico: ${error.message}`
          );
        } else {
          toast.error("Error desconocido al cargar los datos del mecánico");
        }

        console.log(
          "⏳ [UPDATE MECHANIC] Esperando 3 segundos antes de redirigir..."
        );
        setTimeout(() => {
          navigate("/mechanics/list");
        }, 3000);
      } finally {
        setLoadingData(false);
      }
    };

    fetchMechanic();
  }, [employeeCode, navigate]);

  async function onSubmit(values: MechanicFormValues) {
    console.log("🔥 [UPDATE MECHANIC] onSubmit INICIADO!");
    console.log("📝 [UPDATE MECHANIC] Valores del formulario:", values);
    console.log("🔑 [UPDATE MECHANIC] Código de empleado:", employeeCode);

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

      console.log("📦 [UPDATE MECHANIC] Datos preparados:", mechanicData);

      const result = await mechanicService.updateMechanic(
        employeeCode!,
        mechanicData
      );
      console.log("✅ [UPDATE MECHANIC] Mecánico actualizado:", result);

      if (
        result.message &&
        result.message.includes("Solo se actualizó el status")
      ) {
        toast.warning(
          "⚠️ Actualización parcial: Solo se pudo actualizar el estado. El backend requiere revisión para actualizar otros campos."
        );
        setTimeout(() => navigate("/mechanics/list"), 2000);
      } else {
        toast.success("✅ Mecánico actualizado exitosamente");
        navigate("/mechanics/list");
      }
    } catch (error) {
      console.error("❌ [UPDATE MECHANIC] Error:", error);
      toast.error(
        "Error al actualizar el mecánico: " +
          (error instanceof Error ? error.message : "Error desconocido")
      );
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
              onClick={() => navigate("/mechanics/list")}
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
          <MechanicForm
            defaultValues={initialValues}
            onSubmit={onSubmit}
            isLoading={isLoading}
            mode="edit"
          />
        </div>
      </div>
    </motion.div>
  );
}
