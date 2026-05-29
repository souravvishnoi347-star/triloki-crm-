"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import Image from "next/image";

export default function HotelVouchers() {
  const [data, setData] = useState({
    date: "17 May'2026",
    exoNo: "YT: YATRA 2026",
    fileNo: "02",
    hotelName: "Sarovar Portico",
    hotelAddress: "Katra , Adjoining Shrine Board Office, Jammu Road, Katra, Jammu & Kashmir- 182301",
    contactNo: "+91 7889941026",
    guestName: "MR. ALLADI BALRAJ X 02 PAX",
    roomType: "01. TRIPLE BED ROOM",
    noOfAdults: "03 Adults",
    noOfRooms: "01 Triple Rooms",
    checkIn: "17 May 2026 {13:00 Hrs}",
    checkOut: "19 May 2026 {11:00 Hrs}",
    noOfNights: "02",
    inclusions: "02 Night accommodation on twin & triple sharing basis.\nBreakfast, Lunch & Dinner at hotel {Veg. Food}.\nInclusive of all currently applicable taxes.",
    confirmationNo: "38106",
    specialRequest: "Please provide Two Triple bed Room on triple sharing basis for (Two Night)"
  });

  const handleDownload = async () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;
    
    // Dynamic import of html2pdf to prevent SSR window is not defined errors
    const html2pdf = (await import("html2pdf.js")).default;
    
    const opt = {
      margin: 0,
      filename: `Hotel_Voucher_${data.hotelName.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full min-h-[calc(100vh-6rem)]">
      {/* Left Column: Form */}
      <div className="w-full lg:w-[40%] bg-white rounded-lg shadow-sm border border-gray-100 p-6 overflow-y-auto shrink-0 max-h-[calc(100vh-2rem)] custom-scrollbar">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Hotel Voucher Details</h2>
        
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

          {/* 2. Hotel Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">2. Hotel Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">"To" (Front office/Hotel Name)</label>
              <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.hotelName} onChange={e => setData({...data, hotelName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea rows={2} className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.hotelAddress} onChange={e => setData({...data, hotelAddress: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
              <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.contactNo} onChange={e => setData({...data, contactNo: e.target.value})} />
            </div>
          </div>

          {/* 3. Booking Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">3. Booking Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name (Favouring)</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.guestName} onChange={e => setData({...data, guestName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.roomType} onChange={e => setData({...data, roomType: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. of Adults</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.noOfAdults} onChange={e => setData({...data, noOfAdults: e.target.value})} />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">No. of Rooms</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.noOfRooms} onChange={e => setData({...data, noOfRooms: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-In Date & Time</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.checkIn} onChange={e => setData({...data, checkIn: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Date & Time</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.checkOut} onChange={e => setData({...data, checkOut: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. of Nights</label>
                <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.noOfNights} onChange={e => setData({...data, noOfNights: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Request / Note</label>
              <textarea rows={2} className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.specialRequest} onChange={e => setData({...data, specialRequest: e.target.value})} />
            </div>
          </div>

          {/* 4. Inclusions & Policies */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">4. Inclusions & Policies</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation No</label>
              <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.confirmationNo} onChange={e => setData({...data, confirmationNo: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Cost Includes</label>
              <textarea rows={4} className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900" value={data.inclusions} onChange={e => setData({...data, inclusions: e.target.value})} />
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
            {/* Step D: The A4 Paper */}
            <div id="pdf-content" className="w-[210mm] min-h-[297mm] bg-white shadow-xl shrink-0 p-8 flex flex-col text-sm text-gray-900" style={{ fontFamily: "Arial, sans-serif" }}>
              
              {/* Header */}
              <div className="flex flex-col items-center mb-6 border-b-4 border-[#E65C00] pb-6">
                <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain mb-3" />
                <h1 className="text-2xl font-bold text-[#003366] tracking-wide mb-2 uppercase">TRILOKI TOURS & TRAVELS™</h1>
                <div className="text-xs text-center text-gray-700 leading-snug">
                  <div>Contact No: <span className="font-semibold">8445214371</span></div>
                  <div>E-mail: <a href="mailto:hospitality.triloki@gmail.com" className="text-blue-600 underline">hospitality.triloki@gmail.com</a></div>
                  <div>Website: <a href="http://www.trilokigroup.in" className="text-blue-600 underline">www.trilokigroup.in</a></div>
                </div>
              </div>

              {/* Title & Meta */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#E65C00] mb-2">Hotel Service Voucher</h2>
                <div className="text-xs text-gray-600 font-medium">
                  Date: {data.date} | E.X.O. No. {data.exoNo} | FILE NO: {data.fileNo}
                </div>
              </div>

              {/* To Section */}
              <div className="mb-4">
                <div className="font-bold text-[#003366] text-base mb-1">To,</div>
                <div className="text-gray-700 mb-2">The Front Office.</div>
                <div className="font-bold text-black">{data.hotelName}</div>
                <div className="text-black leading-tight text-[13px]">{data.hotelAddress}</div>
              </div>

              {/* Booking Details Table */}
              <table className="w-full border-collapse border border-[#003366] mb-6 text-[13px]">
                <thead>
                  <tr>
                    <th colSpan={2} className="bg-[#003366] text-white py-2 px-3 text-left uppercase tracking-wider font-bold">BOOKING DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[#003366] py-2 px-3 font-bold text-[#003366] w-1/3">No. Of Adults:</td>
                    <td className="border border-[#003366] py-2 px-3 text-black">{data.noOfAdults}</td>
                  </tr>
                  <tr>
                    <td className="border border-[#003366] py-2 px-3 font-bold text-[#003366]">No. Of Rooms:</td>
                    <td className="border border-[#003366] py-2 px-3 text-black">{data.noOfRooms}</td>
                  </tr>
                  <tr>
                    <td className="border border-[#003366] py-2 px-3 font-bold text-[#003366]">Check In:</td>
                    <td className="border border-[#003366] py-2 px-3 text-black">{data.checkIn}</td>
                  </tr>
                  <tr>
                    <td className="border border-[#003366] py-2 px-3 font-bold text-[#003366]">Check Out:</td>
                    <td className="border border-[#003366] py-2 px-3 text-black">{data.checkOut}</td>
                  </tr>
                  <tr>
                    <td className="border border-[#003366] py-2 px-3 font-bold text-[#003366]">No. Of Nights:</td>
                    <td className="border border-[#003366] py-2 px-3 text-black">{data.noOfNights}</td>
                  </tr>
                </tbody>
              </table>

              {/* Orange Hotel Box */}
              <div className="bg-[#E65C00] text-white p-4 text-center mb-6 border border-black shadow-sm">
                <div className="font-bold text-lg mb-1 uppercase">HOTEL {data.hotelName.toUpperCase()}</div>
                <div className="text-xs leading-tight opacity-95 uppercase">
                  {data.hotelAddress}
                </div>
                <div className="text-sm font-bold mt-1">
                  Tel: {data.contactNo}
                </div>
              </div>

              {/* Favouring Details */}
              <div className="border-t-2 border-b-2 border-[#003366] py-1 mb-3">
                <div className="font-bold">
                  <span className="text-[#003366]">FAVOURING: </span>
                  <span className="text-[#E65C00] uppercase">{data.guestName} | {data.roomType} |</span>
                </div>
              </div>
              <div className="text-[13px] text-gray-800 mb-6">
                {data.specialRequest}
              </div>

              {/* Package Cost Includes */}
              <div className="mb-6">
                <div className="font-bold text-[#003366] mb-2 text-[14px]">Package Cost Includes:</div>
                <ul className="list-disc pl-8 text-[13px] text-black space-y-0.5">
                  {data.inclusions.split('\\n').map((inc, i) => (
                    <li key={i}>{inc}</li>
                  ))}
                </ul>
              </div>

              {/* Policies Table */}
              <table className="w-full border-collapse border border-black text-[11px] mb-8 leading-tight">
                <tbody>
                  <tr>
                    <td className="border border-black py-2 px-3 font-bold text-black w-[22%]">Confirmation No.</td>
                    <td className="border border-black py-2 px-3 font-bold text-black w-[28%]">{data.confirmationNo}</td>
                    <td className="border border-black py-2 px-3 font-bold text-black w-[22%]">Billing Instructions</td>
                    <td className="border border-black py-2 px-3 font-bold text-black w-[28%] uppercase">RR TO TA EXTRA DIRECT</td>
                  </tr>
                  <tr>
                    <td className="border border-black py-2 px-3 font-bold text-black text-center">General Inclusions</td>
                    <td colSpan={3} className="border border-black py-2 px-3 font-bold text-black">
                      24-hour unlimited Wi-Fi in room and public area.<br/>
                      Complimentary Breakfast will be served in "Ameyaa" Restaurant<br/>
                      (Timing 07:30 AM to 10:30 AM), if included in the package.<br/>
                      Complimentary 02 packaged drinking water bottles.<br/>
                      Free access to swimming pool (As per the hotel timings and<br/>
                      swimming costumes are necessary).<br/>
                      In room Tea / Coffee making facility available in room.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-2 px-3 font-bold text-black text-center">Standard check-in / Check-out time</td>
                    <td colSpan={3} className="border border-black py-2 px-3 font-bold text-black">
                      Hotel check-in time is 1400 HRS and check-out time is 1200 HRS.<br/>
                      An early check-in or late check-out would be subject to availability<br/>
                      and charged accordingly. Any early departure would be liable to<br/>
                      pay room night charges for the entire duration of stay.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-2 px-3 font-bold text-black text-center">Cancellation Policy</td>
                    <td colSpan={3} className="border border-black py-2 px-3 font-bold text-black">
                      If you wish to cancel your room reservation, you will need to inform<br/>
                      the hotel prior to 72 hrs. of arrival. Bookings that are cancelled<br/>
                      within 72 hrs. of the arrival date will incur one (1) night<br/>
                      accommodation as a cancellation penalty. In case of No-Show Full<br/>
                      stay retention charges will be applicable.<br/>
                      In case of group reservation, which is 7 rooms and above,<br/>
                      cancellation period without any charges will be 10 days prior to the<br/>
                      arrival. If reservation is cancelled within 10 days of arrival retention<br/>
                      for full duration of stay will be charged.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-2 px-3 font-bold text-black text-center">Photo ID Policy</td>
                    <td colSpan={3} className="border border-black py-2 px-3 font-bold text-black">
                      As per government directives, it is mandatory for all guests to<br/>
                      show their original valid Photo ID at the time of Check-in, which can<br/>
                      be in the form of Passport, Driving License, Adhaar card or Voter ID<br/>
                      Card. Failing which the hotel reserves the right of refusal. As per<br/>
                      Punjab Government, PAN card would not be considered as a valid<br/>
                      ID proof as address is not mentioned on it.<br/>
                      Note: For foreign nationalist passport and valid visa is mandatory.<br/>
                      On failing to provide the required documents hotel will not be able<br/>
                      to provide check in to the guest.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-2 px-3 font-bold text-black text-center">Child Policy</td>
                    <td colSpan={3} className="border border-black py-2 px-3 font-bold text-black">
                      Child aged 5 years and below is complimentary sharing bed with<br/>
                      the parents.<br/>
                      Child aged between 6 to 12 years will be complimentary sharing<br/>
                      bed with parents and will be charged half of price for buffet<br/>
                      breakfast.<br/>
                      Child aged 12 years and above will be considered as an adult and<br/>
                      need to have an extra bed @ 1500 + taxes (INR) as applicable with<br/>
                      breakfast included.<br/><br/>
                      Note: Extra bed can only be placed in deluxe and executive rooms,<br/>
                      each room can contain 01 extra bed.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-2 px-3 font-bold text-black text-center">Smoking / Alcohol</td>
                    <td colSpan={3} className="border border-black py-2 px-3 font-bold text-black">
                      This property is fully non-alcoholic.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-2 px-3 font-bold text-black text-center">Tax structure</td>
                    <td colSpan={3} className="border border-black py-2 px-3 font-bold text-black">
                      Till date 12% GST is applicable on room bills and 18% on<br/>
                      food and beverages.<br/>
                      Any additional/new taxes or charges levied by the<br/>
                      government; local bodies will be applicable accordingly.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-2 px-3 font-bold text-black text-center">Outside food</td>
                    <td colSpan={3} className="border border-black py-2 px-3 font-bold text-black">
                      No outside food is allowed in hotel.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black py-2 px-3"></td>
                    <td colSpan={3} className="border border-black py-2 px-3 font-bold text-black">
                      Kindly send us the deposit or transfer receipt for our<br/>
                      account reference
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="border border-black py-2 px-3 font-bold text-black">
                      kindly provide GSTIN if required on bill before check-out , in case of failure GST modification<br/>
                      can be done within 30 days of Guest Check-out as per the Government norms
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Footer */}
              <div className="mt-auto border-t-[3px] border-[#E65C00] pt-4 pb-2">
                <div className="text-[13px] text-gray-700">
                  <span className="font-bold text-[#003366]">Billing Instruction:</span> Bill us for the mentioned services. Extras to be collected directly.
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
