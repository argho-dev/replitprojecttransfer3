import { useState } from "react";
import { useAppStore, Product } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Edit2, Search, Plus, Package, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion } from "framer-motion";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</Label>
      <div className="rounded-xl h-9 px-3 flex items-center bg-muted/40 text-xs text-muted-foreground font-mono border border-border/30 truncate">
        {value}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-sm font-bold text-foreground">{children}</span>
      <Separator className="flex-1" />
    </div>
  );
}

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
      const updated = {
        ...editingProduct,
        imageUrl: editingProduct.imageUrls[0] ?? editingProduct.imageUrl,
        updatedAt: new Date().toISOString(),
      };
      setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
      setIsDialogOpen(false);
      setEditingProduct(null);
    }
  };

  const updateField = <K extends keyof Product>(key: K, value: Product[K]) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [key]: value });
  };

  const updateAttribute = (key: "origin" | "shelfLife", value: string) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, attributes: { ...editingProduct.attributes, [key]: value } });
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
                  src={product.imageUrls[0] ?? product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-foreground shadow-sm">
                  {product.stock} in stock
                </div>
                {!product.active && (
                  <div className="absolute top-3 left-3 bg-destructive/90 text-destructive-foreground px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                    Inactive
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1">{product.name}</h3>
                    {product.isVeg && (
                      <span className="w-4 h-4 rounded-sm border-2 border-green-600 flex items-center justify-center flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-green-600" />
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-bold text-xl">₹{product.price}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-muted-foreground">{product.rating} ({product.ratingCount})</span>
                  </div>
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
        <DialogContent className="sm:max-w-2xl rounded-2xl p-0 overflow-hidden border-border/50 shadow-2xl">
          <div className="h-28 w-full relative bg-muted flex-shrink-0">
            {editingProduct && (editingProduct.imageUrls[0] ?? editingProduct.imageUrl) && (
              <img
                src={editingProduct.imageUrls[0] ?? editingProduct.imageUrl}
                className="w-full h-full object-cover opacity-40"
                alt=""
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute bottom-3 left-6">
              <DialogTitle className="text-xl font-display">Edit {editingProduct?.name}</DialogTitle>
            </div>
          </div>

          {editingProduct && (
            <ScrollArea className="max-h-[65vh]">
              <div className="px-6 pb-2 space-y-4">

                <SectionTitle>Read-only Info</SectionTitle>
                <div className="grid grid-cols-1 gap-3">
                  <ReadonlyField label="Product ID (_id)" value={editingProduct.id} />
                  <div className="grid grid-cols-2 gap-3">
                    <ReadonlyField label="Created At" value={new Date(editingProduct.createdAt).toLocaleString()} />
                    <ReadonlyField label="Updated At" value={new Date(editingProduct.updatedAt).toLocaleString()} />
                  </div>
                </div>

                <SectionTitle>Basic Info</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name">
                    <Input
                      value={editingProduct.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                    />
                  </Field>
                  <Field label="Local Name">
                    <Input
                      value={editingProduct.localName}
                      onChange={(e) => updateField("localName", e.target.value)}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                      placeholder="e.g. हरा सेब"
                    />
                  </Field>
                </div>
                <Field label="Description">
                  <Textarea
                    value={editingProduct.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="rounded-xl bg-secondary/50 focus-visible:bg-background resize-none"
                    rows={2}
                  />
                </Field>
                <div className="flex gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="isVeg"
                      checked={editingProduct.isVeg}
                      onCheckedChange={(v) => updateField("isVeg", v)}
                    />
                    <Label htmlFor="isVeg" className="text-sm font-medium">Is Veg</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="active"
                      checked={editingProduct.active}
                      onCheckedChange={(v) => updateField("active", v)}
                    />
                    <Label htmlFor="active" className="text-sm font-medium">Active</Label>
                  </div>
                </div>

                <SectionTitle>Pricing & Stock</SectionTitle>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Base Price (₹)">
                    <Input
                      type="number"
                      value={editingProduct.basePrice}
                      onChange={(e) => updateField("basePrice", Number(e.target.value))}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                    />
                  </Field>
                  <Field label="Selling Price (₹)">
                    <Input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => updateField("price", Number(e.target.value))}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                    />
                  </Field>
                  <Field label="Stock Qty">
                    <Input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => updateField("stock", Number(e.target.value))}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                    />
                  </Field>
                </div>
                <Field label="Unit Weight">
                  <Input
                    value={editingProduct.unitWeight}
                    onChange={(e) => updateField("unitWeight", e.target.value)}
                    className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                    placeholder="e.g. 500 gm, 1 kg, 1 L"
                  />
                </Field>

                <SectionTitle>Classification</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Type">
                    <Input
                      value={editingProduct.type}
                      onChange={(e) => updateField("type", e.target.value)}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                      placeholder="e.g. vegetable, fruit, dairy"
                    />
                  </Field>
                  <Field label="Category">
                    <Input
                      value={editingProduct.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                      placeholder="e.g. fruit, leafy, dairy"
                    />
                  </Field>
                </div>

                <SectionTitle>Media</SectionTitle>
                <Field label="Image URLs (one per line)">
                  <Textarea
                    value={editingProduct.imageUrls.join("\n")}
                    onChange={(e) =>
                      updateField("imageUrls", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))
                    }
                    className="rounded-xl bg-secondary/50 focus-visible:bg-background resize-none font-mono text-xs"
                    rows={3}
                    placeholder="https://..."
                  />
                </Field>
                {editingProduct.imageUrls.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {editingProduct.imageUrls.map((url, i) => (
                      <img key={i} src={url} alt="" className="w-14 h-14 rounded-lg object-cover border border-border" />
                    ))}
                  </div>
                )}
                <Field label="Image Color Value">
                  <Input
                    type="number"
                    value={editingProduct.imageColorValue}
                    onChange={(e) => updateField("imageColorValue", Number(e.target.value))}
                    className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background font-mono"
                  />
                </Field>

                <SectionTitle>Tags</SectionTitle>
                <Field label="Tags (comma separated)">
                  <Input
                    value={editingProduct.tags.join(", ")}
                    onChange={(e) =>
                      updateField("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))
                    }
                    className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                    placeholder="e.g. fresh, healthy, salad"
                  />
                  {editingProduct.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {editingProduct.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="rounded-full text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </Field>
                <Field label="Search Tags (comma separated)">
                  <Input
                    value={editingProduct.searchTags.join(", ")}
                    onChange={(e) =>
                      updateField("searchTags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))
                    }
                    className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                    placeholder="e.g. green apple, seb"
                  />
                  {editingProduct.searchTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {editingProduct.searchTags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="rounded-full text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </Field>

                <SectionTitle>Ratings</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Rating (0–5)">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editingProduct.rating}
                      onChange={(e) => updateField("rating", Number(e.target.value))}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                    />
                  </Field>
                  <Field label="Rating Count">
                    <Input
                      type="number"
                      value={editingProduct.ratingCount}
                      onChange={(e) => updateField("ratingCount", Number(e.target.value))}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                    />
                  </Field>
                </div>

                <SectionTitle>Attributes</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Origin">
                    <Input
                      value={editingProduct.attributes.origin}
                      onChange={(e) => updateAttribute("origin", e.target.value)}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                      placeholder="e.g. Himachal, Maharashtra"
                    />
                  </Field>
                  <Field label="Shelf Life">
                    <Input
                      value={editingProduct.attributes.shelfLife}
                      onChange={(e) => updateAttribute("shelfLife", e.target.value)}
                      className="rounded-xl h-9 bg-secondary/50 focus-visible:bg-background"
                      placeholder="e.g. 2 weeks, 3 days"
                    />
                  </Field>
                </div>

                <div className="h-2" />
              </div>
            </ScrollArea>
          )}

          <div className="px-6 py-4 border-t border-border/50 bg-background">
            <DialogFooter>
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
