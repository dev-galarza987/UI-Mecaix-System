import { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { serviceService, type ServiceData } from '../../services/serviceService';
import { useNavigate, useParams } from 'react-router-dom';

const formSchema = z.object({
  code: z.coerce.number().int().positive(),
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive(),
});

export default function ServiceUpdateForm() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const serviceCode = Number(code);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const service = await serviceService.getServiceByCode(serviceCode);
        form.reset(service);
      } catch (error) {
        console.error('Failed to fetch service', error);
      }
    };
    if (serviceCode) {
      fetchService();
    }
  }, [serviceCode, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const serviceData: Partial<ServiceData> = values;
      await serviceService.updateService(serviceCode, serviceData);
      navigate('/services/list');
    } catch (error) {
      console.error('Failed to update service', error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => navigate('/services/list')} className="mb-4">
        Regresar a la lista de servicios
      </Button>
      <h1 className="text-3xl font-bold mb-6 text-primary">Editar Servicio</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="101" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Cambio de Aceite" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descripción detallada del servicio..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Actualizar Servicio</Button>
        </form>
      </Form>
    </div>
  );
}
