"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Hotel, Car, Menu, X, Plane, Map, Users, Store } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Invoice Generator", href: "/invoices", icon: FileText },
  { name: "Itineraries & Quotes", href: "/itinerary-builder", icon: Map },
  { name: "Hotel Vouchers", href: "/hotels", icon: Hotel },
  { name: "Transport Vouchers", href: "/transport", icon: Car },
  { name: "Lead Pipeline", href: "/leads", icon: Users },
  { name: "Vendors & Payables", href: "/vendors", icon: Store },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Triloki Group" className="h-8 w-auto object-contain" />
          <span className="font-bold text-gray-900">Triloki Group</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-md text-gray-500 hover:text-orange-500 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 lg:h-auto lg:p-6 lg:border-none">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Triloki Group" className="h-12 w-auto object-contain" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Triloki Group</h1>
                <p className="text-[10px] uppercase font-semibold text-orange-600 tracking-wider">Invoice Generator</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 hidden lg:block font-medium">Professional Invoice Solutions</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-orange-50 text-orange-600 shadow-sm border border-orange-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-orange-600" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">Admin User</span>
              <span className="text-xs text-gray-500">admin@trilokigroup.com</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
