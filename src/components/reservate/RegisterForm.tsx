import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  reservateService,
  type ReservateData,
} from "../../services/reservateService";
import { ReservateForm, type ReservateFormValues } from "./ReservateForm";

export function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  async function onSubmit(values: ReservateFormValues) {
    try {
      setLoading(true);

      const reservateData: ReservateData = {
        ...values,
        code: values.code.toString(),
        reservationDate: values.reservationDate.toISOString(),
        state: values.state as ReservateData["state"],
      };

      console.log("📝 [REGISTER FORM] Enviando datos:", reservateData);
      await reservateService.createReservate(reservateData);

      toast.success("Reserva creada exitosamente");
      navigate("/reservates/list");
    } catch (error) {
      console.error("Error creating reservate:", error);
      toast.error("Error al crear la reserva");
    } finally {
      setLoading(false);
    }
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
              Nueva Reserva (Refactored)
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Complete el formulario para registrar una nueva reserva.
            </p>
          </div>
        </div>

        <ReservateForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          mode="create"
        />
      </motion.div>
    </div>
  );
}
