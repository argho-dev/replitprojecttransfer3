import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
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
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-border pl-6">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">Store Manager</p>
          </div>
          <Avatar className="h-10 w-10 ring-2 ring-primary/20 cursor-pointer">
            <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
