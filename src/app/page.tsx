"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { 
  FileText, 
  Hotel, 
  Car, 
  TrendingUp, 
  Users, 
  ArrowUpRight 
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState({ invoices: 0, hotels: 0, transport: 0, revenue: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch recent invoices with client names
      const { data: invoices } = await supabase
        .from("invoices")
        .select("id, invoice_number, total_amount, created_at, clients(name)")
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (invoices) setRecentInvoices(invoices);

      // Fetch basic stats
      const { count: invoiceCount } = await supabase.from("invoices").select("*", { count: "exact", head: true });
      const { count: hotelCount } = await supabase.from("vouchers").select("*", { count: "exact", head: true }).eq("voucher_type", "hotel");
      const { count: transportCount } = await supabase.from("vouchers").select("*", { count: "exact", head: true }).eq("voucher_type", "transport");
      
      const { data: allInvoices } = await supabase.from("invoices").select("total_amount");
      const totalRevenue = allInvoices?.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0) || 0;

      setStats({
        invoices: invoiceCount || 0,
        hotels: hotelCount || 0,
        transport: transportCount || 0,
        revenue: totalRevenue
      });
    };
    
    fetchDashboardData();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Invoice ID,Client,Date,Amount,Status\\n"
      + "INV-2026-001,Acme Corp,May 28 2026,45000,Paid\\n"
      + "INV-2026-002,Globex Inc,May 27 2026,12500,Pending\\n"
      + "INV-2026-003,Stark Industries,May 25 2026,89000,Paid\\n"
      + "INV-2026-004,Wayne Enterprises,May 24 2026,34200,Overdue";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "triloki_invoices_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back to Triloki Group CRM.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
            Export Data
          </button>
          <Link href="/invoices" className="px-4 py-2 flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-orange-600/20">
            Create Invoice
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        {[
          { label: "Total Invoices", value: stats.invoices.toString(), change: "Active", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Hotel Vouchers", value: stats.hotels.toString(), change: "Active", icon: Hotel, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Transport Vouchers", value: stats.transport.toString(), change: "Active", icon: Car, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, change: "Total", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${stat.bg} group-hover:bg-white group-hover:shadow-sm`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Invoices</h2>
            <button className="text-sm font-medium text-orange-600 hover:text-orange-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="pb-3 font-medium">Invoice ID</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No invoices saved yet. Create one to see it here!</td>
                  </tr>
                ) : (
                  recentInvoices.map((inv, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-medium text-gray-900">{inv.invoice_number}</td>
                      <td className="py-4 text-gray-600">{inv.clients?.name || "Unknown"}</td>
                      <td className="py-4 text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                      <td className="py-4 font-medium text-gray-900">₹{inv.total_amount}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                          Saved
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "New Hotel Voucher", icon: Hotel, color: "text-emerald-600", bg: "bg-emerald-50", href: "/hotels" },
              { label: "New Transport Voucher", icon: Car, color: "text-purple-600", bg: "bg-purple-50", href: "/transport" },
              { label: "Add Client", icon: Users, color: "text-blue-600", bg: "bg-blue-50", href: "#" },
            ].map((action, i) => (
              <Link key={i} href={action.href} className="w-full flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all group text-left block">
                <div className={`p-2 rounded-lg ${action.bg} group-hover:bg-white`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
