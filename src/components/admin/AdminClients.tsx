
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClientsData } from '@/hooks/useClientsData';
import ClientsStats from './clients/ClientsStats';
import ClientsTable from './clients/ClientsTable';
import ClientsSearch from './clients/ClientsSearch';

const AdminClients = () => {
  const { clients, loading } = useClientsData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Clients Management</h2>
          <p className="text-gray-600">Manage client accounts and their activity</p>
        </div>
      </div>

      <ClientsStats clients={clients} />

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>
            Complete list of client accounts and their activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientsSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />

          {filteredClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No clients found matching your search' : 'No clients found'}
            </div>
          ) : (
            <ClientsTable clients={filteredClients} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminClients;
