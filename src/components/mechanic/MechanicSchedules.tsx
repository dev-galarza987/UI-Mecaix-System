import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";
import { mechanicService, type Mechanic } from "../../services/mechanicService";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function MechanicSchedules() {
  const navigate = useNavigate();
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await mechanicService.getAllMechanics();
        setMechanics(response.data || []);
      } catch (error) {
        console.error("Error fetching mechanics:", error);
        toast.error("Error al cargar los horarios de los mecánicos");
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  const getDayLabel = (day: string) => {
    const days: Record<string, string> = {
      MONDAY: "Lunes",
      TUESDAY: "Martes",
      WEDNESDAY: "Miércoles",
      THURSDAY: "Jueves",
      FRIDAY: "Viernes",
      SATURDAY: "Sábado",
      SUNDAY: "Domingo",
    };
    return days[day] || day;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div variants={cardVariants} className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/mechanics")}
            className="hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Horarios de Mecánicos
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Visualiza y gestiona los horarios de trabajo de todo el equipo
            </p>
          </div>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Tabla de Horarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                    <TableRow>
                      <TableHead className="font-semibold">Mecánico</TableHead>
                      <TableHead className="font-semibold">Código</TableHead>
                      <TableHead className="font-semibold">
                        Días de Trabajo
                      </TableHead>
                      <TableHead className="font-semibold">Horario</TableHead>
                      <TableHead className="font-semibold text-right">
                        Estado
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mechanics.length > 0 ? (
                      mechanics.map((mechanic) => (
                        <TableRow
                          key={mechanic.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs">
                                {mechanic.firstName[0]}
                                {mechanic.lastName[0]}
                              </div>
                              <span>
                                {mechanic.firstName} {mechanic.lastName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-slate-500">
                            {mechanic.employeeCode}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {mechanic.workDays &&
                              mechanic.workDays.length > 0 ? (
                                mechanic.workDays.map((day) => (
                                  <Badge
                                    key={day}
                                    variant="secondary"
                                    className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200"
                                  >
                                    {getDayLabel(day)}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-slate-400 italic text-sm">
                                  Sin días asignados
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                              <Clock className="h-4 w-4 text-slate-400" />
                              {mechanic.workScheduleStart &&
                              mechanic.workScheduleEnd ? (
                                <span>
                                  {mechanic.workScheduleStart.slice(0, 5)} -{" "}
                                  {mechanic.workScheduleEnd.slice(0, 5)}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">
                                  Sin horario
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                mechanic.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                              className={
                                mechanic.status === "active"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                              }
                            >
                              {mechanic.status === "active"
                                ? "Activo"
                                : "Inactivo"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-slate-500"
                        >
                          No se encontraron mecánicos
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
