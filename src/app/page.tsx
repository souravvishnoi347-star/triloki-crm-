"use client";

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
          { label: "Total Invoices", value: "1,248", change: "+12%", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Hotel Vouchers", value: "384", change: "+5%", icon: Hotel, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Transport Vouchers", value: "592", change: "+18%", icon: Car, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Total Revenue", value: "₹4.2M", change: "+24%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${stat.bg} group-hover:bg-white group-hover:shadow-sm`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {stat.change}
                <ArrowUpRight className="w-3 h-3 ml-1" />
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
                {[
                  { id: "INV-2026-001", client: "Acme Corp", date: "May 28, 2026", amount: "₹45,000", status: "Paid" },
                  { id: "INV-2026-002", client: "Globex Inc", date: "May 27, 2026", amount: "₹12,500", status: "Pending" },
                  { id: "INV-2026-003", client: "Stark Industries", date: "May 25, 2026", amount: "₹89,000", status: "Paid" },
                  { id: "INV-2026-004", client: "Wayne Enterprises", date: "May 24, 2026", amount: "₹34,200", status: "Overdue" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-medium text-gray-900">{row.id}</td>
                    <td className="py-4 text-gray-600">{row.client}</td>
                    <td className="py-4 text-gray-500">{row.date}</td>
                    <td className="py-4 font-medium text-gray-900">{row.amount}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${row.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                          row.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                          'bg-red-50 text-red-600'}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
