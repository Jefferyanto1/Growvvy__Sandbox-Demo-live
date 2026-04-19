"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";


import {
  Home, CheckSquare, Users, MessageSquare, FileText, Zap, BarChart, Settings, LifeBuoy, MessageCircle, Brain, Bell, ChevronDown, User, LogOut
  } from "lucide-react";

import { useState, useRef, useEffect } from "react";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);
  const [open, setOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/demo") return pathname === "/demo";
    return pathname.startsWith(href);
    
  };



  return (
    <div className="h-screen flex overflow-hidden">
    <aside className="w-[288px] bg-white h-screen px-[32px] border-r border-[#F3F5F7] overflow-y-auto">
  

  {/* Sidebar Header */}
  <div className="h-[80px] flex items-center">
    <div className="flex items-center gap-2">
      <img
        src="/growvvylogo.svg"
        className="h-43 w-148"
        alt="Growvvy logo"
      />
    </div>
  </div>

        {/* Main Menu */}
        <div className="mt-8 flex flex-col gap-2">
          <p className="mb-2 font-jakarta text-[12px] font-medium uppercase tracking-[0.02em] text-[#90A3BF]">
            Main Menu
          </p>

          <div className="flex flex-col gap-1">

          {/* Overview */}
            <div className="relative group">
              {/* Background */}
              <div
                className={`
                  absolute inset-y-0 left-[-16px] right-[-16px]
                  rounded-md transition-colors duration-150
                  ${
                    pathname === "/demo"
                       ? "bg-[#1A73E8]/15"
                      : "bg-transparent group-hover:bg-[#1A73E8]/10"
                  }
                `}
              />

              {/* Content */}
              <div
                className={`
                  relative z-10
                  flex items-center gap-3
                  py-2 rounded-md
                  font-jakarta text-[14px] font-medium tracking-[0.02em]
                  cursor-pointer
                  ${
                    pathname === "/demo"
                      ? "text-[#1A73E8]"
                      : "text-[#596780] group-hover:text-[#1A73E8]"
                  }
                `}
              >
                <Home size={18} />
                <span className="whitespace-nowrap">Overview</span>

                <span className="ml-2 text-[11px] leading-[14px] px-2 py-[3px] rounded-full bg-[#FFF4E5] text-[#B45309]">
                 Upcoming
                </span>
              </div>
            </div>
          
          {/* Action Centre */}
          <Link href="/demo/action-center">
            <div className="relative group">
              {/* Background */}
              <div
                className={`
                  absolute inset-y-0 left-[-16px] right-[-16px]
                  rounded-md transition-colors duration-150
                  ${
                    pathname.startsWith("/demo/action-center")
                     ? "bg-[#1A73E8]/15"
                    : "bg-transparent group-hover:bg-[#1A73E8]/10"
                  }
                `}
              />

              {/* Content */}
              <div
                className={`
                  relative z-10
                  flex items-center gap-3
                  py-2 rounded-md
                  font-jakarta text-[14px] font-medium tracking-[0.02em]
                  cursor-pointer
                  ${
                    pathname.startsWith("/demo/action-center")
                       ? "text-[#1A73E8]"
                      : "text-[#596780] group-hover:text-[#1A73E8]"
                  }
                `}
              >
                <CheckSquare size={18} />
                <span>Action center</span>
              </div>
            </div>
          </Link>

            
            {/* Leads */}
            <Link href="/demo/leads" className="relative group">
              {/* Background */}
              <div
                className={`
                  absolute inset-y-0 left-[-16px] right-[-16px]
                  rounded-md transition-colors duration-150
                  ${
                    pathname.startsWith("/demo/leads")
                     ? "bg-[#1A73E8]/15"
                    : "bg-transparent group-hover:bg-[#1A73E8]/10"
                  }
                `}
              />

              {/* Content */}
              <div
               className={`
                  relative z-10
                  flex items-center gap-3
                  py-2 rounded-md
                  font-jakarta text-[14px] font-medium tracking-[0.02em]
                  cursor-pointer
                  ${
                    pathname.startsWith("/demo/leads")
                       ? "text-[#1A73E8]"
                      : "text-[#596780] group-hover:text-[#1A73E8]"
                  }
                `}
              >

                <Users size={18} />
                <span>Leads</span>
              </div>
            </Link>

        </div> 
        </div>   


        {/* Tools */}
        <div className="mt-8 flex flex-col gap-2">
          <p className="mb-2 font-jakarta text-[12px] font-medium uppercase tracking-[0.02em] text-[#90A3BF]">
            Tools
          </p>

          <div className="flex flex-col gap-1">
          
            {/* MESSAGES_LIBRARY */}
            <Link href="/demo/messages">
              <div className="relative group">

                {/* Background */}
                <div
                  className={`
                    absolute inset-y-0 left-[-16px] right-[-16px]
                    rounded-md transition-colors duration-150
                    ${
                      pathname.startsWith("/demo/messages")
                      ? "bg-[#1A73E8]/15"
                      : "bg-transparent group-hover:bg-[#1A73E8]/10"
                    }
                  `}
                />

                {/* Content */}
                <div
                  className={`
                    relative z-10
                    flex items-center gap-3
                    py-2 rounded-md
                    font-jakarta text-[14px] font-medium tracking-[0.02em]
                    cursor-pointer
                    ${
                      pathname.startsWith("/demo/messages")
                        ? "text-[#1A73E8]"
                        : "text-[#596780] group-hover:text-[#1A73E8]"
                    }
                  `}
                >
                  <MessageSquare size={18} />
                  <span>Messages library</span>
                </div>

              </div>
            </Link>
            
            {/* GROWTH_ENGINE */}
            <Link href="/demo/growth-engine">
              <div className="relative group">

                {/* Background */}
                <div
                  className={`
                    absolute inset-y-0 left-[-16px] right-[-16px]
                    rounded-md transition-colors duration-150
                    ${
                      pathname.startsWith("/demo/growth-engine")
                      ? "bg-[#1A73E8]/15"
                      : "bg-transparent group-hover:bg-[#1A73E8]/10"
                    }
                  `}
                />

                {/* Content */}
                <div
                  className={`
                    relative z-10
                    flex items-center gap-3
                    py-2 rounded-md
                    font-jakarta text-[14px] font-medium tracking-[0.02em]
                    cursor-pointer
                    ${
                      pathname.startsWith("/demo/growth-engine")
                        ? "text-[#1A73E8]"
                        : "text-[#596780] group-hover:text-[#1A73E8]"
                    }
                  `}
                >
                  <Zap size={18} />
                  <span>Growth engine</span>
                </div>

              </div>
            </Link>

              {/* Content_OPS */}
                <div className="relative group">
                {/* Hover background (visual only) */}
                <div
                  className="
                    absolute inset-y-0 left-[-16px] right-[-16px]
                    rounded-md transition-colors duration-150
                    bg-transparent group-hover:bg-[#1A73E8]/10
                  "
                />

                {/* Content */}
                <div
                  className="
                    relative z-10
                    flex items-center gap-3 py-2
                    font-jakarta text-[14px] font-medium tracking-[0.02em]
                    text-[#596780] cursor-pointer
                    group-hover:text-[#1A73E8]
                  "
                >
                  <FileText size={18} />
                  <span className="whitespace-nowrap">Content ops</span>

                  
                    <span className="ml-2 text-[11px] leading-[14px] px-2 py-[3px] rounded-full bg-[#FFF4E5] text-[#B45309]">
                      Upcoming
                    </span>
                </div>
              </div>

              {/* Results */}
              <div className="relative group">
                <div
                  className="
                    absolute inset-y-0 left-[-16px] right-[-16px]
                    rounded-md transition-colors duration-150
                    bg-transparent group-hover:bg-[#1A73E8]/10
                  "
                />

                <div
                  className="
                    relative z-10
                    flex items-center gap-3 py-2
                    font-jakarta text-[14px] font-medium tracking-[0.02em]
                    text-[#596780] cursor-pointer
                    group-hover:text-[#1A73E8]
                  "
                >
                  <BarChart size={18} />
                  <span className="whitespace-nowrap">Results</span>

                  <span className="ml-2 text-[11px] leading-[14px] px-2 py-[3px] rounded-full bg-[#FFF4E5] text-[#B45309]">
                    Upcoming
                  </span>
                </div>
              </div>

              {/* Settings */}
              <div className="relative group">
                <div
                  className="
                    absolute inset-y-0 left-[-16px] right-[-16px]
                    rounded-md transition-colors duration-150
                    bg-transparent group-hover:bg-[#1A73E8]/10
                  "
                />

                <div
                  className="
                    relative z-10
                    flex items-center gap-3 py-2
                    font-jakarta text-[14px] font-medium tracking-[0.02em]
                    text-[#596780] cursor-pointer
                    group-hover:text-[#1A73E8]
                  "
                >
                  <Settings size={18} />
                  <span className="whitespace-nowrap">Settings</span>

                  <span className="ml-2 text-[11px] leading-[14px] px-2 py-[3px] rounded-full bg-[#FFF4E5] text-[#B45309]">
                    Upcoming
                  </span>
                </div>
              </div>

          </div>
        </div>

        {/* SUPPORT */}
        <div className="mt-8 flex flex-col gap-2">
          <p className="mb-2 font-jakarta text-[12px] font-medium uppercase tracking-[0.02em] text-[#90A3BF]">
            Support
          </p>

          <div className="flex flex-col gap-1">

            {/* Raise a ticket */}
              <div className="relative group">
                <div
                  className="
                    absolute inset-y-0 left-[-16px] right-[-16px]
                    rounded-md transition-colors duration-150
                    bg-transparent group-hover:bg-[#1A73E8]/10
                  "
                />

                <div
                  className="
                    relative z-10
                    flex items-center gap-3 py-2
                    font-jakarta text-[14px] font-medium tracking-[0.02em]
                    text-[#596780] cursor-pointer
                    group-hover:text-[#1A73E8]
                  "
                >
                  <LifeBuoy size={18} />
                  <span className="whitespace-nowrap">Raise a ticket</span>

                  <span className="ml-2 text-[11px] leading-[14px] px-2 py-[3px] rounded-full bg-[#FFF4E5] text-[#B45309]">
                    Upcoming
                  </span>
                </div>
              </div>
              
            {/* Give feedback */}
              <div className="relative group">
                <div
                  className="
                    absolute inset-y-0 left-[-16px] right-[-16px]
                    rounded-md transition-colors duration-150
                    bg-transparent group-hover:bg-[#1A73E8]/10
                  "
                />

                <div
                  className="
                    relative z-10
                    flex items-center gap-3 py-2
                    font-jakarta text-[14px] font-medium tracking-[0.02em]
                    text-[#596780] cursor-pointer
                    group-hover:text-[#1A73E8]
                  "
                >
                  <MessageCircle size={18} />
                  <span className="whitespace-nowrap">Give feedback</span>

                  <span className="ml-2 text-[11px] leading-[14px] px-2 py-[3px] rounded-full bg-[#FFF4E5] text-[#B45309]">
                    Upcoming
                  </span>
                </div>
              </div>
            
          </div>
        </div>
        </aside>

  {/* Right side (Top bar + Content) */}
  <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <header className="h-[80px] bg-white flex items-center px-8 border-b border-[#F3F5F7] shrink-0">
        <div className="flex-1" />

        <div className="flex items-center gap-[32px]">
          

    {/* Extension Status */}
    <div className="relative h-[38px] w-[38px] rounded-full border border-[#C3D4E9]/80 bg-transparent flex items-center justify-center hover:bg-[#F3F5F7]">
      <span className="absolute top-0 right-0 h-[10px] w-[10px] rounded-full bg-[#9CD323]" />
      <img
        src="/chromeextension.svg"
        alt="chromeextension"
        width={19}
        height={19}
        className="translate-x-[1.4px]"
      />
    </div>

    {/* Notifications */}
      <div
        ref={notificationsRef}
        className="relative h-[38px] w-[38px] rounded-full border border-[#C3D4E9]/80 flex items-center justify-center cursor-pointer hover:bg-[#F3F5F7]"
        onClick={() => setNotificationsOpen((prev) => !prev)}
      >
        <span className="absolute top-0 right-0 h-[10px] w-[10px] rounded-full bg-[#DB2719]" />
        <Bell size={19} className="text-[#292D32]" />

        {/* Dropdown */}
        {notificationsOpen && (
          <div className="absolute right-0 top-[48px] w-[320px] rounded-md bg-white border border-[#F3F5F7] shadow-lg z-50">
            
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#F3F5F7] font-jakarta text-sm font-semibold text-[#1A202C]">
              Notifications
            </div>

            {/* Empty state */}
            <div className="px-4 py-6 text-center text-sm text-[#596780]">
              No new notifications
            </div>

          </div>
        )}
      </div>

    {/* Profile */}
    <div
      ref={profileRef}
      className="relative flex items-center gap-3 cursor-pointer"
      onClick={() => setOpen((prev) => !prev)}
    >
      {/* Avatar */}
      <div className="h-[38px] w-[38px] rounded-full bg-gray-200 flex items-center justify-center">
        <User size={19} className="text-[#292D32]" />
      </div>

      {/* Name */}
      <span className="font-jakarta text-[16px] font-semibold tracking-[0.02em] text-[#1A202C]">
        Profile
      </span>

      {/* Dropdown arrow */}
      <ChevronDown size={16} className="text-[#596780]" />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[52px] w-[180px] rounded-md bg-white border border-[#F3F5F7] shadow-lg py-2 z-50">
          <div className="px-4 py-2 text-sm text-[#596780] hover:bg-[#F3F5F7] cursor-pointer">
            Settings
          </div>
          <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#DB2719] hover:bg-[#F3F5F7] cursor-pointer">
           <LogOut size={16} />
          <span>Logout</span>
        </div>
        </div>
      )}
    </div>
  </div>
</header>
        
        {/* Main content */}
        <div className="flex-1 bg-[#F6F7F9] p-[18px] overflow-y-auto">

        {/* Page content */}
          <div className="space-y-4">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}
