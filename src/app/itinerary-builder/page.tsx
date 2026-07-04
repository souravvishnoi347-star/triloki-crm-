"use client";

import { useState, useMemo } from "react";
import { Download, Loader2, Plus, Trash2, Map } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ItineraryBuilder() {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [data, setData] = useState({
    title: "5 Nights Magical Kashmir Tour",
    guestName: "Mr. Ramesh Kumar",
    guestPhone: "9876543210",
    hotelCost: 15000,
    transportCost: 10000,
    markupPercent: 15,
    days: [
      {
        id: 1,
        title: "Arrival in Srinagar & Shikara Ride",
        description: "Welcome to Srinagar! Meet our representative at the airport and transfer to your houseboat. In the evening, enjoy a relaxing Shikara ride on Dal Lake. Overnight stay in Srinagar.",
      },
      {
        id: 2,
        title: "Srinagar to Gulmarg Excursion",
        description: "After breakfast, proceed for a day trip to Gulmarg, the Meadow of Flowers. Enjoy the famous Gondola cable car ride (tickets at your own cost). Return to Srinagar in the evening.",
      }
    ]
  });

  const finalCost = useMemo(() => {
    const totalNet = Number(data.hotelCost || 0) + Number(data.transportCost || 0);
    const markup = totalNet * ((Number(data.markupPercent) || 0) / 100);
    return Math.round(totalNet + markup);
  }, [data.hotelCost, data.transportCost, data.markupPercent]);

  const addDay = () => {
    setData({
      ...data,
      days: [...data.days, { id: Date.now(), title: "", description: "" }]
    });
  };

  const removeDay = (id: number) => {
    setData({
      ...data,
      days: data.days.filter((d) => d.id !== id)
    });
  };

  const updateDay = (id: number, field: string, value: string) => {
    setData({
      ...data,
      days: data.days.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    });
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const element = document.getElementById("pdf-content");
      if (!element) {
        alert("Could not find the content to download.");
        setIsDownloading(false);
        return;
      }

      // Save to Supabase Cloud
      if (data.guestName) {
        let clientId = null;
        if (data.guestPhone) {
          const { data: existingClient } = await supabase.from("clients").select("id").eq("phone", data.guestPhone).single();
          if (existingClient) {
            clientId = existingClient.id;
          }
        }
        if (!clientId) {
          const { data: newClient } = await supabase.from("clients").insert({
            name: data.guestName,
            phone: data.guestPhone || ""
          }).select().single();
          clientId = newClient?.id;
        }

        await supabase.from("itineraries").insert({
          title: data.title || "Custom Itinerary",
          client_id: clientId,
          total_cost: finalCost,
          document_data: data
        });
      }

      const html2canvasModule = await import("html2canvas-pro");
      const html2canvas = html2canvasModule.default || html2canvasModule;
      
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.jsPDF;

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Itinerary_${data.guestName.replace(/\s+/g, "_")}.pdf`);
    } catch (error: any) {
      console.error("PDF generation failed:", error);
      alert(`Failed to generate PDF: ${error.message || error}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full min-h-[calc(100vh-6rem)]">
      {/* Left Column: Form */}
      <div className="w-full lg:w-[40%] bg-white rounded-lg shadow-sm border border-gray-100 p-6 overflow-y-auto shrink-0 max-h-[calc(100vh-2rem)] custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Map className="text-orange-500" /> Itinerary Builder
        </h2>
        
        <div className="space-y-8">
          {/* 1. Meta */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">1. Package Info</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
              <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900 font-semibold" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.guestName} onChange={e => setData({...data, guestName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Phone</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.guestPhone} onChange={e => setData({...data, guestPhone: e.target.value})} />
              </div>
            </div>
          </div>

          {/* 2. Costing */}
          <div className="space-y-4 bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h3 className="text-sm font-semibold text-orange-900 uppercase tracking-wider mb-2">2. Smart Costing (Hidden from Client)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Net Hotel (₹)</label>
                <input type="number" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.hotelCost} onChange={e => setData({...data, hotelCost: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Net Transport (₹)</label>
                <input type="number" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.transportCost} onChange={e => setData({...data, transportCost: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Markup (%)</label>
                <input type="number" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900 font-bold text-green-600" value={data.markupPercent} onChange={e => setData({...data, markupPercent: Number(e.target.value)})} />
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-orange-200 mt-3">
              <span className="text-sm font-semibold text-gray-600">Final Selling Price:</span>
              <span className="text-lg font-bold text-orange-600">₹{finalCost.toLocaleString()}</span>
            </div>
          </div>

          {/* 3. Day by Day */}
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b pb-2">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">3. Day-by-Day Plan</h3>
            </div>
            
            <div className="space-y-4">
              {data.days.map((day, index) => (
                <div key={day.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => removeDay(day.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mb-3 font-semibold text-sm text-orange-600">Day {index + 1}</div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Day Title</label>
                      <input 
                        type="text" placeholder="e.g. Arrival in Srinagar"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                        value={day.title} onChange={e => updateDay(day.id, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        rows={3} placeholder="Describe the day's activities..."
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        value={day.description} onChange={e => updateDay(day.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addDay} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-orange-500 hover:border-orange-500 transition-colors">
              <Plus size={16} /> Add Another Day
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Preview Container */}
      <div className="w-full lg:w-[60%] flex flex-col gap-4">
        
        {/* Controls Toolbar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-700">Live Preview</h2>
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md font-medium text-sm hover:bg-orange-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
            {isDownloading ? "Generating PDF..." : "Save & Download PDF"}
          </button>
        </div>
        
        {/* Scrollable Area */}
        <div className="overflow-x-auto bg-slate-200 p-8 rounded-lg w-full flex-1">
          {/* Centering Wrapper */}
          <div className="flex justify-center min-w-max">
            {/* The A4 Paper */}
            <div id="pdf-content" className="w-[210mm] min-h-[297mm] bg-[#ffffff] shadow-xl shrink-0 flex flex-col relative overflow-hidden">
              
              {/* Premium Header Overlay Style */}
              <div className="bg-[#003366] text-[#ffffff] p-10 pb-16 relative">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Map size={120} />
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase leading-tight max-w-[80%]">{data.title}</h1>
                    <p className="text-[#93c5fd] font-medium tracking-wide">Triloki Group</p>
                  </div>
                  <div className="w-20 h-20 bg-[#ffffff] rounded-lg flex items-center justify-center p-1 shadow-lg shrink-0">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>

              {/* Overlapping Quick Details Box */}
              <div className="px-10 -mt-8 relative z-20">
                <div className="bg-[#ffffff] rounded-xl shadow-lg border border-[#e5e7eb] p-6 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-bold mb-1">Prepared For</div>
                    <div className="font-bold text-lg text-[#1f2937]">{data.guestName || "Guest Name"}</div>
                    <div className="text-sm text-[#4b5563]">{data.guestPhone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-bold mb-1">Total Package Cost</div>
                    <div className="font-bold text-2xl text-[#ea580c]">₹{finalCost.toLocaleString()}</div>
                    <div className="text-xs text-[#6b7280]">Inclusive of all taxes</div>
                  </div>
                </div>
              </div>

              {/* Itinerary Section */}
              <div className="p-10 flex-1">
                <h2 className="text-xl font-bold text-[#1f2937] border-b-2 border-[#ea580c] inline-block pb-1 mb-8 uppercase tracking-wider">Day by Day Plan</h2>
                
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#fed7aa] before:to-transparent">
                  {data.days.map((day, index) => (
                    <div key={day.id} className="relative flex items-start gap-6">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#ea580c] text-[#ffffff] font-bold text-sm shrink-0 border-4 border-[#ffffff] shadow-sm relative z-10">
                        {index + 1}
                      </div>
                      <div className="pt-1">
                        <h3 className="text-lg font-bold text-[#1f2937] mb-2">{day.title || `Day ${index + 1}`}</h3>
                        <p className="text-sm text-[#4b5563] leading-relaxed whitespace-pre-line bg-[#f8fafc] p-4 rounded-lg border border-[#f1f5f9]">
                          {day.description || "No details provided for this day."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#f8fafc] p-6 border-t border-[#e5e7eb] flex justify-between items-center text-xs text-[#6b7280]">
                <div>
                  <strong>Triloki Group</strong><br />
                  www.trilokigroup.in | +91 84452 14371
                </div>
                <div className="text-right italic">
                  Thank you for choosing us for your travels!
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
