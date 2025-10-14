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
import { vehicleService, type VehicleData } from '../../services/vehicleService';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  board: z.string().min(2, { message: 'Board must be at least 2 characters.' }),
  brand: z.string().min(2, { message: 'Brand must be at least 2 characters.' }),
  model: z.string().min(2, { message: 'Model must be at least 2 characters.' }),
  year: z.coerce.number().int().positive(),
});

export default function VehicleRegisterForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      board: '',
      brand: '',
      model: '',
      year: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const vehicleData: VehicleData = values;
      await vehicleService.createVehicle(vehicleData);
      navigate('/vehicles/list');
    } catch (error) {
      console.error('Failed to create vehicle', error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => navigate('/vehicles')} className="mb-4">
        Back to Vehicle Menu
      </Button>
      <h1 className="text-3xl font-bold mb-6 text-primary">Create New Vehicle</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="board"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board</FormLabel>
                <FormControl>
                  <Input placeholder="ABC-123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Corolla" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create Vehicle</Button>
        </form>
      </Form>
    </div>
  );
}
