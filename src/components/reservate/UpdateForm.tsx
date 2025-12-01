import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  reservateService,
  type ReservateData,
} from "../../services/reservateService";
import { ReservateForm, type ReservateFormValues } from "./ReservateForm";
import { Spinner } from "@/components/ui/spinner";

export default function ReservateUpdateForm() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const [isLoading, setLoading] = useState(false);
  const [initialValues, setInitialValues] =
    useState<Partial<ReservateFormValues> | null>(null);

  useEffect(() => {
    const fetchReservate = async () => {
      if (!code) {
        toast.error("Código de reserva no válido");
        navigate("/reservates/list");
        return;
      }

      try {
        const reservate = await reservateService.getReservate(code);

        if (!reservate) {
          toast.error("Reserva no encontrada");
          navigate("/reservates/list");
          return;
        }

        // Transform API data to form values
        const formValues: Partial<ReservateFormValues> = {
          code: parseInt(reservate.code),
          reservationDate: new Date(reservate.reservationDate),
          state: reservate.state,
          clientId: reservate.clientId || reservate.client?.id,
          mechanicId: reservate.mechanicId || reservate.mechanic?.id,
          serviceIds: reservate.services?.map((s) => s.id) || [],
          totalPrice: reservate.totalPrice,
          // notes: reservate.notes // Assuming notes might be added later or exist
        };

        setInitialValues(formValues);
      } catch (error) {
        console.error("Error fetching reservate:", error);
        toast.error("Error al cargar la reserva");
        navigate("/reservates/list");
      }
    };

    fetchReservate();
  }, [code, navigate]);

  async function onSubmit(values: ReservateFormValues) {
    if (!code) return;

    try {
      setLoading(true);

      const reservateData: Partial<ReservateData> = {
        ...values,
        code: values.code.toString(),
        reservationDate: values.reservationDate.toISOString(),
        state: values.state as ReservateData["state"],
      };

      console.log("📝 [UPDATE FORM] Enviando actualización:", reservateData);
      await reservateService.updateReservate(code, reservateData);

      toast.success("Reserva actualizada exitosamente");
      navigate("/reservates/list");
    } catch (error) {
      console.error("Error updating reservate:", error);
      toast.error("Error al actualizar la reserva");
    } finally {
      setLoading(false);
    }
  }

  if (!initialValues) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/reservates/list")}
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Editar Reserva
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Modifique los detalles de la reserva existente.
            </p>
          </div>
        </div>

        <ReservateForm
          defaultValues={initialValues}
          onSubmit={onSubmit}
          isLoading={isLoading}
          mode="edit"
        />
      </motion.div>
    </div>
  );
}
