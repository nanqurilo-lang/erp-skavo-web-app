// "use client";

// import { X, Download } from "lucide-react";

// const BASE_URL = process.env.NEXT_PUBLIC_MAIN!;

// export default function ClientViewPaymentDrawer({
//   open,
//   payment,
//   onClose,
// }: {
//   open: boolean;
//   payment: any;
//   onClose: () => void;
// }) {
//   if (!open || !payment) return null;

//   return (
//     <div className="fixed inset-0 z-[40000]">
//       {/* BACKDROP */}
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />

//       {/* DRAWER */}
//       <div
//         className="absolute top-0 right-0 h-full bg-white shadow-2xl"
//         style={{ width: "35vw", minWidth: 420 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* HEADER */}
//         <div className="flex items-center justify-between px-6 py-4 border-b">
//           <h2 className="text-lg font-semibold">Payment Details</h2>
//           <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
//             <X size={20} />
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="p-6 space-y-4 overflow-y-auto h-[calc(100vh-64px)]">
//           <Detail label="Client" value={payment.client?.name} />
//           <Detail label="Project" value={payment.project?.projectName} />
//           <Detail
//             label="Amount"
//             value={`${payment.currency} ${payment.amount?.toFixed(2)}`}
//           />
//           <Detail
//             label="Payment Gateway"
//             value={payment.paymentGateway?.name}
//           />
//           <Detail label="Transaction ID" value={payment.transactionId} />
//           <Detail
//             label="Payment Date"
//             value={new Date(payment.paymentDate).toLocaleString()}
//           />
//           <Detail label="Status" value={payment.status} />
//           <Detail label="Remark" value={payment.remark} />

//           {/* RECEIPT */}
//           {payment.receiptUrl && (
//             <div className="pt-4">
//               <label className="text-sm text-gray-600 block mb-1">
//                 Receipt
//               </label>
//               <a
//                 href={payment.receiptUrl}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="inline-flex items-center gap-2 text-blue-600 hover:underline"
//               >
//                 <Download size={16} />
//                 Download Receipt
//               </a>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function Detail({ label, value }: { label: string; value?: any }) {
//   return (
//     <div className="border-b pb-2">
//       <div className="text-xs text-gray-500">{label}</div>
//       <div className="text-sm font-medium">
//         {value ?? "--"}
//       </div>
//     </div>
//   );
// }




"use client";

import { X } from "lucide-react";

export default function ViewPaymentDrawer({
  open,
  onClose,
  payment,
}: {
  open: boolean;
  onClose: () => void;
  payment: any;
}) {
  if (!open || !payment) return null;

  return (
    <div className="fixed inset-0 z-[30000]">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className="absolute top-0 right-0 h-full bg-white shadow-2xl"
        style={{ width: "83vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">View Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 text-sm">
          {/* CLIENT / PROJECT */}
          <Info label="Client" value={payment.client?.name} />
          <Info label="Project" value={payment.project?.projectName} />

          {/* PAYMENT INFO */}
          <Info
            label="Amount"
            value={
              payment.currency && payment.amount
                ? `${payment.currency} ${Number(payment.amount).toFixed(2)}`
                : "--"
            }
          />

          <Info
            label="Transaction ID"
            value={payment.transactionId}
          />

          <Info
            label="Payment Gateway"
            value={payment.paymentGateway?.name}
          />

          <Info
            label="Status"
            value={payment.status}
          />

          <Info
            label="Payment Date"
            value={
              payment.paymentDate
                ? new Date(payment.paymentDate).toLocaleDateString("en-GB")
                : "--"
            }
          />

          <Info
            label="Notes / Remark"
            value={payment.note ?? payment.remark}
          />

          {/* RECEIPT (optional, safe) */}
          {payment.receiptUrl && (
            <div>
              <div className="text-gray-500">Receipt</div>
              <a
                href={payment.receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                View / Download Receipt
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Info = ({
  label,
  value,
}: {
  label: string;
  value?: any;
}) => (
  <div>
    <div className="text-gray-500">{label}</div>
    <div className="font-medium">{value ?? "--"}</div>
  </div>
);
