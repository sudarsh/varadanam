import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Tag, ShoppingBag, LogOut, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/offerings', label: 'Offerings', icon: Tag },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="px-5 py-5">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sm tracking-wide text-sidebar-foreground">Varadanam</span>
          <span className="text-xs text-sidebar-foreground/40 font-medium uppercase tracking-widest">Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-1">
        <SidebarMenu>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <SidebarMenuItem key={to}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary font-medium rounded-md'
                      : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 rounded-md transition-colors'
                  }
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="text-sm">{label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-2 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md hover:bg-sidebar-accent/60 transition-colors text-left">
              <div className="size-7 rounded-md bg-sidebar-primary/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-sidebar-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</span>
                <span className="text-[11px] text-sidebar-foreground/40 truncate">{user?.email}</span>
              </div>
              <ChevronUp className="size-3.5 text-sidebar-foreground/40 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52 backdrop-blur-xl bg-popover/80">
            <DropdownMenuItem onClick={handleLogout} className="text-destructive gap-2">
              <LogOut className="size-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="h-12 bg-background flex items-center px-4 gap-2 shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </header>
          <main className="flex-1 px-8 py-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
