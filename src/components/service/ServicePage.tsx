import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ServicePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Service Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>List Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">View, edit, and delete existing services.</p>
            <Button onClick={() => navigate('/services/list')}>Go to List</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Create New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Add a new service to the system.</p>
            <Button onClick={() => navigate('/services/new')}>Create Service</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
