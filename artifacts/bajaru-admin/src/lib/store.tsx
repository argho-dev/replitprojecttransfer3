import React, { createContext, useContext, useState, ReactNode } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
};

export type ProcurementItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  imageUrl: string;
  date: string;
  status: "Pending" | "Received";
};

type AppContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  procurementItems: ProcurementItem[];
  setProcurementItems: React.Dispatch<React.SetStateAction<ProcurementItem[]>>;
};

const initialProducts: Product[] = [
  { id: "1", name: "Fresh Tomatoes", price: 40, stock: 150, imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=500&fit=crop" },
  { id: "2", name: "Red Onions", price: 35, stock: 200, imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&h=500&fit=crop" },
  { id: "3", name: "Potatoes", price: 25, stock: 350, imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&h=500&fit=crop" },
  { id: "4", name: "Bananas (Robusta)", price: 60, stock: 80, imageUrl: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&h=500&fit=crop" },
  { id: "5", name: "Fuji Apples", price: 120, stock: 45, imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fa6c?w=500&h=500&fit=crop" },
  { id: "6", name: "Orange Carrots", price: 50, stock: 90, imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop" },
  { id: "7", name: "Green Spinach", price: 20, stock: 30, imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop" },
  { id: "8", name: "Whole Milk 1L", price: 65, stock: 120, imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=500&fit=crop" },
];

const initialProcurement: ProcurementItem[] = [
  { id: "101", name: "Organic Garlic", quantity: 50, unit: "kg", imageUrl: "https://images.unsplash.com/photo-1540148426946-57ac8fd4501a?w=150&h=150&fit=crop", date: "2024-05-12", status: "Pending" },
  { id: "102", name: "Green Chillies", quantity: 15, unit: "kg", imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119fddcd?w=150&h=150&fit=crop", date: "2024-05-11", status: "Received" },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [procurementItems, setProcurementItems] = useState<ProcurementItem[]>(initialProcurement);

  return (
    <AppContext.Provider value={{ products, setProducts, procurementItems, setProcurementItems }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
