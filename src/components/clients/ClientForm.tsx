import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient, updateClient } from '../../services/clientService';
import type { Client } from '../../services/clientService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ClientFormProps {
  client?: Client;
  onSubmit: (client: Client) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: client?.nombre || '',
    apellido: client?.apellido || '',
    telefono: client?.telefono || '',
    email: client?.email || '',
    genero: client?.genero || 'masculino' as 'masculino' | 'femenino' | 'otro',
    fechaNacimiento: client?.fechaNacimiento || '',
    tipoDocumento: client?.tipoDocumento || 'cedula',
    numeroDocumento: client?.numeroDocumento || '',
    direccion: client?.direccion || '',
    ciudad: client?.ciudad || '',
    codigoPostal: client?.codigoPostal || '',
    profesion: client?.profesion || '',
    estado: client?.estado || 'activo' as 'activo' | 'inactivo',
    metodoPrefContacto: client?.metodoPrefContacto || 'telefono' as 'telefono' | 'email' | 'ambos',
    frecuenciaContacto: client?.frecuenciaContacto || 'media' as 'alta' | 'media' | 'baja',
    notas: client?.notas || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (client?.id) {
        // Actualizar cliente existente
        const updatedClient = await updateClient(client.id, formData);
        onSubmit(updatedClient);
      } else {
        // Crear nuevo cliente
        const newClient = await createClient(formData);
        onSubmit(newClient);
      }
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  value={formData.ciudad}
                  onChange={(e) => handleInputChange('ciudad', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="profesion">Profesión</Label>
                <Input
                  id="profesion"
                  value={formData.profesion}
                  onChange={(e) => handleInputChange('profesion', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientForm;