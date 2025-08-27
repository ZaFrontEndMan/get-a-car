
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePayments } from '../../hooks/usePayments';
import { CreditCard, Calendar, Car, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const PaymentsList: React.FC = () => {
  const { t, language } = useLanguage();
  const { payments, isLoading } = usePayments();
  const isRTL = language === 'ar';

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {language === 'ar' ? 'لا توجد مدفوعات' : 'No Payments'}
        </h3>
        <p className="text-gray-600">
          {language === 'ar' ? 'لم تقم بأي مدفوعات بعد' : "You haven't made any payments yet"}
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'completed': t('completed'),
      'pending': t('pending'),
      'failed': t('failed'),
      'paid': t('paid'),
      'refunded': t('refunded')
    };
    return statusMap[status.toLowerCase()] || status;
  };

  return (
    <div>
      <h1 className={`text-2xl font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {language === 'ar' ? 'سجل المدفوعات' : 'Payment History'} ({payments.length})
      </h1>
      
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className={`flex justify-between items-start mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                {getStatusIcon(payment.payment_status)}
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('currency')} {payment.amount}
                  </h3>
                  <p className="text-gray-600">
                    {payment.booking.car.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {language === 'ar' ? 'حجز رقم' : 'Booking'} #{payment.booking.booking_number}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.payment_status)}`}>
                {getStatusText(payment.payment_status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <CreditCard className="h-4 w-4 text-gray-400" />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="text-sm font-medium">{t('paymentMethod')}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {t(payment.payment_method.replace('_', ''))}
                  </p>
                </div>
              </div>

              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Calendar className="h-4 w-4 text-gray-400" />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="text-sm font-medium">{t('paymentDate')}</p>
                  <p className="text-sm text-gray-600">
                    {payment.payment_date 
                      ? format(new Date(payment.payment_date), 'MMM dd, yyyy')
                      : t('pending')
                    }
                  </p>
                </div>
              </div>

              {payment.transaction_id && (
                <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Car className="h-4 w-4 text-gray-400" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-medium">{t('transactionId')}</p>
                    <p className="text-sm text-gray-600 font-mono">
                      {payment.transaction_id}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsList;
