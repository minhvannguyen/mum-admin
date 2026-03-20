"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Music,
  ListMusic,
  Users,
  ChartArea,
  Tags,
  Flag,
  LogOut,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "./ui/button";
import { logout } from "@/lib/api/adminAuthApi";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "QL bài hát", url: "/admin/songs", icon: Music },
  { title: "Ql Playlists", url: "/admin/playlists", icon: ListMusic },
  { title: "Ql người dùng", url: "/admin/users", icon: Users },
  { title: "Ql thể loại", url: "/admin/genres", icon: Tags },
  { title: "QL đơn tố cáo", url: "/admin/reports", icon: Flag },
  { title: "Phân tích", url: "/admin/analytics", icon: ChartArea },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Sidebar className="border-r">
      {/* HEADER */}
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center">
          <Image
            src="/logo-dark.png"
            alt="MUM Admin"
            width={120}
            height={32}
            className="object-contain"
          />
        </div>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs uppercase text-muted-foreground">
            Management
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="px-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-10 rounded-lg"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>N</AvatarFallback>
            </Avatar>

            <div className="text-sm">
              <p className="font-medium">minh0</p>
              <p className="text-muted-foreground text-xs">Administrator</p>
            </div>
          </div>

          <Button onClick={handleLogout} variant="ghost" size="icon">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
