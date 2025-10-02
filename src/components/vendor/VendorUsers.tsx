import React, { useState } from "react";
import { Plus, Edit, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserForm from "./UserForm";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext"; // Assuming this provides the t function

const staticVendorUsers = [
  {
    id: "c68b6025-50b1-48b7-817f-6cb5ffd527fd",
    role: "Employee",
    fullName: "string",
    phoneNumber: "0549861193",
    creationDate: "2025-09-28T20:18:40.2586526",
    email: "mahmoud44@gmail.com",
    branchName: "string",
    branchId: "2703B843-D1BB-48D8-9F21-8E77B97D3D5B",
  },
];

const VendorUsers = () => {
  const { t } = useLanguage(); // Assuming this hook provides the translation function
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [vendorUsers, setVendorUsers] = useState(staticVendorUsers);
  const { toast } = useToast();

  const handleEdit = (user: any) => {
    console.log("Editing user:", user);
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm(t("modal_confirm_delete"))) {
      setVendorUsers(vendorUsers.filter((user) => user.id !== userId));
      toast({
        title: t("success_title"),
        description: t("user_removed_success"),
      });
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    // Since data is static, we can't persist new users, but we can simulate success
    toast({
      title: t("success_title"),
      description: editingUser
        ? t("user_updated_success")
        : t("user_added_success"),
    });
    handleFormClose();
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "employee":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">{t("users_title")}</h2>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>{t("add_user")}</span>
        </Button>
      </div>

      {vendorUsers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("no_users")}
            </h3>
            <p className="text-gray-600 mb-4">{t("add_team_members")}</p>
            <Button onClick={handleAddUser}>{t("add_first_user")}</Button>
          </CardContent>
        </Card>
      )}

      {vendorUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendorUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.fullName}</CardTitle>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {t("email_label")}:
                  </span>
                  <span className="text-sm text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {t("phone_label")}:
                  </span>
                  <span className="text-sm text-gray-900">
                    {user.phoneNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {t("branch_label")}:
                  </span>
                  <span className="text-sm text-gray-900">
                    {user.branchName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {t("status_label")}:
                  </span>
                  <Badge variant="default">{t("status_active")}</Badge>
                </div>
                <div className="text-xs text-gray-500 pt-2 border-t">
                  {t("added_label")}:{" "}
                  {new Date(user.creationDate).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default VendorUsers;
