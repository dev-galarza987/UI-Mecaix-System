import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservateService, type Reservate } from '../../services/reservateService';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export default function ReservateList() {
  const [reservates, setReservates] = useState<Reservate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [reservateToDelete, setReservateToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservates = async () => {
      try {
        setLoading(true);
        const data = await reservateService.getAllReservates();
        setReservates(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch reservations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservates();
  }, []);

  const handleDeleteClick = (code: number) => {
    setReservateToDelete(code);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (reservateToDelete !== null) {
      try {
        await reservateService.deleteReservate(reservateToDelete);
        setReservates(reservates.filter((r) => r.code !== reservateToDelete));
      } catch (err) {
        setError('Failed to delete reservation.');
        console.error(err);
      }
    }
    setShowDeleteAlert(false);
    setReservateToDelete(null);
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4">
        <Button variant="outline" onClick={() => navigate('/reservates')} className="mb-4">
          Regresar al menu de Reservaciones
        </Button>
        <h1 className="text-3xl font-bold mb-6 text-primary">Lista de Reservaciones</h1>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-b-0">
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Precio Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservates.map((reservate) => (
                <Collapsible asChild key={reservate.id}>
                  <>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell className="font-mono text-muted-foreground">{reservate.code}</TableCell>
                      <TableCell>{reservate.client.name} {reservate.client.lastname}</TableCell>
                      <TableCell>{new Date(reservate.reservationDate).toLocaleDateString()}</TableCell>
                      <TableCell>Bs.{reservate.totalPrice}</TableCell>
                      <TableCell>{reservate.state}</TableCell>
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Palanca de servicios</span>
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => navigate(`/reservates/update/${reservate.code}`)}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                              </svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar reservación</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="destructive" size="icon" className="ml-2" onClick={() => handleDeleteClick(reservate.code)}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                              </svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar reservación</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow>
                        <TableCell colSpan={7}>
                          <div className="p-4 bg-muted/50 rounded-md">
                            <h4 className="font-semibold mb-2">Servicios para la reservación {reservate.code}</h4>
                            <ul>
                              {reservate.services.map(service => (
                                <li key={service.id} className="flex justify-between">
                                  <span>{service.title}</span>
                                  <span>Bs.{service.price}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </div>

        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro de eliminar esta reservación?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la reservación.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
