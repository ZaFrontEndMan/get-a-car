
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import Navbar from '../components/layout/navbar/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import VendorProfileHeader from '../components/VendorProfileHeader';
import VendorCarsList from '../components/VendorCarsList';
import VendorFilters from '../components/VendorFilters';
import VendorPoliciesDisplay from '../components/VendorPoliciesDisplay';

const VendorDetailsContent = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [vendor, setVendor] = useState<any>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as number[],
    carType: '',
    seats: '',
    fuel: '',
    transmission: '',
    brand: '',
    location: ''
  });

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch vendor data
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendors')
          .select('*')
          .eq('id', id)
          .single();

        if (vendorError) {
          console.error('Error fetching vendor:', vendorError);
          return;
        }

        // Fetch cars for this vendor
        const { data: carsData, error: carsError } = await supabase
          .from('cars')
          .select(`
            *,
            branches (
              name
            )
          `)
          .eq('vendor_id', id)
          .eq('is_available', true);

        if (carsError) {
          console.error('Error fetching cars:', carsError);
          return;
        }

        // Format vendor data to match expected structure
        const formattedVendor = {
          id: vendorData.id,
          name: vendorData.name,
          logo: vendorData.logo_url || '/uploads/984c47f8-006e-44f4-8059-24f7f00bc865.png',
          manager: 'General Manager', // Can be updated when manager data is available
          phone: vendorData.phone || 'Not provided',
          email: vendorData.email,
          address: vendorData.location || 'Location not specified',
          rating: vendorData.rating || 0,
          reviews: vendorData.total_reviews || 0,
          verified: vendorData.verified || false,
          carsCount: carsData?.length || 0,
          joinedDate: new Date(vendorData.created_at).getFullYear().toString(),
          description: vendorData.description || 'No description available',
          workingHours: 'Sunday - Thursday: 8:00 AM - 10:00 PM\nFriday - Saturday: 10:00 AM - 11:00 PM'
        };

        setVendor(formattedVendor);
        setCars(carsData || []);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [id]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Loading vendor details...</div>
            </div>
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Vendor not found</div>
            </div>
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 rtl:space-x-reverse">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li><span className="text-gray-500">/</span></li>
                <li>
                  <Link to="/vendors" className="text-gray-500 hover:text-primary transition-colors">
                    Vendors
                  </Link>
                </li>
                <li><span className="text-gray-500">/</span></li>
                <li className="text-primary font-medium">{vendor?.name}</li>
              </ol>
            </nav>
          </div>

          {/* Vendor Profile Header */}
          <div className="mb-8">
            <VendorProfileHeader vendor={vendor} />
          </div>

          {/* Vendor Policies Section */}
          <div className="mb-8">
            <VendorPoliciesDisplay 
              vendorId={vendor.id}
              maxPolicies={10}
            />
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <div className="hidden lg:block flex-shrink-0" style={{ width: '200px' }}>
              <div className="sticky top-24">
                <VendorFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </div>

            {/* Cars List */}
            <div className="flex-1">
              <VendorCarsList 
                vendorId={vendor.id} 
                filters={filters} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage}
                cars={cars}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

const VendorDetails = () => {
  return (
    <LanguageProvider>
      <VendorDetailsContent />
    </LanguageProvider>
  );
};

export default VendorDetails;
