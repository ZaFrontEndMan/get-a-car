
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Calendar, CreditCard } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking?: string;
  status: string;
  joinedDate: string;
}

interface ClientsStatsProps {
  clients: Client[];
}

const ClientsStats = ({ clients }: ClientsStatsProps) => {
  const activeClients = clients.filter(client => client.totalBookings > 0).length;
  const totalBookings = clients.reduce((sum, client) => sum + client.totalBookings, 0);
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Total Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clients.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <UserCheck className="h-4 w-4 mr-2" />
            Active Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClients}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Total Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            SAR {totalRevenue.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsStats;
