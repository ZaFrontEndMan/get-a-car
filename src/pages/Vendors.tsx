import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import VendorCard from '../components/VendorCard';
import { supabase } from '../integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
const VendorsContent = () => {
  const {
    t
  } = useLanguage();
  const [vendors, setVendors] = useState<any[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 9;
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from('vendors').select(`
            *,
            cars (id),
            branches (id)
          `);
        if (error) {
          console.error('Error fetching vendors:', error);
        } else {
          setVendors(data);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };
  const filteredVendors = vendors?.filter(vendor => vendor.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const processedVendors = vendors?.map(vendor => ({
    id: vendor.id,
    name: vendor.name,
    rating: vendor.rating || 0,
    image: vendor.logo_url || '/uploads/984c47f8-006e-44f4-8059-24f7f00bc865.png',
    verified: vendor.verified || false,
    carsCount: vendor.cars?.length || 0,
    branchCount: vendor.branches?.length || 0,
    location: vendor.location || 'Location not specified'
  })) || [];
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = processedVendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const totalPages = Math.ceil(processedVendors.length / vendorsPerPage);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading vendors...</span>
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8 flex items-center">
            <Input type="text" placeholder={t('searchVendors')} value={searchTerm} onChange={handleSearchChange} className="rounded-full py-3 px-6 w-full md:w-1/2 lg:w-1/3 shadow-sm focus:ring-primary focus:border-primary" />
            <Button variant="outline" size="icon" className="-ml-10 rounded-full mx-[19px]">
              <Search className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVendors?.map(vendor => <VendorCard key={vendor.id} vendor={vendor} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && <div className="flex justify-center mt-8">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="mr-2">
                {t('previous')}
              </Button>
              <Button variant="outline" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                {t('next')}
              </Button>
            </div>}
        </div>
      </div>

      <Footer />
      <MobileNav />
    </div>;
};
const Vendors = () => {
  return <LanguageProvider>
      <VendorsContent />
    </LanguageProvider>;
};
export default Vendors;