import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient, type Client } from '../../services/clientService';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    lastname: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clientData: Client = {
        nombre: formData.name,
        apellido: formData.lastname,
        telefono: formData.phone,
        email: '',
        genero: 'otro',
        fechaNacimiento: '',
        tipoDocumento: '',
        numeroDocumento: formData.code,
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        profesion: '',
        estado: 'activo',
        metodoPrefContacto: 'telefono',
        frecuenciaContacto: 'media'
      };
      await createClient(clientData);
      navigate('/clients/list');
    } catch (error) {
      console.error('Failed to create client', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register New Client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            name="code"
            type="number"
            value={formData.code}
            onChange={handleChange}
            placeholder="123"
            required
          />
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastname">Lastname</Label>
          <Input
            id="lastname"
            name="lastname"
            type="text"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="123456789"
            required
          />
        </div>
        <Button type="submit" className="w-full">Create Client</Button>
      </form>
    </div>
  );
}
