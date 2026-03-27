import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Package, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const chartData = [
  { name: "Mon", revenue: 4000 },
  { name: "Tue", revenue: 3000 },
  { name: "Wed", revenue: 5000 },
  { name: "Thu", revenue: 4500 },
  { name: "Fri", revenue: 6000 },
  { name: "Sat", revenue: 8000 },
  { name: "Sun", revenue: 7500 },
];

export default function Dashboard() {
  const { products, procurementItems } = useAppStore();
  
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock < 50).length;
  const pendingOrders = procurementItems.filter(p => p.status === "Pending").length;
  
  const stats = [
    { title: "Total Products", value: totalProducts, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Low Stock Alerts", value: lowStockCount, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Pending Procurements", value: pendingOrders, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Weekly Revenue", value: "₹38,000", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening in your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold font-display text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 border-border/50 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-border/30 pb-4">
            <CardTitle className="text-lg font-bold">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dx={-10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  formatter={(value: number) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border/50 shadow-sm rounded-2xl flex flex-col">
          <CardHeader className="border-b border-border/30 pb-4">
            <CardTitle className="text-lg font-bold flex justify-between items-center">
              <span>Low Stock Items</span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">{lowStockCount} items</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            <div className="divide-y divide-border/30">
              {products.filter(p => p.stock < 50).map((product) => (
                <div key={product.id} className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-border" />
                    <div>
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">₹{product.price} / unit</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-600">{product.stock}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">In Stock</p>
                  </div>
                </div>
              ))}
              {lowStockCount === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>All stock levels are healthy.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
