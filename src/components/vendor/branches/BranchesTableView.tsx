import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  manager_name?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  created_at: string;
}

interface BranchesTableViewProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (branchId: string) => void;
  isDeleting: boolean;
}

const BranchesTableView = ({
  branches,
  onEdit,
  onDelete,
  isDeleting,
}: BranchesTableViewProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isRTL ? "text-right" : "text-left"}>
                {t("branchName")}
              </TableHead>
              <TableHead className={isRTL ? "text-right" : "text-left"}>
                {t("address")}
              </TableHead>
              <TableHead className={isRTL ? "text-right" : "text-left"}>
                {t("manager")}
              </TableHead>
              <TableHead className={isRTL ? "text-right" : "text-left"}>
                {t("email")}
              </TableHead>
              <TableHead className={isRTL ? "text-right" : "text-left"}>
                {t("status")}
              </TableHead>
             
              <TableHead className={isRTL ? "text-right" : "text-left"}>
                {t("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.branchName}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{branch.city}</div>
                    <div className="text-sm text-gray-500">
                      {branch.address}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{branch.managerName || t("notAvailable")}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {branch.phone && <div>{branch.phone}</div>}
                    {branch.email && (
                      <div className="text-gray-500">{branch.email}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={branch.is_active ? "default" : "secondary"}>
                    {branch.is_active ? t("active") : t("inactive")}
                  </Badge>
                </TableCell>

                <TableCell className={isRTL ? "text-left" : "text-right"}>
                  <div
                    className={`flex items-center justify-end gap-2 ${
                      isRTL ? "gap-reverse" : ""
                    }`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(branch)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(branch.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BranchesTableView;
