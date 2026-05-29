"use client";

import { useState } from "react";
import { Plus, Trash2, Download } from "lucide-react";

export default function TransportVouchers() {
  const [data, setData] = useState({
    date: "17 May'2024",
    exoNo: "YT: YATRA 2026",
    fileNo: "02",
    guestName: "Mr. Alladi Balraj Group",
    managerMobile: "9018725486",
    noOfAdults: "03 Adults",
    vehicleType: "01 A/C Swift Dezire Car",
    arrivalDate: "17 May'2026 ~ at Jammu Airport |",
    departureDate: "19 May'2026 ~ at Jammu Airport |",
    favouringGuest: "MR. AIIADI BALRAJ",
    favouringPax: "02",
    favouringVehicle: "01 A/C CAR",
    itinerary: [
      { date: "17 May'2026", details: "Pick up + half day local sightseeing {Sub to arrival timing} & hotel dropping", hotel: "Hotel Sarovar Portico, Katra" },
      { date: "18 May'2026", details: "Katra helipad ~ vaishno devi helipad transfer", hotel: "Self Accommodation" },
      { date: "19 May'2026", details: "Jammu Airport Drop", hotel: "---------------------------------" },
    ]
  });

  const handleItineraryChange = (index: number, field: string, value: string) => {
    const newItinerary = [...data.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setData({ ...data, itinerary: newItinerary });
  };

  const addDay = () => {
    setData({
      ...data,
      itinerary: [...data.itinerary, { date: "", details: "", hotel: "" }]
    });
  };

  const removeDay = (index: number) => {
    setData({
      ...data,
      itinerary: data.itinerary.filter((_, i) => i !== index)
    });
  };

  const handleDownload = async () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;
    
    // Dynamic import to prevent SSR issues
    const html2pdf = (await import("html2pdf.js")).default;
    
    const opt = {
      margin: 0,
      filename: `Transport_Voucher_${data.guestName.replace(/\\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full min-h-[calc(100vh-6rem)]">
      {/* Left Column: Form */}
      <div className="w-full lg:w-[40%] bg-white rounded-lg shadow-sm border border-gray-100 p-6 overflow-y-auto shrink-0 max-h-[calc(100vh-2rem)] custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Transport Voucher Details</h2>
        
        <div className="space-y-6">
          {/* 1. Voucher Meta */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">1. Voucher Meta</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.date} onChange={e => setData({...data, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E.X.O. No</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.exoNo} onChange={e => setData({...data, exoNo: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File No</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.fileNo} onChange={e => setData({...data, fileNo: e.target.value})} />
              </div>
            </div>
          </div>

          {/* 2. Client Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">2. Client Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest/Group Name</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.guestName} onChange={e => setData({...data, guestName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transport Mgr Mobile No.</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.managerMobile} onChange={e => setData({...data, managerMobile: e.target.value})} />
              </div>
            </div>
          </div>

          {/* 3. Transport Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">3. Transport Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Of Adults</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.noOfAdults} onChange={e => setData({...data, noOfAdults: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type Of Vehicle</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.vehicleType} onChange={e => setData({...data, vehicleType: e.target.value})} />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date & Location</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.arrivalDate} onChange={e => setData({...data, arrivalDate: e.target.value})} />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date & Location</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.departureDate} onChange={e => setData({...data, departureDate: e.target.value})} />
              </div>
            </div>
          </div>
          
          {/* Favouring Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">Favouring Details (Orange Bar)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.favouringGuest} onChange={e => setData({...data, favouringGuest: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pax</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.favouringPax} onChange={e => setData({...data, favouringPax: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.favouringVehicle} onChange={e => setData({...data, favouringVehicle: e.target.value})} />
              </div>
            </div>
          </div>

          {/* 4. Dynamic Itinerary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">4. Dynamic Itinerary</h3>
              <button onClick={addDay} className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-md hover:bg-orange-600 transition-colors">
                <Plus size={14} /> Add Day
              </button>
            </div>
            
            <div className="space-y-3">
              {data.itinerary.map((item, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 bg-slate-50 border border-gray-200 rounded-lg relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Day {i + 1}</label>
                    <button onClick={() => removeDay(i)} className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                      <input type="text" placeholder="e.g., 17 May'2026" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={item.date} onChange={e => handleItineraryChange(i, 'date', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Transfers & Sightseeing</label>
                      <textarea rows={2} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={item.details} onChange={e => handleItineraryChange(i, 'details', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Hotels</label>
                      <input type="text" placeholder="e.g., Hotel Sarovar Portico, Katra" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={item.hotel} onChange={e => handleItineraryChange(i, 'hotel', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Right Column: Preview Wrapper */}
      <div className="w-full lg:w-[60%] flex flex-col gap-4 max-h-[calc(100vh-2rem)]">
        
        {/* Controls Toolbar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-700">Live Preview</h2>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md font-medium text-sm hover:bg-orange-600 transition-colors shadow-sm cursor-pointer">
            <Download size={16} /> Download PDF
          </button>
        </div>
        
        {/* Step B: Scrollable Area */}
        <div className="overflow-x-auto overflow-y-auto bg-slate-200 p-8 flex-1 rounded-lg custom-scrollbar">
          {/* Step C: Centering Wrapper */}
          <div className="flex justify-center min-w-max">
            
            {/* Multi-page PDF Container */}
            <div id="pdf-content" className="flex flex-col bg-slate-200 shadow-2xl">
              
              {/* Step D: PAGE 1 (Transport Voucher) */}
              <div className="w-[210mm] min-h-[297mm] bg-white shrink-0 p-8 flex flex-col text-sm text-gray-900" style={{ fontFamily: "Arial, sans-serif" }}>
                
                {/* Header */}
                <div className="flex flex-col items-center mb-4">
                  <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain mb-3" />
                  <div className="text-xs text-center text-gray-700 leading-snug mb-3">
                    <div>Contact No: <span className="font-semibold">8445214371</span></div>
                    <div>E-mail: <a href="mailto:hospitality.triloki@gmail.com" className="text-blue-600 underline">hospitality.triloki@gmail.com</a></div>
                    <div>Website: <a href="http://www.trilokigroup.in" className="text-[#E65C00] font-bold">www.trilokigroup.in</a></div>
                  </div>
                  <h1 className="text-3xl font-bold text-[#E65C00] tracking-wide uppercase mb-1">TRANSPORT VOUCHER</h1>
                </div>

                {/* Title & Meta Line */}
                <div className="border-t-4 border-[#003366] pt-1 pb-1 border-b-2 mb-4 text-center">
                  <div className="text-[13px] text-black font-bold">
                    Date: {data.date} | E.X.O. No. {data.exoNo} | FILE NO: {data.fileNo}
                  </div>
                </div>

                {/* To Section */}
                <div className="mb-4 text-[13px]">
                  <div className="font-bold text-black text-base mb-1">To,</div>
                  <div className="text-black">{data.guestName}</div>
                  <div className="text-black">Transport Manager Mobile No: <span className="font-bold">{data.managerMobile}</span></div>
                </div>

                {/* Voucher Details Table */}
                <table className="w-full border-collapse border border-[#003366] mb-4 text-[13px]">
                  <thead>
                    <tr>
                      <th className="bg-[#003366] text-white py-2 px-3 text-left uppercase font-bold w-[40%]">VOUCHER DETAILS</th>
                      <th className="bg-[#003366] text-white py-2 px-3 text-left uppercase font-bold w-[60%]">INFORMATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[#003366] py-2 px-3 font-bold text-black">No. Of Adults:</td>
                      <td className="border border-[#003366] py-2 px-3 text-black">{data.noOfAdults}</td>
                    </tr>
                    <tr>
                      <td className="border border-[#003366] py-2 px-3 font-bold text-black">Type Of Vehicle:</td>
                      <td className="border border-[#003366] py-2 px-3 text-black">{data.vehicleType}</td>
                    </tr>
                    <tr>
                      <td className="border border-[#003366] py-2 px-3 font-bold text-black">Arrival Date:</td>
                      <td className="border border-[#003366] py-2 px-3 text-black">{data.arrivalDate}</td>
                    </tr>
                    <tr>
                      <td className="border border-[#003366] py-2 px-3 font-bold text-black">Departure Date:</td>
                      <td className="border border-[#003366] py-2 px-3 text-black">{data.departureDate}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Favouring Line */}
                <div className="bg-[#E65C00] text-white py-1.5 px-3 mb-2 border border-black uppercase font-bold text-[13px]">
                  FAVOURING: {data.favouringGuest} X {data.favouringPax} PAX | {data.favouringVehicle} |
                </div>
                
                <div className="text-[13px] text-black mb-3">
                  Please provide One A/C Car for the following ground arrangements & services:
                </div>

                {/* Transfers & Services Table */}
                <div className="font-bold text-[#003366] uppercase text-base mb-1">TRANSFERS & SERVICES:</div>
                <table className="w-full border-collapse border border-black mb-6 text-[12px]">
                  <thead>
                    <tr>
                      <th className="bg-[#003366] text-white py-2 px-3 text-center uppercase font-bold w-[20%]">DATES</th>
                      <th className="bg-[#003366] text-white py-2 px-3 text-center uppercase font-bold w-[45%]">TRANSFERS & SIGHTSEEING</th>
                      <th className="bg-[#003366] text-white py-2 px-3 text-center uppercase font-bold w-[35%]">HOTELS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.itinerary.map((item, i) => (
                      <tr key={i}>
                        <td className="border border-black py-2 px-3 font-bold text-black text-center whitespace-pre-wrap">{item.date.replace(' ', '\\n')}</td>
                        <td className="border border-black py-2 px-3 text-black">{item.details}</td>
                        <td className="border border-black py-2 px-3 text-black">{item.hotel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Important Notes */}
                <div className="text-[13px] text-black leading-relaxed">
                  <div className="text-[#E65C00] font-bold text-base uppercase mb-1">IMPORTANT NOTES:</div>
                  <div><span className="font-bold">Inclusive Of:</span> All mention sightseeing & transfers, toll taxes, parking & driver allowances etc.</div>
                  <div className="mt-1"><span className="font-bold">Please Note:</span> For any emergency you may directly contact to Mr. Tarun: 8445214371 Or Our Transport Manager: Mr. Nitin Mobile No.: <span className="font-bold">9018725486</span></div>
                  <div className="mt-1"><span className="font-bold">Billing Instruction:</span> Bill us for the mentioned services. Extras to be collected directly.</div>
                </div>

              </div>

              {/* Step D: PAGE 2 (General Terms & Conditions) */}
              <div className="w-[210mm] min-h-[297mm] bg-white shrink-0 p-8 flex flex-col text-sm text-gray-900 border-t border-slate-200" style={{ fontFamily: "Arial, sans-serif" }}>
                
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-[#003366] tracking-wide mb-1">GENERAL TERMS & CONDITIONS</h1>
                  <div className="w-full h-1 bg-[#003366]"></div>
                </div>

                {/* Terms List */}
                <ul className="list-disc pl-6 text-[13px] text-black space-y-3 flex-1 mb-8">
                  <li>M/S Triloki Tours & Travels is an individual travel agency, We provide the complete Amarnath Yatra Helicopter Packages.</li>
                  <li>We are not authorized to sell just helicopter tickets.</li>
                  <li>If there is any Hike in the fares by the relative authorities then the same has to be bear by the clients. The client cannot deny making the difference in the fare if any.</li>
                  <li>M/S Triloki Tours & Travels will not be held responsible for any mishap/accident/injury/death/ Natural disaster, rites, curfew, landslide, or terrorism during the course of the tour.</li>
                  <li>Force Majeure or Acts of God:- During any Package period, unforeseen events can take place, these events may include but may not be limited to the following terrorism, civil unrest, rioting, war, natural disaster, typhoons, floods, landslide, political crisis, curfew.</li>
                  <li>M/s Triloki Tours & Travels can assist you in booking your Flight Tickets or Can book it for you against your request.</li>
                  <li>The Amarnath Yatra Package, once booked by the client is totally under cancellation as per the company's policy.</li>
                  <li>Hotels, Helicopter tickets, and Transport are subject to availability at the time of reservation.</li>
                  <li>Who has made the booking(who is in conversation with our executive) he/ she is only the authorized person on behalf of the whole group to contact the company and its officials regarding any issue in booking, payment update, any amendment in booking and etc.</li>
                  <li>By accessing, using, browsing or booking through our Web Site(s) or Directly or Indirectly through Triloki Tours & Travels or its representative(s), you agree that you have read, understood and agree to be bound by these terms and conditions & cancellation policy and you agree to comply with all applicable laws, rules and regulations.</li>
                  <li>Any dispute relating to or arising out of all or any one of the above-stated terms and conditions shall be subject to the exclusive jurisdiction of Courts at New Delhi, India.</li>
                </ul>

                <div className="w-full h-[1.5px] bg-[#003366] mb-6"></div>

                {/* Footer Signature */}
                <div className="flex flex-col items-center mt-auto">
                  <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain mb-2" />
                  <div className="text-base font-bold text-[#003366] tracking-wide uppercase">TRILOKI TOURS & TRAVELS™</div>
                  <div className="text-xs text-black">Authorized Signatory</div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
