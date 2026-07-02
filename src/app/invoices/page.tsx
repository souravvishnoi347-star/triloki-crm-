"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Download, Loader2 } from "lucide-react";

// Helper for Indian number to words
function numberToWords(num: number): string {
  if (num === 0) return "Zero Rupees Only";
  const a = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  let numStr = Math.floor(num).toString();
  if (numStr.length > 9) return "Amount too large";
  const n = ("000000000" + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ""; 
  let str = "";
  str += (n[1] != "00") ? (a[Number(n[1])] || b[Number(n[1][0])] + " " + a[Number(n[1][1])]) + "Crore " : "";
  str += (n[2] != "00") ? (a[Number(n[2])] || b[Number(n[2][0])] + " " + a[Number(n[2][1])]) + "Lakh " : "";
  str += (n[3] != "00") ? (a[Number(n[3])] || b[Number(n[3][0])] + " " + a[Number(n[3][1])]) + "Thousand " : "";
  str += (n[4] != "0") ? (a[Number(n[4])] || b[Number(n[4][0])] + " " + a[Number(n[4][1])]) + "Hundred " : "";
  str += (n[5] != "00") ? ((str != "") ? "and " : "") + (a[Number(n[5])] || b[Number(n[5][0])] + " " + a[Number(n[5][1])]) + "Rupees Only" : "Rupees Only";
  return str;
}

export default function InvoiceGenerator() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [data, setData] = useState({
    companySettings: "Triloki Divine Journey",
    invoiceNumber: "INV-00001",
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    guestGst: "",
    dateType: "Travel Date",
    travelDate: "",
    bookingDate: "",
    packages: [] as { detail: string; person: number; rate: number; amount: number }[],
    taxPercent: "",
    discount: "",
    amountPaid: "",
    notes: `Banking Details for Payment:\n• Bank: Bandhan Bank\n• IFSC: BDBL0001536\n• Account No: 10180000573933\n\nImportant Points / Terms & Conditions:\n• Booking is confirmed after receipt of advance payment.\n• Balance must be paid before the travel date.\n• Changes/cancellations are subject to partner policies and may incur charges.\n• Valid ID proof is required for all travelers.\n• Hotel check-in/check-out as per hotel policy; early check-in subject to availability/charges.\n• We are not responsible for delays due to traffic, weather, strikes or force majeure.\n• Any damage during the trip will be chargeable to the guest.`
  });

  const handlePackageChange = (index: number, field: string, value: string | number) => {
    const newPackages = [...data.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    
    // Auto-calculate amount
    if (field === 'person' || field === 'rate') {
      const person = Number(newPackages[index].person) || 0;
      const rate = Number(newPackages[index].rate) || 0;
      newPackages[index].amount = person * rate;
    }
    
    setData({ ...data, packages: newPackages });
  };

  const addPackage = () => {
    setData({
      ...data,
      packages: [...data.packages, { detail: "", person: 1, rate: 0, amount: 0 }]
    });
  };

  const removePackage = (index: number) => {
    setData({
      ...data,
      packages: data.packages.filter((_, i) => i !== index)
    });
  };

  const calculations = useMemo(() => {
    const subTotal = data.packages.reduce((sum, pkg) => sum + (Number(pkg.amount) || 0), 0);
    const discount = Number(data.discount) || 0;
    const afterDiscount = Math.max(0, subTotal - discount);
    const taxAmount = afterDiscount * ((Number(data.taxPercent) || 0) / 100);
    const total = Math.round(afterDiscount + taxAmount);
    const paid = Number(data.amountPaid) || 0;
    const pending = total - paid;
    return { subTotal, total, paid, pending, totalWords: numberToWords(total) };
  }, [data.packages, data.discount, data.taxPercent, data.amountPaid]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const element = document.getElementById("pdf-content");
      if (!element) {
        alert("Could not find the invoice content to download.");
        setIsDownloading(false);
        return;
      }
      
      // Dynamic import to prevent SSR issues and handle ES modules correctly
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;
      
      const opt = {
        margin: 0,
        filename: `Invoice_${data.invoiceNumber || "Triloki"}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error: any) {
      console.error("PDF generation failed:", error);
      alert(`Failed to generate PDF: ${error.message || error}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left Column: Form */}
      <div className="w-full lg:w-[40%] bg-[#ffffff] rounded-lg shadow-sm border border-[#f3f4f6] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#f3f4f6]">
          <h2 className="text-xl font-bold text-[#111827]">Invoice Details</h2>
        </div>
        <div className="p-6 space-y-8">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Company Settings</label>
              <select 
                className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-[#111827]"
                value={data.companySettings}
                onChange={e => setData({...data, companySettings: e.target.value})}
              >
                <option value="Triloki Divine Journey">Triloki Divine Journey</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">Invoice Information</h3>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Invoice Number</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827] placeholder:text-gray-400"
                value={data.invoiceNumber}
                onChange={e => setData({...data, invoiceNumber: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Guest Name</label>
                <input 
                  type="text" placeholder="Enter guest/customer name"
                  className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827] placeholder:text-gray-400"
                  value={data.guestName}
                  onChange={e => setData({...data, guestName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Guest Phone</label>
                <input 
                  type="text" placeholder="+91 XXXXX XXXXX"
                  className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827] placeholder:text-gray-400"
                  value={data.guestPhone}
                  onChange={e => setData({...data, guestPhone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Guest Email</label>
                <input 
                  type="email" placeholder="guest@email.com"
                  className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827] placeholder:text-gray-400"
                  value={data.guestEmail}
                  onChange={e => setData({...data, guestEmail: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Guest GST Number (optional)</label>
                <input 
                  type="text" placeholder="15-character GSTIN"
                  className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827] placeholder:text-gray-400"
                  value={data.guestGst}
                  onChange={e => setData({...data, guestGst: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Date Type</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setData({...data, dateType: 'Travel Date'})}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${data.dateType === 'Travel Date' ? 'bg-orange-500 text-[#ffffff] border-orange-500' : 'bg-white text-[#374151] border-[#d1d5db] hover:bg-gray-50'}`}
                >
                  Travel Date
                </button>
                <button 
                  onClick={() => setData({...data, dateType: 'Check-in / Check-out'})}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${data.dateType === 'Check-in / Check-out' ? 'bg-orange-500 text-[#ffffff] border-orange-500' : 'bg-white text-[#374151] border-[#d1d5db] hover:bg-gray-50'}`}
                >
                  Check-in / Check-out
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">{data.dateType}</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827]"
                  value={data.travelDate}
                  onChange={e => setData({...data, travelDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Booking Date (optional)</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827]"
                  value={data.bookingDate}
                  onChange={e => setData({...data, bookingDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">Package Details</h3>
              <button 
                onClick={addPackage}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#f97316] text-[#ffffff] text-xs font-medium rounded-md hover:bg-orange-600 transition-colors"
              >
                <Plus size={14} /> Add Package
              </button>
            </div>
            
            <div className="space-y-3">
              {data.packages.length === 0 && (
                <p className="text-sm text-[#6b7280] text-center py-4 border border-dashed rounded-md border-[#d1d5db]">No packages added.</p>
              )}
              {data.packages.map((pkg, i) => (
                <div key={i} className="flex flex-wrap gap-2 items-end p-3 bg-[#f8fafc] border border-[#e5e7eb] rounded-lg relative">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-[#6b7280] mb-1">Package Detail</label>
                    <input 
                      type="text" placeholder="e.g., 3N/4D Goa Package"
                      className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827] placeholder:text-gray-400"
                      value={pkg.detail}
                      onChange={e => handlePackageChange(i, 'detail', e.target.value)}
                    />
                  </div>
                  <div className="w-16">
                    <label className="block text-xs font-medium text-[#6b7280] mb-1">Person</label>
                    <input 
                      type="number" min="1"
                      className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827]"
                      value={pkg.person}
                      onChange={e => handlePackageChange(i, 'person', e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-[#6b7280] mb-1">Rate (₹)</label>
                    <input 
                      type="number" min="0"
                      className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827]"
                      value={pkg.rate || ''}
                      onChange={e => handlePackageChange(i, 'rate', e.target.value)}
                    />
                  </div>
                  <div className="w-28 flex gap-2 items-center">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-[#6b7280] mb-1">Amount (₹)</label>
                      <input 
                        type="number" disabled
                        className="w-full px-3 py-2 bg-[#f3f4f6] border border-[#e5e7eb] rounded-md text-sm font-medium text-[#374151]"
                        value={pkg.amount}
                      />
                    </div>
                    <button 
                      onClick={() => removePackage(i)}
                      className="p-2 mt-5 text-[#ef4444] hover:bg-red-50 rounded-md transition-colors shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">Tax & Discount</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Tax / GST (%)</label>
                <input 
                  type="number" placeholder="e.g., 18" min="0"
                  className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827] placeholder:text-gray-400"
                  value={data.taxPercent}
                  onChange={e => setData({...data, taxPercent: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Overall Discount (₹)</label>
                <input 
                  type="number" placeholder="Enter discount amount" min="0"
                  className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827] placeholder:text-gray-400"
                  value={data.discount}
                  onChange={e => setData({...data, discount: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">Payment Details</h3>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Amount Paid (₹)</label>
              <input 
                type="number" placeholder="Enter advance/paid amount" min="0"
                className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-[#111827] placeholder:text-gray-400"
                value={data.amountPaid}
                onChange={e => setData({...data, amountPaid: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">Additional Information</h3>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Notes & Banking Details</label>
              <textarea 
                rows={10}
                className="w-full px-3 py-2 bg-[#ffffff] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono text-[#111827] placeholder:text-gray-400"
                value={data.notes}
                onChange={e => setData({...data, notes: e.target.value})}
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Right Column: Live Preview Container */}
      <div className="w-full lg:w-[60%] flex flex-col gap-4">
        
        {/* Controls Toolbar */}
        <div className="flex justify-between items-center bg-[#ffffff] p-4 rounded-lg shadow-sm border border-[#f3f4f6]">
          <h2 className="font-semibold text-[#374151]">Live Preview</h2>
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-[#f97316] text-[#ffffff] rounded-md font-medium text-sm hover:bg-orange-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
            {isDownloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>
        
        {/* Step B: Scrollable Area */}
        <div className="overflow-x-auto bg-slate-200 p-8 rounded-lg w-full flex-1">
          {/* Step C: Centering Wrapper */}
          <div className="flex justify-center min-w-max">
            {/* Step D: The A4 Paper */}
            <div id="pdf-content" className="w-[210mm] min-h-[297mm] bg-[#ffffff] shadow-xl shrink-0 flex flex-col">
              
              {/* Invoice Header (Step E: No absolute positioning) */}
              <div className="bg-[#f97316] p-8 flex justify-between items-center text-[#ffffff] w-full block">
                <div>
                  <h1 className="text-3xl font-bold tracking-wider mb-1">TRILOKI DIVINE JOURNEY</h1>
                  <p className="text-[#ffedd5] text-sm">Managed by Triloki Hospitality</p>
                </div>
                <div className="w-24 h-24 bg-[#ffffff] rounded-xl flex items-center justify-center shadow-md overflow-hidden border-2 border-[#ffffff]/50">
                  <img src="/logo.png" alt="Triloki Logo" className="w-full h-full object-contain p-1" />
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                {/* Invoice Number & Date */}
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <div className="text-[#f97316] font-bold text-2xl tracking-wide">
                      Invoice No: {data.invoiceNumber || "—"}
                    </div>
                  </div>
                  <div className="text-right text-xs text-[#6b7280] space-y-1">
                    <div>Booking Date: <span className="text-[#1f2937] font-medium">{data.bookingDate || "—"}</span></div>
                    <div>GSTIN: <span className="text-[#1f2937] font-medium">05CTIPS4731F1ZM</span></div>
                  </div>
                </div>

                {/* Guest Details Grid */}
                <div className="border border-[#60a5fa] rounded-lg p-5 mb-8 bg-[#ffffff]">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
                    <div>
                      <div className="text-[#9ca3af] text-xs font-semibold tracking-wider uppercase mb-1">Guest Name</div>
                      <div className="font-semibold text-[#1f2937] text-base">{data.guestName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-[#9ca3af] text-xs font-semibold tracking-wider uppercase mb-1">{data.dateType}</div>
                      <div className="font-semibold text-[#1f2937] text-base">{data.travelDate || "—"}</div>
                    </div>
                    
                    <div>
                      <div className="text-[#9ca3af] text-xs font-semibold tracking-wider uppercase mb-1">Phone Number</div>
                      <div className="font-medium text-[#1f2937]">{data.guestPhone || "—"}</div>
                    </div>
                    <div>
                      <div className="text-[#9ca3af] text-xs font-semibold tracking-wider uppercase mb-1">Email Address</div>
                      <div className="font-medium text-[#1f2937]">{data.guestEmail || "—"}</div>
                    </div>
                    
                    {data.guestGst && (
                      <div className="col-span-2">
                        <div className="text-[#9ca3af] text-xs font-semibold tracking-wider uppercase mb-1">Guest GST Number</div>
                        <div className="font-medium text-[#1f2937]">{data.guestGst}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Packages Table */}
                <div className="border border-[#60a5fa] rounded-t-lg overflow-hidden mb-0 bg-[#ffffff]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f97316] text-[#ffffff]">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold text-xs tracking-wider">PACKAGE DETAIL</th>
                        <th className="py-2.5 px-4 font-semibold text-xs tracking-wider text-center w-20">PERSON</th>
                        <th className="py-2.5 px-4 font-semibold text-xs tracking-wider text-right w-24">RATE</th>
                        <th className="py-2.5 px-4 font-semibold text-xs tracking-wider text-right w-28">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e7eb]">
                      {data.packages.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-[#9ca3af]">No packages added yet</td>
                        </tr>
                      ) : (
                        data.packages.map((pkg, i) => (
                          <tr key={i}>
                            <td className="py-3 px-4 text-[#1f2937]">{pkg.detail}</td>
                            <td className="py-3 px-4 text-center text-[#1f2937]">{pkg.person}</td>
                            <td className="py-3 px-4 text-right text-[#1f2937]">₹{pkg.rate}</td>
                            <td className="py-3 px-4 text-right text-[#1f2937] font-medium">₹{pkg.amount}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Totals Box */}
                <div className="border-x border-b border-[#60a5fa] rounded-b-lg p-5 mb-8 bg-[#ffffff]">
                  <div className="w-full flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                    <span className="text-sm font-semibold text-[#4b5563]">SUB TOTAL:</span>
                    <span className="font-semibold text-[#111827]">₹{calculations.subTotal}</span>
                  </div>
                  {Number(data.discount) > 0 && (
                    <div className="w-full flex justify-between items-center py-2 border-b border-[#f3f4f6] text-[#16a34a]">
                      <span className="text-sm font-semibold">DISCOUNT:</span>
                      <span className="font-semibold">-₹{data.discount}</span>
                    </div>
                  )}
                  {Number(data.taxPercent) > 0 && (
                    <div className="w-full flex justify-between items-center py-2 border-b border-[#f3f4f6]">
                      <span className="text-sm font-semibold text-[#4b5563]">TAX / GST ({data.taxPercent}%):</span>
                      <span className="font-semibold text-[#111827]">₹{Math.round(Math.max(0, calculations.subTotal - Number(data.discount)) * (Number(data.taxPercent) / 100))}</span>
                    </div>
                  )}
                  <div className="w-full flex justify-between items-center py-3 border-b border-[#f3f4f6]">
                    <span className="text-base font-bold text-[#1f2937]">TOTAL:</span>
                    <span className="text-lg font-bold text-[#111827]">₹{calculations.total}</span>
                  </div>
                  <div className="py-2 border-b border-[#fed7aa]">
                    <span className="text-xs font-semibold text-[#9ca3af] tracking-wider">TOTAL (IN WORDS):</span>
                    <div className="text-sm text-[#1f2937] italic mt-0.5">{calculations.totalWords}</div>
                  </div>
                  {Number(data.amountPaid) > 0 && (
                    <div className="w-full flex justify-between items-center py-3 border-b border-[#f3f4f6] text-[#16a34a]">
                      <span className="text-sm font-semibold">AMOUNT PAID:</span>
                      <span className="font-semibold">₹{calculations.paid}</span>
                    </div>
                  )}
                  <div className="w-full flex justify-between items-center pt-3 mt-1">
                    <span className="text-lg font-bold text-[#ea580c]">PENDING:</span>
                    <span className="text-xl font-bold text-[#ea580c]">₹{calculations.pending}</span>
                  </div>
                </div>

                {/* Support Info */}
                <div className="border border-[#fed7aa] rounded-lg p-4 mb-8 bg-[#fff7ed]/30 flex flex-col items-center justify-center text-sm">
                  <div className="text-[#ea580c] font-bold mb-2">TRILOKI DIVINE JOURNEY - Customer Support</div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-[#4b5563] text-xs">
                    <div className="flex items-center gap-1.5"><span className="text-[#60a5fa]">🌐</span> www.trilokigroup.com</div>
                    <div className="flex items-center gap-1.5"><span className="text-[#c084fc]">✉️</span> hospitality.triloki@gmail.com</div>
                    <div className="flex items-center gap-1.5"><span className="text-[#f472b6]">📞</span> +91 84452 14371 | +91 91933 36211</div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-[#f8fafc] rounded-lg p-5 text-xs text-[#4b5563] whitespace-pre-line leading-relaxed">
                  <div className="font-semibold text-[#9ca3af] tracking-wider mb-2 uppercase">Notes & Banking Details</div>
                  {data.notes}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
