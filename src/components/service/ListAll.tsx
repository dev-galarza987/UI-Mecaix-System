import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Grid3X3,
  List,
  Wrench,
  Eye,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serviceService, type Service } from "../../services/serviceService";

export default function ListAll() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"code" | "title" | "price">("code");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priceRange, setPriceRange] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("📋 [SERVICE LIST] Iniciando carga de servicios...");
        setLoading(true);
        const data = await serviceService.getAllServices();
        console.log("📋 [SERVICE LIST] Datos recibidos:", data);
        console.log("📋 [SERVICE LIST] Tipo de datos:", typeof data);
        console.log("📋 [SERVICE LIST] Es array?:", Array.isArray(data));
        if (Array.isArray(data) && data.length > 0) {
          console.log("📋 [SERVICE LIST] Primer servicio completo:", data[0]);
          console.log(
            "📋 [SERVICE LIST] Code del primer servicio:",
            data[0].code
          );
          console.log("📋 [SERVICE LIST] ID del primer servicio:", data[0].id);
        }
        setServices(data);
        setError(null);
      } catch (err) {
        console.error("❌ [SERVICE LIST] Error al cargar servicios:", err);
        setError("Failed to fetch services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = useMemo(() => {
    // Como la API no tiene categorías, las removemos por ahora
    return ["all"];
  }, []);

  const filteredServices = useMemo(() => {
    const filtered = services.filter((service) => {
      const matchesSearch =
        service.code
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Solo filtro por categoría si fuera 'all' ya que no tenemos categorías
      const matchesCategory = selectedCategory === "all";

      const matchesPriceRange =
        priceRange === "all" ||
        (priceRange === "low" && service.price < 50) ||
        (priceRange === "medium" &&
          service.price >= 50 &&
          service.price < 150) ||
        (priceRange === "high" && service.price >= 150);

      return matchesSearch && matchesCategory && matchesPriceRange;
    });

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // Compare values
      let compareA: string | number = aValue;
      let compareB: string | number = bValue;

      if (typeof aValue === "string" && typeof bValue === "string") {
        compareA = aValue.toLowerCase();
        compareB = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
      }
    });

    return filtered;
  }, [services, searchTerm, selectedCategory, sortBy, sortOrder, priceRange]);

  const handleDelete = async (id: number) => {
    try {
      await serviceService.deleteService(id);
      setServices(services.filter((service) => service.id !== id));
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
      setError("Error al eliminar el servicio.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Cargando servicios...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-red-600">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-4 -left-4 w-96 h-96 bg-purple-400/5 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 bg-violet-400/5 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
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
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Wrench className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Catálogo de Servicios
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {filteredServices.length} servicios encontrados
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Button
              variant="outline"
              onClick={() => navigate("/services")}
              className="hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              ← Regresar
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("table")}
                    className={
                      viewMode === "table"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Vista de tabla</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Vista de tarjetas</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={() => navigate("/services/new")}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por código, título o descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "Todas las categorías" : category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={priceRange}
                    onChange={(e) =>
                      setPriceRange(
                        e.target.value as "all" | "low" | "medium" | "high"
                      )
                    }
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todos los precios</option>
                    <option value="low">Hasta Bs.50</option>
                    <option value="medium">Bs.50 - Bs.150</option>
                    <option value="high">Más de Bs.150</option>
                  </select>

                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-");
                      setSortBy(field as "code" | "title" | "price");
                      setSortOrder(order as "asc" | "desc");
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="code-asc">Código A-Z</option>
                    <option value="code-desc">Código Z-A</option>
                    <option value="title-asc">Título A-Z</option>
                    <option value="title-desc">Título Z-A</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="rating-desc">Mejor Calificación</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === "table" ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-purple-500/10 to-violet-500/10">
                      <TableRow>
                        <TableHead className="font-semibold">Código</TableHead>
                        <TableHead className="font-semibold">
                          Servicio
                        </TableHead>
                        <TableHead className="font-semibold">Precio</TableHead>
                        <TableHead className="font-semibold">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.map((service, index) => (
                        <motion.tr
                          key={service.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-purple-50/50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <TableCell className="font-mono text-sm font-medium">
                            {service.code}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{service.title}</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs">
                                {service.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            Bs.{service.price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-blue-50 hover:border-blue-300"
                                      onClick={() =>
                                        navigate(`/services/${service.id}`)
                                      }
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Ver detalles</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-amber-50 hover:border-amber-300"
                                      onClick={() =>
                                        navigate(
                                          `/services/update/${service.id}`
                                        )
                                      }
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Editar servicio
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-red-50 hover:border-red-300"
                                      onClick={() => handleDelete(service.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Eliminar servicio
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg hover:shadow-purple-500/20 transition-all duration-300 h-full">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs"
                        >
                          {service.code}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Precio:
                          </span>
                          <span className="font-bold text-lg text-green-600">
                            Bs.{service.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => navigate(`/services/${service.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-amber-50 hover:border-amber-300"
                          onClick={() =>
                            navigate(`/services/update/${service.id}`)
                          }
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-red-50 hover:border-red-300"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No se encontraron servicios
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Intenta ajustar los filtros de búsqueda o crear un nuevo
                  servicio
                </p>
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                  className="mr-2"
                >
                  Limpiar filtros
                </Button>
                <Button
                  onClick={() => navigate("/services/new")}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Servicio
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
