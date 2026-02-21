
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { X } from "lucide-react";

// export default function EditPaymentModal({
//   payment,
//   onClose,
// }: {
//   payment: any;
//   onClose: () => void;
// }) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const [project, setProject] = useState("");
//   const [client, setClient] = useState("");
//   const [invoice, setInvoice] = useState("");
//   const [amount, setAmount] = useState("");
//   const [currency, setCurrency] = useState("USD");
//   const [transactionId, setTransactionId] = useState("");
//   const [paymentGateway, setPaymentGateway] = useState("");
//   const [remark, setRemark] = useState("");
//   const [receiptFile, setReceiptFile] = useState<File | null>(null);

//   // Prefill data
//   useEffect(() => {
//     if (!payment) return;

//     setProject(payment.project ?? "");
//     setClient(payment.client?.name ?? "");
//     setInvoice(payment.invoice ?? "");
//     setAmount(String(payment.amount ?? ""));
//     setCurrency(payment.currency ?? "USD");
//     setTransactionId(payment.transactionId ?? "");
//     setPaymentGateway(payment.paymentGateway ?? "");
//     setRemark(payment.remark ?? "");
//   }, [payment]);

//   const handleFileClick = () => fileInputRef.current?.click();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setReceiptFile(e.target.files?.[0] ?? null);
//   };

//   const handleUpdate = () => {
//     const payload = {
//       id: payment.id,
//       project,
//       client,
//       invoice,
//       amount,
//       currency,
//       transactionId,
//       paymentGateway,
//       remark,
//       receiptFileName: receiptFile?.name ?? payment.receiptFileUrl,
//     };

//     console.log("Update Payment:", payload);

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[13000] flex items-start justify-center pt-8 px-4 overflow-y-auto">
//       <div
//         className="fixed inset-0 bg-black/40"
//         onClick={onClose}
//       />

//       <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl z-10">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="text-lg font-semibold">
//             Edit Payment Details
//           </h3>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded"
//           >
//             <X />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-6">
//           <div className="rounded-lg border p-4">
//             <h4 className="font-medium mb-3">Payment Details</h4>

//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label className="text-sm text-gray-600">Project *</label>
//                 <input
//                   className="w-full border rounded px-3 py-2"
//                   value={project}
//                   onChange={(e) => setProject(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-600">Client *</label>
//                 <input
//                   className="w-full border rounded px-3 py-2"
//                   value={client}
//                   onChange={(e) => setClient(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-600">Invoice *</label>
//                 <input
//                   className="w-full border rounded px-3 py-2"
//                   value={invoice}
//                   onChange={(e) => setInvoice(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-600">Amount *</label>
//                 <input
//                   className="w-full border rounded px-3 py-2"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-600">Currency *</label>
//                 <select
//                   value={currency}
//                   onChange={(e) => setCurrency(e.target.value)}
//                   className="w-full border rounded px-3 py-2"
//                 >
//                   <option value="USD">USD $</option>
//                   <option value="INR">INR ₹</option>
//                   <option value="EUR">EUR €</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-sm text-gray-600">
//                   Transaction Id
//                 </label>
//                 <input
//                   className="w-full border rounded px-3 py-2"
//                   value={transactionId}
//                   onChange={(e) => setTransactionId(e.target.value)}
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="text-sm text-gray-600">
//                   Payment Gateway
//                 </label>
//                 <input
//                   className="w-full border rounded px-3 py-2"
//                   value={paymentGateway}
//                   onChange={(e) => setPaymentGateway(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Receipt */}
//             <div className="mt-4">
//               <label className="text-sm text-gray-600 block mb-2">
//                 Receipt
//               </label>
//               <div
//                 onClick={handleFileClick}
//                 className="border-2 border-dashed rounded-lg h-28 flex items-center justify-center cursor-pointer text-gray-500"
//               >
//                 <div className="text-center">
//                   <div className="mb-1">Choose a file</div>
//                   <div className="text-xs text-gray-400">
//                     {receiptFile
//                       ? receiptFile.name
//                       : payment.receiptFileUrl || "Drag & drop or click"}
//                   </div>
//                 </div>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />
//               </div>
//             </div>

//             {/* Remark */}
//             <div className="mt-4">
//               <label className="text-sm text-gray-600 block mb-2">
//                 Remark
//               </label>
//               <textarea
//                 rows={4}
//                 value={remark}
//                 onChange={(e) => setRemark(e.target.value)}
//                 className="w-full p-3 border rounded"
//               />
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex items-center justify-end gap-3">
//             <button
//               className="px-4 py-2 border rounded"
//               onClick={onClose}
//             >
//               Cancel
//             </button>

//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//               onClick={handleUpdate}
//             >
//               Update
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const BASE_URL = `${process.env.NEXT_PUBLIC_MAIN}`;

export default function EditPaymentModal({
  payment,
  onClose,
}: {
  payment: any;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [transactionId, setTransactionId] = useState("");
  const [paymentGatewayId, setPaymentGatewayId] = useState<number | null>(null);
  const [status, setStatus] = useState("COMPLETED");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill from API response
  useEffect(() => {
    if (!payment) return;

    setAmount(String(payment.amount ?? ""));
    setCurrency(payment.currency ?? "USD");
    setTransactionId(payment.transactionId ?? "");
    setPaymentGatewayId(payment.paymentGateway?.id ?? null);
    setStatus(payment.status ?? "COMPLETED");
    setNotes(payment.note ?? "");
  }, [payment]);

  const handleUpdate = async () => {
    if (!payment?.id) return;

    try {
      setLoading(true);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;



console.log("Updating payment with:", payment, {
    amount: Number(amount),
    currency,
    transactionId,
    paymentGatewayId: paymentGatewayId,  // ✅ THIS
    status,
    note: notes, // ✅ NOT notes
  })


    //   const res = await fetch(
    //     `${BASE_URL}/api/payments/${payment.id}`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //         Authorization: token ? `Bearer ${token}` : "",
    //       },
    //       body: JSON.stringify({
    //         amount: Number(amount),
    //         currency,
    //         transactionId,
    //         paymentGatewayId,
    //         status,
    //         notes,
    //       }),
    //     }
    //   );

    //   if (!res.ok) {
    //     const txt = await res.text();
    //     console.error("Update failed:", txt);
    //     alert("Failed to update payment");
    //     return;
    //   }






//     const res = await fetch(`${BASE_URL}/api/payments/${payment.id}`, {
//   method: "PUT",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//   },
//   body: JSON.stringify({
//     amount: Number(amount),
//     currency,
//     transactionId,
//     // paymentGatewayId: paymentGatewayId ?? undefined,
//     paymentGateway: p.paymentGateway ?? null,

//     status,
//     notes,
//   }),
// });

const res = await fetch(`${BASE_URL}/api/payments/${payment.id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  body: JSON.stringify({
    amount: Number(amount),
    currency,
    transactionId,
    paymentGatewayId: paymentGatewayId,  // ✅ THIS
    status,
    note: notes, // ✅ NOT notes
  }),
});


const data = await res.json().catch(() => null);

if (!res.ok) {
  console.error("Status:", res.status);
  console.error("Response:", data);
  alert(data?.message || "Failed to update payment");
  return;
}




      
     

      alert("Payment updated successfully ✅");
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // return (
    // <div className="fixed inset-0 z-[13000] flex items-start justify-center pt-8 px-4 overflow-y-auto">
    //   <div
    //     className="fixed inset-0 bg-black/40"
    //     onClick={onClose}
    //   />



    //   <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl z-10">
    //     {/* Header */}
    //     <div className="flex items-center justify-between p-4 border-b">
    //       <h3 className="text-lg font-semibold">
    //         Edit Payment Details
    //       </h3>
    //       <button
    //         onClick={onClose}
    //         className="p-2 hover:bg-gray-100 rounded"
    //       >
    //         <X />
    //       </button>
    //     </div>






return (
  <div className="fixed inset-0 z-[13000] flex justify-end">
    
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={onClose}
    />

    {/* Right Drawer */}
    <div className="relative w-[83%] max-w-[1280px] h-full bg-white shadow-2xl border-l overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">
          Edit Payment Details
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <X />
        </button>
      </div>





        {/* Body */}
        <div className="p-6 space-y-5">

          <div>
            <label className="text-sm text-gray-600">Amount *</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Currency *</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Transaction Id</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Payment Gateway Id *</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={paymentGatewayId ?? ""}
              onChange={(e) =>
                setPaymentGatewayId(Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="COMPLETED">COMPLETED</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Notes</label>
            <textarea
              rows={3}
              className="w-full border rounded px-3 py-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              className="px-4 py-2 border rounded"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleUpdate}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
