"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, X, Phone, MapPin, IndianRupee, Loader2, Pencil, Trash2, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

const COLUMNS = [
  { id: "new_inquiry",  label: "New Inquiry",  color: "bg-blue-500",    light: "bg-blue-50",   border: "border-blue-200",  text: "text-blue-700"   },
  { id: "quoted",       label: "Quoted",        color: "bg-purple-500",  light: "bg-purple-50", border: "border-purple-200",text: "text-purple-700" },
  { id: "follow_up",   label: "Follow Up",     color: "bg-amber-500",   light: "bg-amber-50",  border: "border-amber-200", text: "text-amber-700"  },
  { id: "confirmed",   label: "Confirmed",     color: "bg-emerald-500", light: "bg-emerald-50",border: "border-emerald-200",text: "text-emerald-700"},
  { id: "lost",        label: "Lost",          color: "bg-red-500",     light: "bg-red-50",    border: "border-red-200",   text: "text-red-700"    },
];

type Lead = {
  id: string;
  name: string;
  phone: string;
  destination: string;
  status: string;
  budget: number;
  notes: string;
  created_at: string;
};

type BoardState = Record<string, Lead[]>;

const emptyForm = { name: "", phone: "", destination: "", budget: "", notes: "", status: "new_inquiry" };

export default function LeadPipeline() {
  const [board, setBoard] = useState<BoardState>({
    new_inquiry: [], quoted: [], follow_up: [], confirmed: [], lost: []
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchLeads = async () => {
    setLoading(true);
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) {
      const grouped: BoardState = { new_inquiry: [], quoted: [], follow_up: [], confirmed: [], lost: [] };
      data.forEach((lead: Lead) => {
        const col = lead.status || "new_inquiry";
        if (grouped[col]) grouped[col].push(lead);
      });
      setBoard(grouped);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const openNewForm = () => {
    setEditLead(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (lead: Lead) => {
    setEditLead(lead);
    setForm({ name: lead.name, phone: lead.phone || "", destination: lead.destination || "", budget: lead.budget?.toString() || "", notes: lead.notes || "", status: lead.status });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { name: form.name, phone: form.phone, destination: form.destination, budget: Number(form.budget) || 0, notes: form.notes, status: form.status };
    if (editLead) {
      await supabase.from("leads").update(payload).eq("id", editLead.id);
    } else {
      await supabase.from("leads").insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    fetchLeads();
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = [...board[source.droppableId]];
    const destCol = source.droppableId === destination.droppableId ? sourceCol : [...board[destination.droppableId]];
    const [moved] = sourceCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, moved);

    const newBoard = { ...board, [source.droppableId]: sourceCol, [destination.droppableId]: destCol };
    setBoard(newBoard);

    // Update status in DB
    if (source.droppableId !== destination.droppableId) {
      await supabase.from("leads").update({ status: destination.droppableId }).eq("id", draggableId);
    }
  };

  const totalLeads = Object.values(board).flat().length;
  const confirmedValue = board.confirmed.reduce((s, l) => s + Number(l.budget || 0), 0);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-orange-500" size={26} /> Lead Pipeline
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {totalLeads} total leads &bull; ₹{confirmedValue.toLocaleString()} confirmed revenue
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 cursor-pointer"
        >
          <Plus size={16} /> Add New Lead
        </button>
      </div>

      {/* Board */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
            {COLUMNS.map((col) => (
              <div key={col.id} className="flex flex-col bg-gray-100 rounded-xl shrink-0 w-72 max-h-[calc(100vh-14rem)]">
                {/* Column Header */}
                <div className={`p-3 rounded-t-xl border-b ${col.border} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <span className="font-semibold text-gray-800 text-sm">{col.label}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.light} ${col.text}`}>
                    {board[col.id]?.length || 0}
                  </span>
                </div>

                {/* Cards */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-2 space-y-2 rounded-b-xl transition-colors ${snapshot.isDraggingOver ? col.light : ""}`}
                    >
                      {board[col.id]?.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={`bg-white rounded-lg p-3 shadow-sm border border-gray-100 group transition-all ${snap.isDragging ? "shadow-lg rotate-1 scale-105 border-orange-300" : "hover:shadow-md"}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{lead.name}</h3>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  <button onClick={() => openEditForm(lead)} className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"><Pencil size={13} /></button>
                                  <button onClick={() => handleDelete(lead.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
                                </div>
                              </div>
                              {lead.phone && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                                  <Phone size={11} className="shrink-0" /> {lead.phone}
                                </div>
                              )}
                              {lead.destination && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                  <MapPin size={11} className="shrink-0" /> {lead.destination}
                                </div>
                              )}
                              {lead.budget > 0 && (
                                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-2">
                                  <IndianRupee size={11} className="shrink-0" /> {Number(lead.budget).toLocaleString()}
                                </div>
                              )}
                              {lead.notes && (
                                <p className="text-xs text-gray-400 mt-2 italic line-clamp-2">{lead.notes}</p>
                              )}
                              <div className="text-[10px] text-gray-300 mt-2 text-right">
                                {new Date(lead.created_at).toLocaleDateString("en-IN")}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {board[col.id]?.length === 0 && !snapshot.isDraggingOver && (
                        <div className="text-center py-8 text-gray-400 text-xs">Drop leads here</div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editLead ? "Edit Lead" : "Add New Lead"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest / Client Name *</label>
                <input type="text" placeholder="Mr. Ramesh Sharma" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" placeholder="98765 43210" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
                  <input type="number" placeholder="25000" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input type="text" placeholder="e.g. Vaishno Devi + Srinagar" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea rows={2} placeholder="Any special requirements or follow-up notes..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 cursor-pointer">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {saving ? "Saving..." : editLead ? "Update Lead" : "Add Lead"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
