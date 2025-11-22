import React from "react";
import { Edit, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BranchCardProps {
  branch: any;
  onEdit: (branch: any) => void;
  isDeleting: boolean;
  t: any;
}

const BranchCard = ({ branch, onEdit, isDeleting, t }: BranchCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {branch.branchName}
            {branch.mainBranch && (
              <Badge variant="default" className="bg-green-600">
                {t("mainBranch")}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(branch)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-900">{branch.address}</p>
            <p className="text-sm text-gray-600">{branch.city}</p>
          </div>
        </div>
        {branch.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-900">{branch.phone}</span>
          </div>
        )}
        {branch.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-900">{branch.email}</span>
          </div>
        )}
        {branch.managerName && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600">
              {t("manager")}: {branch.managerName}
            </p>
          </div>
        )}
        {/* <div className="flex items-center justify-between pt-2">
          <Badge variant={branch.is_active ? "default" : "secondary"}>
            {branch.is_active ? t("active") : t("inactive")}
          </Badge>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default BranchCard;
