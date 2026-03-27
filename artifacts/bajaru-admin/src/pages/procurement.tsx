import { useState } from "react";
import { useAppStore, ProcurementItem } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, CheckCircle2, Clock, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Procurement() {
  const { procurementItems, setProcurementItems } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    imageUrl: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity) return;

    const newItem: ProcurementItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=500&fit=crop", // Default fresh produce image
      date: new Date().toISOString().split('T')[0],
      status: "Pending"
    };

    setProcurementItems([newItem, ...procurementItems]);
    setFormData({ name: "", quantity: "", unit: "kg", imageUrl: "" });
  };

  const markReceived = (id: string) => {
    setProcurementItems(procurementItems.map(item => 
      item.id === id ? { ...item, status: "Received" } : item
    ));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Procurement</h2>
        <p className="text-muted-foreground mt-1">Order new supplies and manage incoming inventory.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="xl:col-span-1">
          <Card className="border-border/50 shadow-md rounded-2xl sticky top-28">
            <CardHeader className="bg-primary/5 border-b border-primary/10 rounded-t-2xl pb-4">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Truck className="w-5 h-5" />
                New Order Request
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">Item Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Organic Tomatoes" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="rounded-xl h-11"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="font-semibold">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="rounded-xl h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit" className="font-semibold">Unit</Label>
                    <Select value={formData.unit} onValueChange={(val) => setFormData({...formData, unit: val})}>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="gm">Grams (gm)</SelectItem>
                        <SelectItem value="litre">Litres (L)</SelectItem>
                        <SelectItem value="pcs">Pieces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="font-semibold">Image URL (Optional)</Label>
                  <Input 
                    id="image" 
                    placeholder="https://..." 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="rounded-xl h-11"
                  />
                </div>

                <Button type="submit" className="w-full rounded-xl h-12 mt-2 shadow-lg shadow-primary/20 text-md font-semibold hover-elevate">
                  <Plus className="w-5 h-5 mr-2" />
                  Place Order
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display">Recent Orders</h3>
            <div className="text-sm text-muted-foreground">
              Total: {procurementItems.length} items
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {procurementItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden border-border/50 rounded-2xl hover:shadow-md transition-all group">
                  <div className="flex p-4 gap-4 h-full">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-muted border border-border/50">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col flex-1 py-1 justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-base line-clamp-1 pr-2">{item.name}</h4>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md shrink-0 ${
                            item.status === 'Received' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">Order Date: {item.date}</p>
                      </div>
                      
                      <div className="flex items-end justify-between mt-3">
                        <div className="text-lg font-bold font-display text-foreground">
                          {item.quantity} <span className="text-sm font-normal text-muted-foreground">{item.unit}</span>
                        </div>
                        
                        {item.status === 'Pending' && (
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="rounded-lg h-8 text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
                            onClick={() => markReceived(item.id)}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Mark Received
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            
            {procurementItems.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-16 bg-card border border-dashed border-border/60 rounded-2xl">
                <Truck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No procurement orders yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
