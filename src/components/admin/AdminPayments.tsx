
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, CreditCard, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminPayments = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          bookings(booking_number, customer_name, cars(name, brand))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'refunded':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.bookings?.booking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.bookings?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('paymentsManagement')}</h2>
          <p className="text-gray-600">{t('monitorPaymentTransactions')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              {t('totalPayments')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              {t('totalRevenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t('currency')} {payments
                .filter(p => p.payment_status === 'completed')
                .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.payment_status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('pending')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {payments.filter(p => p.payment_status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('payments')}</CardTitle>
          <CardDescription>
            {t('completeTransactionHistory')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center space-x-2 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('searchPayments')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('paymentInfo')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('booking')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('customer')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('method')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('amount')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('status')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('date')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                        {getStatusIcon(payment.payment_status)}
                        <div>
                          <div className="font-medium">
                            {payment.transaction_id || `PAY-${payment.id.slice(0, 8)}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {t('userIdShort')}: {payment.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {payment.bookings?.booking_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.bookings?.cars?.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {payment.bookings?.customer_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {payment.payment_method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {t('currency')} {parseFloat(payment.amount).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(payment.payment_status)}>
                        {t(payment.payment_status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {new Date(payment.created_at).toLocaleDateString(isRTL ? 'ar' : 'en')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(payment.created_at).toLocaleTimeString(isRTL ? 'ar' : 'en')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <Button variant="outline" size="sm">
                          {t('view')}
                        </Button>
                        <Button variant="outline" size="sm">
                          {t('receipt')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
