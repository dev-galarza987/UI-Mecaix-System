import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { reservateService, type ReservateData } from '../../services/reservateService';
import { clientService, type Client } from '../../services/clientService';
import { serviceService, type Service } from '../../services/serviceService';
import { useNavigate, useParams } from 'react-router-dom';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

const formSchema = z.object({
  code: z.coerce.number().int().positive(),
  reservationDate: z.date(),
  state: z.string(),
  clientId: z.number(),
  serviceIds: z.array(z.number()).min(1, { message: 'At least one service must be selected.' }),
});

export default function ReservateUpdateForm() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const reservateCode = Number(code);

  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, servicesData, reservateData] = await Promise.all([
          clientService.getAllClients(),
          serviceService.getAllServices(),
          reservateService.getReservateByCode(reservateCode),
        ]);
        setClients(clientsData);
        setServices(servicesData);
        form.reset({
          ...reservateData,
          reservationDate: new Date(reservateData.reservationDate),
          clientId: reservateData.client.id,
          serviceIds: reservateData.services.map(s => s.id),
        });
        setSelectedServices(reservateData.services);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    if (reservateCode) {
      fetchData();
    }
  }, [reservateCode, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const totalPrice = selectedServices.reduce((acc, service) => acc + service.price, 0);
      const client = clients.find(c => c.id === values.clientId);

      if (!client) {
        throw new Error('Selected client not found');
      }

      const reservateData: Partial<ReservateData> = {
        ...values,
        totalPrice,
        client,
        services: selectedServices,
        reservationDate: values.reservationDate.toISOString(),
      };

      await reservateService.updateReservate(reservateCode, reservateData);
      navigate('/reservates/list');
    } catch (error) {
      console.error('Failed to update reservation', error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => navigate('/reservates/list')} className="mb-4">
        Back to List
      </Button>
      <h1 className="text-3xl font-bold mb-6 text-primary">Edit Reservation</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1001" {...field} disabled />
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
                <FormLabel>Reservation Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
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
                        date > new Date() || date < new Date("1900-01-01")
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
                <FormLabel>State</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name} {client.lastname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Services</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value?.length && "text-muted-foreground"
                        )}
                      >
                        {selectedServices.length
                          ? selectedServices.map(s => s.title).join(', ')
                          : "Select services"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search services..." />
                      <CommandEmpty>No services found.</CommandEmpty>
                      <CommandGroup>
                        {services.map((service) => (
                          <CommandItem
                            key={service.id}
                            onSelect={() => {
                              const isSelected = selectedServices.some(s => s.id === service.id);
                              const newSelected = isSelected
                                ? selectedServices.filter(s => s.id !== service.id)
                                : [...selectedServices, service];
                              setSelectedServices(newSelected);
                              field.onChange(newSelected.map(s => s.id));
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedServices.some(s => s.id === service.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {service.title}
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

          <Button type="submit">Update Reservation</Button>
        </form>
      </Form>
    </div>
  );
}
