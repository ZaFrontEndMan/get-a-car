
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

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

interface ClientsTableProps {
  clients: Client[];
}

const ClientsTable = ({ clients }: ClientsTableProps) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('noClientsFound')}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('clientInfo')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('contact')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('activity')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('totalSpent')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('lastBooking')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('joined')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('status')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map(client => (
            <TableRow key={client.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{client.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm">{client.email}</div>
                  <div className="text-sm text-gray-600">
                    {client.phone || t('noPhone')}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={client.totalBookings > 0 ? "default" : "secondary"}>
                  {client.totalBookings} {client.totalBookings === 1 ? t('bookings').slice(0, -1) : t('bookings')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {t('currency')} {client.totalSpent.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                {client.lastBooking 
                  ? new Date(client.lastBooking).toLocaleDateString(isRTL ? 'ar' : 'en')
                  : t('noBookings')
                }
              </TableCell>
              <TableCell>
                {new Date(client.joinedDate).toLocaleDateString(isRTL ? 'ar' : 'en')}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {t(client.status.toLowerCase())}
                </Badge>
              </TableCell>
              <TableCell>
                <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                  >
                    {t('viewDetails')}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
