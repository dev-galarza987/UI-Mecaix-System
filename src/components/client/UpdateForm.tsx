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
import { clientService, type ClientData } from '../../services/clientService';
import { useNavigate, useParams } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  lastname: z.string().min(2, { message: 'Lastname must be at least 2 characters.' }),
  phone: z.coerce.number().int().positive(),
});

export default function UpdateForm() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const clientCode = Number(code);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await clientService.getClientByCode(clientCode);
        form.reset(client);
      } catch (error) {
        console.error('Failed to fetch client', error);
      }
    };
    if (clientCode) {
      fetchClient();
    }
  }, [clientCode, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const clientData: Partial<ClientData> = values;
      await clientService.updateClient(clientCode, clientData);
      navigate('/clients/list');
    } catch (error) {
      console.error('Failed to update client', error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => navigate('/clients/list')} className="mb-4">
        Back to List
      </Button>
      <h1 className="text-3xl font-bold mb-6 text-primary">Edit Client</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update Client</Button>
        </form>
      </Form>
    </div>
  );
}