import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  reservateService,
  type Reservate,
} from "../../services/reservateService";
import { toast } from "sonner";

type ViewMode = "table" | "grid";
type SortField = "code" | "date" | "client" | "total" | "state";
type SortOrder = "asc" | "desc";

export default function ReservateListAll() {
  const navigate = useNavigate();
  const [reservates, setReservates] = useState<Reservate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    reservate: Reservate | null;
  }>({
    open: false,
    reservate: null,
  });

  useEffect(() => {
    fetchReservates();
  }, []);

  const fetchReservates = async () => {
    try {
      console.log("🚀 [LIST ALL] Iniciando fetchReservates...");
      setLoading(true);
      const data = await reservateService.getAllReservates();
      console.log("✅ [LIST ALL] Datos recibidos:", data);
      console.log("✅ [LIST ALL] Tipo de datos:", typeof data);
      console.log("✅ [LIST ALL] Es array:", Array.isArray(data));
      console.log("✅ [LIST ALL] Longitud:", data?.length);

      if (data && Array.isArray(data) && data.length > 0) {
        console.log("✅ [LIST ALL] Primera reserva:", data[0]);
        setReservates(data);
      } else {
        console.warn("⚠️ [LIST ALL] Datos vacíos o inválidos:", data);
        setReservates([]);
      }
    } catch (error) {
      console.error("❌ [LIST ALL] Error fetching reservates:", error);
      toast.error("Error al cargar las reservaciones");
      setReservates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reservate: Reservate) => {
    try {
      console.log(
        "🗑️ [LIST ALL] Iniciando eliminación de reserva:",
        reservate.code
      );
      await reservateService.deleteReservate(reservate.code);
      console.log("✅ [LIST ALL] Reserva eliminada exitosamente");
      toast.success("Reservación eliminada exitosamente");
      fetchReservates();
    } catch (error) {
      console.error("❌ [LIST ALL] Error deleting reservate:", error);
      toast.error("Error al eliminar la reservación");
    }
    setDeleteDialog({ open: false, reservate: null });
  };

  const filteredAndSortedReservates = useMemo(() => {
    const filtered = reservates.filter((reservate) => {
      const matchesSearch =
        reservate.client?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservate.client?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservate.code?.toString().includes(searchTerm) ||
        reservate.services?.some((service: any) =>
          service.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesState =
        stateFilter === "all" || reservate.state === stateFilter;

      return matchesSearch && matchesState;
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "code":
          comparison = parseInt(a.code || "0") - parseInt(b.code || "0");
          break;
        case "date":
          comparison =
            new Date(a.reservationDate).getTime() -
            new Date(b.reservationDate).getTime();
          break;
        case "client": {
          const clientA = `${a.client?.name || ""} ${a.client?.lastName || ""}`;
          const clientB = `${b.client?.name || ""} ${b.client?.lastName || ""}`;
          comparison = clientA.localeCompare(clientB);
          break;
        }
        case "total":
          comparison = (a.totalPrice || 0) - (b.totalPrice || 0);
          break;
        case "state":
          comparison = (a.state || "").localeCompare(b.state || "");
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [reservates, searchTerm, stateFilter, sortField, sortOrder]);

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

        <div className="relative container mx-auto p-6">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/reservates")}
                className="w-full sm:w-auto bg-white/70 backdrop-blur-sm border-emerald-200/50 hover:bg-emerald-50/70 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al menú
              </Button>

              <Button
                onClick={() => navigate("/reservates/new")}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Reserva
              </Button>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent mb-2">
              Lista de Reservaciones
            </h1>
            <p className="text-emerald-600/80 text-lg">
              Gestiona todas las reservaciones del sistema
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-1 items-center space-x-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por cliente, código o servicio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-emerald-200 focus:border-emerald-400"
                      />
                    </div>

                    <Select value={stateFilter} onValueChange={setStateFilter}>
                      <SelectTrigger className="w-48 border-emerald-200">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="confirmed">Confirmada</SelectItem>
                        <SelectItem value="in_progress">En Progreso</SelectItem>
                        <SelectItem value="completed">Completada</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex bg-emerald-100 rounded-lg p-1">
                      <Button
                        variant={viewMode === "table" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className={
                          viewMode === "table"
                            ? "bg-emerald-600 text-white"
                            : "text-emerald-600"
                        }
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={
                          viewMode === "grid"
                            ? "bg-emerald-600 text-white"
                            : "text-emerald-600"
                        }
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="ml-2 text-emerald-600">
                Cargando reservaciones...
              </span>
            </div>
          ) : filteredAndSortedReservates.length === 0 ? (
            <Card className="text-center py-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No se encontraron reservaciones
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || stateFilter !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Aún no hay reservaciones registradas"}
                </p>
                <Button
                  onClick={() => navigate("/reservates/register")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primera reserva
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-700 dark:to-slate-600 border-b border-emerald-200/50 dark:border-slate-600">
                        <tr>
                          <th className="text-left p-4 font-semibold text-emerald-700 dark:text-emerald-300">
                            Código
                          </th>
                          <th className="text-left p-4 font-semibold text-emerald-700 dark:text-emerald-300">
                            Cliente
                          </th>
                          <th className="text-left p-4 font-semibold text-emerald-700 dark:text-emerald-300">
                            Fecha
                          </th>
                          <th className="text-left p-4 font-semibold text-emerald-700 dark:text-emerald-300">
                            Estado
                          </th>
                          <th className="text-left p-4 font-semibold text-emerald-700 dark:text-emerald-300">
                            Total
                          </th>
                          <th className="text-left p-4 font-semibold text-emerald-700 dark:text-emerald-300">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedReservates.map((reservate, index) => (
                          <motion.tr
                            key={reservate.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="border-b border-emerald-100/50 dark:border-slate-600 hover:bg-emerald-50/30 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <td className="p-4">
                              <span className="font-mono text-sm font-medium">
                                {reservate.code}
                              </span>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">
                                  {reservate.client?.name}{" "}
                                  {reservate.client?.lastname}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {reservate.client?.email}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">
                                  {new Date(
                                    reservate.reservationDate
                                  ).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    reservate.reservationDate
                                  ).toLocaleTimeString("es-ES", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  reservate.state === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : reservate.state === "in_progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : reservate.state === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : reservate.state === "confirmed"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {reservate.state === "completed"
                                  ? "Completada"
                                  : reservate.state === "in_progress"
                                  ? "En Progreso"
                                  : reservate.state === "pending"
                                  ? "Pendiente"
                                  : reservate.state === "confirmed"
                                  ? "Confirmada"
                                  : "Cancelada"}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-emerald-700">
                                Bs.{reservate.totalPrice}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    console.log(
                                      "✏️ [LIST ALL] Navegando a editar reserva:",
                                      reservate.code
                                    );
                                    navigate(
                                      `/reservates/update/${reservate.code}`
                                    );
                                  }}
                                  className="h-8 w-8 p-0 border-emerald-200 hover:bg-emerald-50"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setDeleteDialog({ open: true, reservate })
                                  }
                                  disabled
                                  title="Funcionalidad temporalmente deshabilitada"
                                  className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 text-red-600 opacity-50 cursor-not-allowed"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, reservate: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar la reservación #
              {deleteDialog.reservate?.code}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, reservate: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteDialog.reservate && handleDelete(deleteDialog.reservate)
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
