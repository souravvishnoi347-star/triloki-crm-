"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  FileText, 
  Hotel, 
  Car, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  Map,
  Store,
  IndianRupee,
  Activity,
  Clock,
  Loader2,
  Plus
} from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type DashboardStats = {
  activeLeads: number;
  confirmedRevenue: number;
  pendingPayables: number;
  totalItineraries: number;
  leadsByStage: { name: string; count: number; fill: string }[];
  recentActivity: any[];
};

const STAGE_COLORS: Record<string, string> = {
  new_inquiry: "#3b82f6", // blue
  quoted: "#a855f7", // purple
  follow_up: "#f59e0b", // amber
  confirmed: "#10b981", // emerald
  lost: "#ef4444" // red
};

const STAGE_LABELS: Record<string, string> = {
  new_inquiry: "New Inquiry",
  quoted: "Quoted",
  follow_up: "Follow Up",
  confirmed: "Confirmed",
  lost: "Lost"
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeLeads: 0,
    confirmedRevenue: 0,
    pendingPayables: 0,
    totalItineraries: 0,
    leadsByStage: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Fetch all leads
        const { data: leads } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
        
        // 2. Fetch payables
        const { data: payables } = await supabase.from("payables").select("amount, status");
        
        // 3. Fetch itineraries
        const { count: itineraryCount } = await supabase.from("itineraries").select("*", { count: "exact", head: true });

        if (leads) {
          const activeLeads = leads.filter(l => l.status !== "lost").length;
          const confirmedRevenue = leads.filter(l => l.status === "confirmed").reduce((sum, l) => sum + Number(l.budget || 0), 0);
          
          // Calculate chart data
          const stageCounts: Record<string, number> = { new_inquiry: 0, quoted: 0, follow_up: 0, confirmed: 0, lost: 0 };
          leads.forEach(l => {
            const st = l.status || "new_inquiry";
            if (stageCounts[st] !== undefined) stageCounts[st]++;
          });
          
          const chartData = Object.keys(stageCounts).map(key => ({
            name: STAGE_LABELS[key],
            count: stageCounts[key],
            fill: STAGE_COLORS[key]
          }));

          const pendingPayables = (payables || []).filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0);

          setStats({
            activeLeads,
            confirmedRevenue,
            pendingPayables,
            totalItineraries: itineraryCount || 0,
            leadsByStage: chartData,
            recentActivity: leads.slice(0, 5) // Top 5 recent leads
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Business Overview</h1>
          <p className="text-gray-500 mt-1 text-sm">Welcome back to Triloki CRM. Here's what's happening today.</p>
        </div>
        <Link href="/leads" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors shadow-sm w-fit">
          <Plus size={16} /> New Lead
        </Link>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Active Leads</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeLeads}</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Confirmed Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{stats.confirmedRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-red-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Store size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Pending Payables</p>
            <p className="text-2xl font-bold text-gray-900">₹{stats.pendingPayables.toLocaleString()}</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-purple-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Map size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Total Itineraries</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalItineraries}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="text-orange-500" size={20} /> Leads Pipeline Distribution
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.leadsByStage} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions (Moved below chart) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: "New Itinerary", icon: Map, color: "text-blue-600", bg: "bg-blue-50", href: "/itinerary-builder" },
                { label: "New Invoice", icon: FileText, color: "text-orange-600", bg: "bg-orange-50", href: "/invoices" },
                { label: "New Hotel Voucher", icon: Hotel, color: "text-emerald-600", bg: "bg-emerald-50", href: "/hotels" },
                { label: "New Transport", icon: Car, color: "text-purple-600", bg: "bg-purple-50", href: "/transport" },
                { label: "Lead Pipeline", icon: Users, color: "text-cyan-600", bg: "bg-cyan-50", href: "/leads" },
                { label: "Payables Ledger", icon: Store, color: "text-red-600", bg: "bg-red-50", href: "/vendors" },
              ].map((action, i) => (
                <Link key={i} href={action.href} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all group">
                  <div className={`p-2 rounded-lg ${action.bg} group-hover:bg-white`}>
                    <action.icon size={20} className={action.color} />
                  </div>
                  <span className="font-medium text-gray-700 text-sm group-hover:text-orange-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) - Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="text-orange-500" size={20} /> Recent Leads
          </h2>
          
          <div className="flex-1 space-y-4">
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No recent activity found.</p>
            ) : (
              stats.recentActivity.map((lead, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    {i !== stats.recentActivity.length - 1 && (
                      <div className="w-px h-full bg-gray-100 my-1 group-hover:bg-orange-200 transition-colors" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                        lead.status === 'confirmed' ? 'bg-emerald-500' :
                        lead.status === 'lost' ? 'bg-red-500' :
                        lead.status === 'follow_up' ? 'bg-amber-500' :
                        lead.status === 'quoted' ? 'bg-purple-500' : 'bg-blue-500'
                      }`} />
                      {STAGE_LABELS[lead.status] || 'New Inquiry'}
                    </p>
                    {lead.destination && (
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">Dest: {lead.destination}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <Link href="/leads" className="w-full mt-4 flex items-center justify-center gap-1 py-2.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors">
            View All Leads <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
