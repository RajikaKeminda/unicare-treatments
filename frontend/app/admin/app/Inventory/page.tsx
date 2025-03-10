"use client";

import InventoryManager from"@/components/layout/Inventory.js"
import "../Inventory/Inventory.css";  // Adjust the path accordingly

import Header from"@/components/layout/Header"


export default function InventoryPage(){

return(

  <div>
  <Header/>
  <InventoryManager/>
  
  </div>
);

}