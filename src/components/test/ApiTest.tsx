import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ApiTest = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 [API TEST] Probando endpoint...');
      
      const url = 'http://localhost:4000/api/v1/clients';
      console.log('🌐 [API TEST] URL:', url);
      
      const response = await fetch(url);
      
      console.log('📊 [API TEST] Status:', response.status);
      console.log('📊 [API TEST] Headers:', response.headers);
      console.log('📊 [API TEST] OK:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const text = await response.text();
      console.log('📄 [API TEST] Raw response:', text);
      
      let data;
      try {
        data = JSON.parse(text);
        console.log('✅ [API TEST] Parsed JSON:', data);
      } catch (parseError) {
        console.error('❌ [API TEST] Error parsing JSON:', parseError);
        data = { error: 'Invalid JSON', raw: text };
      }
      
      setResponse(data);
      
    } catch (err) {
      console.error('❌ [API TEST] Error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Test API de Clientes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testApi} disabled={loading}>
          {loading ? 'Probando...' : 'Probar API'}
        </Button>
        
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {response && (
          <div className="p-4 bg-gray-100 border rounded">
            <strong>Respuesta:</strong>
            <pre className="mt-2 whitespace-pre-wrap text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTest;