import { useState, useRef } from "react";
import { Bell, Search, X, Camera, Check, Package, TrendingUp, AlertTriangle, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

const NOTIFICATIONS = [
  { id: 1, icon: AlertTriangle, color: "text-amber-500 bg-amber-50", title: "Low stock alert", body: "Green Spinach is below 30 units.", time: "2 min ago", read: false },
  { id: 2, icon: ShoppingCart, color: "text-blue-500 bg-blue-50", title: "New order placed", body: "Organic Garlic order received.", time: "15 min ago", read: false },
  { id: 3, icon: TrendingUp, color: "text-green-500 bg-green-50", title: "Sales milestone", body: "₹50,000 revenue reached today!", time: "1 hr ago", read: true },
  { id: 4, icon: Package, color: "text-purple-500 bg-purple-50", title: "Procurement received", body: "Green Chillies marked as received.", time: "3 hr ago", read: true },
];

export function Header() {
  const { userProfile, setUserProfile } = useAppStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [draft, setDraft] = useState({ name: "", role: "" });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const openProfile = () => {
    setDraft({ name: userProfile.name, role: userProfile.role });
    setAvatarPreview(null);
    setProfileOpen(true);
  };

  const saveProfile = () => {
    setUserProfile({
      name: draft.name || userProfile.name,
      role: draft.role || userProfile.role,
      avatarUrl: avatarPreview ?? userProfile.avatarUrl,
    });
    setProfileOpen(false);
  };

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const initials = userProfile.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-md relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products or orders..."
          className="pl-10 bg-card border-border/50 rounded-xl shadow-sm focus-visible:ring-primary/20 h-11"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              <Bell className="w-6 h-6" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background px-0.5"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border border-border/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                  Mark all read
                </button>
              )}
            </div>
            <div className="divide-y divide-border/40 max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/40 ${!n.read ? "bg-primary/[0.03]" : ""}`}
                >
                  <div className={`p-2 rounded-xl shrink-0 h-fit ${n.color}`}>
                    <n.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold truncate">{n.title}</p>
                      {!n.read && <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {notifications.every(n => n.read) && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Check className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                You're all caught up!
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Profile */}
        <div
          className="flex items-center gap-3 border-l border-border pl-6 cursor-pointer group"
          onClick={openProfile}
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{userProfile.name}</p>
            <p className="text-xs text-muted-foreground">{userProfile.role}</p>
          </div>
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
              <AvatarImage src={userProfile.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-background rounded-full flex items-center justify-center border border-border">
              <Camera className="w-2.5 h-2.5 text-muted-foreground" />
            </span>
          </div>
        </div>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-primary/10">
                  <AvatarImage src={avatarPreview ?? userProfile.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary hover:underline"
              >
                Change photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarFile(f); }}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Name</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))}
                className="rounded-xl h-11"
                placeholder="e.g. Admin User"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Role</Label>
              <Input
                value={draft.role}
                onChange={(e) => setDraft(d => ({ ...d, role: e.target.value }))}
                className="rounded-xl h-11"
                placeholder="e.g. Store Manager"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setProfileOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 rounded-xl" onClick={saveProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
