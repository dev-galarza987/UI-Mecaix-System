import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getClientById, updateClient, type Client } from '../../services/clientService';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateForm() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const clientCode = Number(code);
  
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    phone: ''
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await getClientById(clientCode);
        setFormData({
          name: client.nombre || '',
          lastname: client.apellido || '',
          phone: client.telefono || ''
        });
      } catch (error) {
        console.error('Failed to fetch client', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (clientCode) {
      fetchClient();
    }
  }, [clientCode]);

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
      const clientData: Partial<Client> = {
        nombre: formData.name,
        apellido: formData.lastname,
        telefono: formData.phone
      };
      await updateClient(clientCode, clientData);
      navigate('/clients/list');
    } catch (error) {
      console.error('Failed to update client', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => navigate('/clients/list')} className="mb-4">
        Back to List
      </Button>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Client</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full">Update Client</Button>
        </form>
      </div>
    </div>
  );
}
