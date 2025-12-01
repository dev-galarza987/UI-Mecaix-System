import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  Save,
  Loader2,
  User,
  Wrench,
  DollarSign,
  FileText,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { getAllClients, type Client } from "../../services/clientService";
import { serviceService, type Service } from "../../services/serviceService";
import { mechanicService, type Mechanic } from "../../services/mechanicService";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  code: z.coerce
    .number()
    .int()
    .positive("El código debe ser un número positivo"),
  reservationDate: z.date({
    required_error: "La fecha de reserva es requerida",
  }),
  state: z.string({ required_error: "El estado es requerido" }),
  clientId: z.number({ required_error: "El cliente es requerido" }),
  mechanicId: z.number({ required_error: "El mecánico es requerido" }),
  serviceIds: z
    .array(z.number())
    .min(1, { message: "Debe seleccionar al menos un servicio" }),
  totalPrice: z.number().min(0, "El precio total no puede ser negativo"),
  notes: z.string().optional(),
});

export type ReservateFormValues = z.infer<typeof formSchema>;

interface ReservateFormProps {
  defaultValues?: Partial<ReservateFormValues>;
  onSubmit: (values: ReservateFormValues) => Promise<void>;
  isLoading: boolean;
  mode: "create" | "edit";
}

export function ReservateForm({
  defaultValues,
  onSubmit,
  isLoading,
  mode,
}: ReservateFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [isLoadingData, setLoadingData] = useState(true);

  const form = useForm<ReservateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: 0,
      state: "pending",
      serviceIds: [],
      totalPrice: 0,
      notes: "",
      ...defaultValues,
    },
  });

  // Update form values when defaultValues change (important for edit mode)
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });

      // If we have serviceIds, we need to set selectedServices to calculate total correctly
      if (defaultValues.serviceIds && services.length > 0) {
        const preSelected = services.filter((s) =>
          defaultValues.serviceIds?.includes(s.id)
        );
        setSelectedServices(preSelected);
      }
    }
  }, [defaultValues, services, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [clientsData, servicesData, mechanicsResponse] =
          await Promise.all([
            getAllClients(),
            serviceService.getAllServices(),
            mechanicService.getAllMechanics(),
          ]);
        setClients(clientsData);
        setServices(servicesData);
        setMechanics(mechanicsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Calculate total price when services change
  useEffect(() => {
    const total = selectedServices.reduce(
      (acc, service) => acc + service.price,
      0
    );
    form.setValue("totalPrice", total);
  }, [selectedServices, form]);

  const handleServiceToggle = (serviceId: number) => {
    const currentIds = form.getValues("serviceIds");
    const service = services.find((s) => s.id === serviceId);

    if (!service) return;

    if (currentIds.includes(serviceId)) {
      form.setValue(
        "serviceIds",
        currentIds.filter((id) => id !== serviceId)
      );
      setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
    } else {
      form.setValue("serviceIds", [...currentIds, serviceId]);
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información General */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Información de la Reserva
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Reserva</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled={mode === "edit"} // Code usually shouldn't change in edit
                        className="bg-slate-50 dark:bg-slate-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reservationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Reserva</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="confirmed">Confirmada</SelectItem>
                        <SelectItem value="in_progress">En Progreso</SelectItem>
                        <SelectItem value="completed">Completada</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Cliente y Mecánico */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Asignación
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Cliente</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? clients.find(
                                  (client) => client.id === field.value
                                )?.name +
                                " " +
                                clients.find(
                                  (client) => client.id === field.value
                                )?.lastName
                              : "Seleccione un cliente"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar cliente..." />
                          <CommandEmpty>
                            No se encontraron clientes.
                          </CommandEmpty>
                          <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {clients.map((client) => (
                              <CommandItem
                                value={`${client.name} ${client.lastName}`}
                                key={client.id}
                                onSelect={() => {
                                  form.setValue("clientId", client.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    client.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>
                                    {client.name} {client.lastName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {client.email} - {client.phone}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mechanicId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Mecánico</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? mechanics.find((m) => m.id === field.value)
                                  ?.firstName +
                                " " +
                                mechanics.find((m) => m.id === field.value)
                                  ?.lastName
                              : "Seleccione un mecánico"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar mecánico..." />
                          <CommandEmpty>
                            No se encontraron mecánicos.
                          </CommandEmpty>
                          <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {mechanics.map((mechanic) => (
                              <CommandItem
                                value={`${mechanic.firstName} ${mechanic.lastName}`}
                                key={mechanic.id}
                                onSelect={() => {
                                  form.setValue("mechanicId", mechanic.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    mechanic.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>
                                    {mechanic.firstName} {mechanic.lastName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {mechanic.specialties.join(", ")}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Servicios */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-500" />
                Servicios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="serviceIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Seleccione los servicios
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className={cn(
                            "flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all hover:bg-accent",
                            form.getValues("serviceIds").includes(service.id) &&
                              "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          )}
                          onClick={() => handleServiceToggle(service.id)}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 mt-1 rounded border flex items-center justify-center",
                              form.getValues("serviceIds").includes(service.id)
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "border-gray-400"
                            )}
                          >
                            {form
                              .getValues("serviceIds")
                              .includes(service.id) && (
                              <Check className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {service.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {service.description}
                            </p>
                            <p className="text-sm font-bold text-blue-600 mt-2">
                              Bs.{service.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Resumen Financiero */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Resumen Financiero
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <span className="font-medium">Total Estimado:</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Bs.{form.watch("totalPrice").toFixed(2)}
                </span>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Adicionales</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalles adicionales sobre la reserva..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Creando..." : "Guardando..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === "create" ? "Crear Reserva" : "Guardar Cambios"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
