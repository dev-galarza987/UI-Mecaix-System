import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getClientStats } from '../../services/clientService';
import type { ClientStats } from '../../services/clientService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

const ClientStatsComponent: React.FC = () => {
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getClientStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading client stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cargando estadísticas...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900">Estadísticas de Clientes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Inactivos</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactivos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Edad Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.edadPromedio} años</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Género</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Masculino</span>
                <span className="font-semibold">{stats.porGenero.masculino}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Femenino</span>
                <span className="font-semibold">{stats.porGenero.femenino}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Otro</span>
                <span className="font-semibold">{stats.porGenero.otro}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Método de Contacto Preferido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Teléfono</span>
                <span className="font-semibold">{stats.porMetodoContacto.telefono}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Email</span>
                <span className="font-semibold">{stats.porMetodoContacto.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Ambos</span>
                <span className="font-semibold">{stats.porMetodoContacto.ambos}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ciudades Más Comunes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.ciudadesMasComunes.slice(0, 5).map((ciudad, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{ciudad.ciudad}</span>
                <span className="font-semibold">{ciudad.count} clientes</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientStatsComponent;
export { ClientStatsComponent as ClientStats };