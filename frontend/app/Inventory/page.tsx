"use client";

import InventoryManager from "@/components/layout/Inventory"; // Use correct path here
import "../Inventory/Inventory.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function InventoryPage() {
  return (
    <div>
      <Header />
      <h1 className="header">Inventory Management</h1>
      <InventoryManager />
      <Footer />
    </div>
  );
}
