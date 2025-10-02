
import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AdminQuickLoginProps {
  onAdminLogin: () => void;
}

const AdminQuickLogin = ({ onAdminLogin }: AdminQuickLoginProps) => {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Admin Access</span>
        </div>
        <button
          type="button"
          onClick={onAdminLogin}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
        >
          Use Admin Login
        </button>
      </div>
      <p className="text-xs text-blue-600 mt-1">talalkhomri@gmail.com / 786hafez786</p>
    </div>
  );
};

export default AdminQuickLogin;
