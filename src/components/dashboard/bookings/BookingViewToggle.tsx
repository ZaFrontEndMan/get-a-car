import React from "react";
import { Grid3X3, List, Table } from "lucide-react";

interface BookingViewToggleProps {
  viewMode: "grid" | "list" | "table";
  onViewModeChange: (mode: "grid" | "list" | "table") => void;
}

const BookingViewToggle = ({
  viewMode,
  onViewModeChange,
}: BookingViewToggleProps) => {
  return (
    <div className="hidden md:flex items-center gap-2 bg-white rounded-lg border p-1">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`p-2 rounded-md transition-all ${
          viewMode === "grid"
            ? "bg-primary text-white shadow-sm"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`}
      >
        <Grid3X3 className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`p-2 rounded-md transition-all ${
          viewMode === "list"
            ? "bg-primary text-white shadow-sm"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`}
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewModeChange("table")}
        className={`p-2 rounded-md transition-all ${
          viewMode === "table"
            ? "bg-primary text-white shadow-sm"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`}
      >
        <Table className="h-4 w-4" />
      </button>
    </div>
  );
};

export default BookingViewToggle;
