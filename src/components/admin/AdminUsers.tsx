
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminUsers = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
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
          <h2 className="text-2xl font-bold">{t('usersManagement')}</h2>
          <p className="text-gray-600">{t('manageRegisteredUsers')}</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('addUser')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('users')}</CardTitle>
          <CardDescription>
            {t('totalUsers')}: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'gap-reverse' : ''}`}>
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('searchUsers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('name')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('contact')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('location')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('license')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('joined')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{t('userIdShort')}: {user.id.slice(0, 8)}...</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {user.phone && (
                          <div className={`flex items-center text-sm ${isRTL ? 'gap-reverse' : ''}`}>
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center text-sm ${isRTL ? 'gap-reverse' : ''}`}>
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.city || t('noLocation')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.driver_license_number ? (
                        <Badge variant="secondary">{user.driver_license_number}</Badge>
                      ) : (
                        <span className="text-gray-400">{t('noLicense')}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString(isRTL ? 'ar' : 'en')}
                    </TableCell>
                    <TableCell>
                      <div className={`flex gap-2 ${isRTL ? 'gap-reverse' : ''}`}>
                        <Button variant="outline" size="sm">
                          {t('view')}
                        </Button>
                        <Button variant="outline" size="sm">
                          {t('edit')}
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

export default AdminUsers;
