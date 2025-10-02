
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ClientsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ClientsSearch = ({ searchTerm, onSearchChange }: ClientsSearchProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Search className="h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search clients by name, email, or phone..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};

export default ClientsSearch;
