import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  Users,
  Phone,
  Mail,
  MessageSquare,
  TrendingUp,
  FileText,
  Download,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  getClientStats,
  getTopClients,
  type ClientStats,
  type TopClient,
} from "@/services/clientService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
interface ClientReportsProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ClientReports({
  trigger,
  open,
  onOpenChange,
}: ClientReportsProps) {
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (open) {
        setLoading(true);
        try {
          const [statsData, topClientsData] = await Promise.all([
            getClientStats(),
            getTopClients(5),
          ]);
          setStats(statsData);
          setTopClients(topClientsData);
        } catch (error) {
          console.error("Error loading reports data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [open]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="w-full sm:max-w-[95vw] max-h-[80vh] overflow-y-auto bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <FileText className="h-6 w-6 text-blue-600" />
            Reportes y Análisis de Clientes
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Resumen detallado del rendimiento y estadísticas de la base de
            clientes.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8 text-blue-600" />
          </div>
        ) : stats ? (
          <Tabs defaultValue="overview" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-200 dark:bg-slate-800">
              <TabsTrigger value="overview">Resumen General</TabsTrigger>
              <TabsTrigger value="demographics">Demografía</TabsTrigger>
              <TabsTrigger value="top-clients">Top Clientes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Ingresos Totales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(stats.totalRevenue)}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Generados por {stats.totalReservations} reservaciones
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Promedio por Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(stats.averageRevenuePerClient)}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      ~{stats.averageReservationsPerClient.toFixed(1)}{" "}
                      reservaciones por cliente
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Client Status */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Estado de la Base de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.totalClients}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Total
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {stats.activeClients}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Activos
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {stats.inactiveClients}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Inactivos
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender Distribution */}
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                      Distribución por Género
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            Masculino
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {stats.genderDistribution.male}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-pink-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            Femenino
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {stats.genderDistribution.female}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Methods */}
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                      Métodos de Contacto Preferidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-emerald-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            Teléfono
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {stats.contactMethodDistribution.phone}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            Email
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {stats.contactMethodDistribution.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-green-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            WhatsApp
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {stats.contactMethodDistribution.whatsapp}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="top-clients">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    Top 5 Clientes (Por Ingresos)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Reservas</TableHead>
                        <TableHead>Última Visita</TableHead>
                        <TableHead className="text-right">
                          Total Gastado
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topClients.map((client) => (
                        <TableRow key={client.code}>
                          <TableCell className="font-medium">
                            <div>{client.fullName}</div>
                            <div className="text-xs text-slate-500">
                              {client.email}
                            </div>
                          </TableCell>
                          <TableCell>{client.totalReservations}</TableCell>
                          <TableCell>
                            {client.lastVisit
                              ? format(
                                  new Date(client.lastVisit),
                                  "dd MMM yyyy",
                                  { locale: es }
                                )
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(client.totalSpent)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No se pudieron cargar los datos.
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
