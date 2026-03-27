import { useState } from "react";
import { useAppStore, Product } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Search, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function Products() {
  const { products, setProducts } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setIsDialogOpen(false);
      setEditingProduct(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Products Inventory</h2>
          <p className="text-muted-foreground mt-1">Manage pricing and stock levels.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-xl border-border/50 bg-card"
            />
          </div>
          <Button className="rounded-xl shadow-lg shadow-primary/20 hover-elevate">
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Card className="overflow-hidden border-border/50 rounded-2xl hover:border-primary/30 transition-all duration-300 hover:shadow-xl group">
              <div className="h-48 overflow-hidden relative bg-muted">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-foreground shadow-sm">
                  {product.stock} in stock
                </div>
              </div>
              <CardContent className="p-5">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-foreground line-clamp-1">{product.name}</h3>
                  <p className="text-primary font-bold text-xl mt-1">₹{product.price}</p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors group/btn"
                  onClick={() => handleEditClick(product)}
                >
                  <Edit2 className="w-4 h-4 mr-2 text-muted-foreground group-hover/btn:text-current" />
                  Edit Item
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-0 overflow-hidden border-border/50 shadow-2xl">
          <div className="h-32 w-full relative bg-muted">
            {editingProduct?.imageUrl && (
              <img src={editingProduct.imageUrl} className="w-full h-full object-cover opacity-50" alt="" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          
          <div className="px-6 pb-6 pt-2">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-display">Edit {editingProduct?.name}</DialogTitle>
            </DialogHeader>
            
            {editingProduct && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-muted-foreground font-semibold">Product Name</Label>
                  <Input 
                    id="name" 
                    value={editingProduct.name} 
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="rounded-xl h-11 bg-secondary/50 focus-visible:bg-background"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-muted-foreground font-semibold">Price (₹)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      value={editingProduct.price} 
                      onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                      className="rounded-xl h-11 bg-secondary/50 focus-visible:bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-muted-foreground font-semibold">Stock Qty</Label>
                    <Input 
                      id="stock" 
                      type="number" 
                      value={editingProduct.stock} 
                      onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                      className="rounded-xl h-11 bg-secondary/50 focus-visible:bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-muted-foreground font-semibold">Image URL</Label>
                  <Input 
                    id="image" 
                    value={editingProduct.imageUrl} 
                    onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                    className="rounded-xl h-11 bg-secondary/50 focus-visible:bg-background"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter className="mt-8">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleSave} className="rounded-xl shadow-lg shadow-primary/20">
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
