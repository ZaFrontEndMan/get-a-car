import React, { useState } from 'react';
import CarForm from './CarForm';
import CarDetailsModal from './CarDetailsModal';
import CarsImportModal from './cars/CarsImportModal';
import { useToast } from '@/hooks/use-toast';
import { useCarsData } from './cars/useCarsData';
import { supabase } from '@/integrations/supabase/client';
import CarsHeader from './cars/CarsHeader';
import CarsGridView from './cars/CarsGridView';
import CarsListView from './cars/CarsListView';
import CarsTableView from './cars/CarsTableView';
import CarsEmptyState from './cars/CarsEmptyState';

const VendorCars = () => {
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [viewingCar, setViewingCar] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const { toast } = useToast();

  const {
    cars,
    isLoading,
    error,
    currentUser,
    handleDelete,
    deleteMutation,
    queryClient
  } = useCarsData();

  const handleDuplicate = async (car: any) => {
    console.log('Duplicating car:', car);
    
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to duplicate cars",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the vendor ID for the current user
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', currentUser.id)
        .single();

      if (vendorError || !vendorData) {
        console.error('Vendor lookup error:', vendorError);
        toast({
          title: "Error",
          description: "Could not find vendor information",
          variant: "destructive",
        });
        return;
      }

      // Create a copy of the car data without the id and some unique fields
      const { id, created_at, updated_at, license_plate, branches, ...carData } = car;
      
      // Add "Copy" to the name to distinguish it and ensure vendor_id is set
      const duplicatedCar = {
        ...carData,
        name: `${car.name} (Copy)`,
        license_plate: null, // Clear license plate for duplicate
        vendor_id: vendorData.id, // Ensure the vendor_id is set correctly
      };

      console.log('Creating duplicate car:', duplicatedCar);

      const { data, error } = await supabase
        .from('cars')
        .insert(duplicatedCar)
        .select();

      if (error) {
        console.error('Duplicate error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to duplicate car",
          variant: "destructive",
        });
        return;
      }

      console.log('Car duplicated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['vendor-cars'] });
      toast({
        title: "Success",
        description: "Car duplicated successfully",
      });
    } catch (error) {
      console.error('Duplicate failed:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate car",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (car: any) => {
    console.log('Editing car:', car);
    setEditingCar(car);
    setShowForm(true);
  };

  const handleView = (car: any) => {
    console.log('Viewing car:', car);
    setViewingCar(car);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCar(null);
  };

  const handleAddCar = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add cars",
        variant: "destructive",
      });
      return;
    }
    setShowForm(true);
  };

  const handleImportCars = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to import cars",
        variant: "destructive",
      });
      return;
    }
    setShowImportModal(true);
  };

  const handleImportSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['vendor-cars'] });
    toast({
      title: "Import Successful",
      description: "Cars have been imported successfully",
    });
  };

  const renderCurrentView = () => {
    const viewProps = {
      cars,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onDuplicate: handleDuplicate,
      onView: handleView,
      isDeleting: deleteMutation.isPending
    };

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

      {(!currentUser || error || !cars || cars.length === 0) ? (
        <CarsEmptyState
          currentUser={currentUser}
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
            queryClient.invalidateQueries({ queryKey: ['vendor-cars'] });
            handleFormClose();
          }}
        />
      )}

      {viewingCar && (
        <CarDetailsModal
          car={viewingCar}
          onClose={() => setViewingCar(null)}
        />
      )}

      {showImportModal && currentUser && (
        <CarsImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
          vendorId={currentUser.id}
        />
      )}
    </div>
  );
};

export default VendorCars;
