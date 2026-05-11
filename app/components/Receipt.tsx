import React, { forwardRef } from "react";

interface FormData {
  name: string;
  course?: string;
  date?: string;
  time?: string;
  level?: string;
  session?: string;
  feesAmount?: number | string;
  feesType?: string;
  studentId?: string | null;
  receiptNumber?: number | null;
}

interface ReceiptProps {
  formData: FormData;
}

/** Printable area for A5 landscape with 8mm margins on all sides (210×148 mm page). */
export const RECEIPT_INNER_MM = { w: 194, h: 132 } as const;

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>((props, ref) => {
  const { formData } = props;
  const year = new Date().getFullYear();
  return (
    <div
      ref={ref}
      style={{
        color: "#000000",
        width: `${RECEIPT_INNER_MM.w}mm`,
        maxHeight: `${RECEIPT_INNER_MM.h}mm`,
      }}
      className="box-border max-w-full overflow-hidden border border-black bg-white p-3 text-xs text-black shadow-md [print-color-adjust:exact]"
    >
      <div className="mb-2 flex justify-between border-b border-black pb-1.5 text-[11px] font-bold leading-tight">
        <span>RECEIPT NUMBER: {formData.receiptNumber}</span>
        <span>VISE.{year}.CASH</span>
        <span>EXTERNAL USE</span>
      </div>
      <div className="grid grid-cols-12 gap-1.5">
        <div className="border-custom col-span-12 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border p-1.5">
          <span className="shrink-0 font-semibold">Student&apos;s Name:</span>
          <span className="min-w-0 break-words">{formData.name}</span>
        </div>
        <div className="border-custom col-span-6 border p-1.5">
          <span className="font-semibold">Course:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            <span>{formData.course}</span>
          </div>
        </div>
        <div className="border-custom col-span-6 border p-1.5">
          <span className="font-semibold">Date:</span>
          <div className="mt-1 flex items-center">
            <span>{formData.date}</span>
          </div>
        </div>
        <div className="border-custom col-span-6 border p-1.5">
          <span className="font-semibold">Duration:</span>
          <div className="mt-1 flex flex-wrap items-center gap-x-1">
            {formData.time ? (
              <>
                <span>Normal:</span>
                <span>4 Weeks / Time:</span>
                <span>{formData.time}</span>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="border-custom col-span-6 border p-1.5">
          <span className="font-semibold">Level:</span>
          <div className="mt-1 flex items-center">
            <span>{formData.level}</span>
          </div>
        </div>
        <div className="border-custom col-span-6 border p-1.5">
          <span className="font-semibold">Session:</span>
          <div className="mt-1 flex items-center">
            <span>{formData.session}</span>
          </div>
        </div>
        <div className="border-custom col-span-6 border p-1.5">
          <span className="font-semibold">Amount:</span>
          <div className="mt-1 flex items-center">
            <span>{formData.feesAmount}</span>
          </div>
        </div>
        <div className="border-custom col-span-12 flex flex-wrap items-baseline gap-x-2 border p-1.5">
          <span className="shrink-0 font-semibold">Fees Type:</span>
          <span className="min-w-0 break-words">{formData.feesType}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between gap-2 border-t border-black pt-2">
        <div className="w-1/2 border border-black p-2">
          <span className="font-semibold">Signature:</span>
        </div>
        <div className="w-1/4 border border-black p-2">
          <span className="font-semibold">Stamp:</span>
        </div>
      </div>
    </div>
  );
});

Receipt.displayName = "Receipt";

export default Receipt;
