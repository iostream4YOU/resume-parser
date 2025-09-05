
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Upload, Database, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Upload & Parse", url: createPageUrl("Upload"), icon: Upload, description: "Upload resumes for parsing" },
  { title: "Parsed Results", url: createPageUrl("Results"), icon: Database, description: "View and download results" },
  { title: "Settings", url: createPageUrl("Settings"), icon: Settings, description: "Configure parsing options" },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 text-gray-900">
        <Sidebar className="bg-white border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">ResumeAI</h2>
                <p className="text-xs text-gray-500">Resume Parser</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                              isActive ? "bg-black text-white" : "hover:bg-gray-100 text-gray-800"
                            }`}
                          >
                            <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{item.title}</span>
                              <span className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}>
                                {item.description}
                              </span>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-md" />
              <h1 className="text-xl font-semibold">ResumeAI</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
