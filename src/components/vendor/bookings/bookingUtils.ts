import { Clock, CheckCircle, PlayCircle, PauseCircle, Car, XCircle } from 'lucide-react';

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  active: "نشط",
  InProgress: "قيد الاجراء",
  return_requested: "طلب استرجاع",
  completed: "تم إرجاع السيارة",
  cancelled: "ملغي",
};

export const getStatusConfig = (status: string) => {
  const statusConfigs = {
    'pending': { 
      label: bookingStatusLabels.pending, 
      variant: 'secondary' as const, 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      dotColor: 'bg-yellow-500'
    },
    'confirmed': { 
      label: bookingStatusLabels.confirmed, 
      variant: 'default' as const, 
      icon: CheckCircle, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      dotColor: 'bg-blue-500'
    },
    'active': { 
      label: bookingStatusLabels.active, 
      variant: 'default' as const, 
      icon: PlayCircle, 
      color: 'bg-green-100 text-green-800 border-green-200',
      dotColor: 'bg-green-500'
    },
    'in_progress': { 
      label: bookingStatusLabels.InProgress, 
      variant: 'default' as const, 
      icon: PauseCircle, 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      dotColor: 'bg-orange-500'
    },
    'InProgress': { 
      label: bookingStatusLabels.InProgress, 
      variant: 'default' as const, 
      icon: PauseCircle, 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      dotColor: 'bg-orange-500'
    },
    'return_requested': { 
      label: bookingStatusLabels.return_requested, 
      variant: 'destructive' as const, 
      icon: Car, 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      dotColor: 'bg-purple-500'
    },
    'completed': { 
      label: bookingStatusLabels.completed, 
      variant: 'default' as const, 
      icon: CheckCircle, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      dotColor: 'bg-blue-500'
    },
    'cancelled': { 
      label: bookingStatusLabels.cancelled, 
      variant: 'destructive' as const, 
      icon: XCircle, 
      color: 'bg-red-100 text-red-800 border-red-200',
      dotColor: 'bg-red-500'
    },
  };

  return statusConfigs[status as keyof typeof statusConfigs] || statusConfigs.pending;
};
