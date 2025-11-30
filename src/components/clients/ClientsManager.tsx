import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllClients, deleteClient, searchClients } from '../../services/clientService';
import type { Client } from '../../services/clientService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const ClientsManager: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const results = await searchClients(searchTerm);
        setClients(results);
      } catch (error) {
        console.error('Error searching clients:', error);
      } finally {
        setLoading(false);
      }
    } else {
      loadClients();
    }
  };

  const handleDelete = async (code: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await deleteClient(code.toString());
        setClients(clients.filter(client => client.code !== code));
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <Button>Nuevo Cliente</Button>
      </div>

      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
        <Button variant="outline" onClick={loadClients}>
          Mostrar Todos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <motion.div
            key={client.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{client.nombre} {client.apellido}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    client.estado === 'activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {client.estado}
                  </span>
                </CardTitle>
                <CardDescription>
                  Code: {client.code} • {client.genero}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {client.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Teléfono:</span> {client.telefono}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Dirección:</span> {client.direccion}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">CI:</span> {client.ci}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => client.code && handleDelete(client.code)}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {clients.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron clientes</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando...</p>
        </div>
      )}
    </motion.div>
  );
};

export default ClientsManager;