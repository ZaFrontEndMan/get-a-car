import React from "react";
import Navbar from "./navbar/Navbar";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

const PageLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
