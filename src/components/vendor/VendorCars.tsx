import React, { useMemo, useState } from 'react';
import CarForm from './CarForm';
import CarDetailsModal from './CarDetailsModal';
import CarsImportModal from './cars/CarsImportModal';
import { useToast } from '@/hooks/use-toast';
import CarsHeader from './cars/CarsHeader';
import CarsGridView from './cars/CarsGridView';
import CarsListView from './cars/CarsListView';
import CarsTableView from './cars/CarsTableView';
import CarsEmptyState from './cars/CarsEmptyState';
import { useGetAllCars, useDeleteCar } from '@/hooks/vendor/useVendorCar';
import { useQueryClient } from '@tanstack/react-query';

const VendorCars = () => {
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [viewingCar, setViewingCar] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch cars via normal API hook
  const { data, isLoading, error } = useGetAllCars();
  const deleteMutation = useDeleteCar();

  // Map API response to UI CarData shape without changing UI
  const cars = useMemo(() => {
    const rawList =
      (data as any)?.data?.data?.vendorCars ||
      (data as any)?.data?.vendorCars ||
      (data as any)?.vendorCars ||
      [];

    const extractYear = (text?: string) => {
      if (!text) return new Date().getFullYear();
      const match = text.match(/(20\d{2}|19\d{2})/);
      return match ? parseInt(match[1], 10) : new Date().getFullYear();
    };

    return (rawList as any[]).map((c) => ({
      id: (c?.id ?? '').toString(),
      name: c?.name ?? '',
      brand: c?.model ? String(c.model).split(' ')[0] : '',
      model: c?.model ?? '',
      year: extractYear(c?.name),
      type: 'sedan',
      seats: 5,
      fuel_type: 'petrol',
      transmission: 'automatic',
      daily_rate: c?.pricePerDay ?? 0,
      weekly_rate: undefined,
      monthly_rate: undefined,
      is_available: Boolean(c?.status),
      is_featured: false,
      images: Array.isArray(c?.imageUrls) ? c.imageUrls : [],
      features: [],
      pickup_locations: [],
      condition: 'excellent',
      color: undefined,
      license_plate: undefined,
      mileage_limit: undefined,
      deposit_amount: undefined,
    }));
  }, [data]);

  const handleDuplicate = async (car: any) => {
    // Duplicate via API is not defined; keep UI unchanged and inform user
    toast({
      title: 'Not available',
      description: 'Duplicate action is not available at the moment.',
    });
  };

  const handleEdit = (car: any) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const handleView = (car: any) => {
    setViewingCar(car);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCar(null);
  };

  const handleAddCar = () => {
    // User is already guarded; no auth checks
    setShowForm(true);
  };

  const handleImportCars = () => {
    // User is already guarded; no auth checks
    setShowImportModal(true);
  };

  const handleImportSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['vendor', 'cars'] });
    const description = 'Cars have been imported successfully';
    toast({ title: 'Import Successful', description });
  };

  const handleDelete = async (carId: string) => {
    if (confirm('Are you sure you want to delete this car?')) {
      deleteMutation.mutate(carId);
    }
  };

  const renderCurrentView = () => {
    const viewProps = {
      cars,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onDuplicate: handleDuplicate,
      onView: handleView,
      isDeleting: deleteMutation.isPending,
    } as any;

    switch (viewMode) {
      case 'grid':
        return <CarsGridView {...viewProps} />;
      case 'list':
        return <CarsListView {...viewProps} />;
      case 'table':
        return <CarsTableView {...viewProps} />;
      default:
        return <CarsGridView {...viewProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading cars...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CarsHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddCar={handleAddCar}
        onImportCars={handleImportCars}
      />

      {(error || !cars || cars.length === 0) ? (
        <CarsEmptyState
          currentUser={{}}
          onAddCar={handleAddCar}
          error={error}
        />
      ) : (
        renderCurrentView()
      )}

      {showForm && (
        <CarForm
          car={editingCar}
          onClose={handleFormClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['vendor', 'cars'] });
            handleFormClose();
          }}
        />
      )}

      {viewingCar && (
        <CarDetailsModal car={viewingCar} onClose={() => setViewingCar(null)} />
      )}

      {showImportModal && (
        <CarsImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
          vendorId=""
        />
      )}
    </div>
  );
};

export default VendorCars;
