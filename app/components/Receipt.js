import React, { forwardRef } from "react";

const Receipt = forwardRef((props, ref) => {
  const { formData } = props;
  const year = new Date().getFullYear();
  return (
    <div ref={ref} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-black">
      <div className="flex justify-between border-b border-black mb-4 pb-2">
        <span className="font-bold">RECEIPT NUMBER: {formData.studentId}</span>
        <span>VISE.{year}.CASH</span>
        <span>EXTERNAL USE</span>
      </div>
      <div className="grid grid-cols-12 gap-2 text-sm">
        <div className="col-span-12 border-custom border p-2 flex items-center">
            <span className="w-1/3 font-semibold">Student&apos;s Name:</span>
            <span className="w-2/3">{formData.name}</span>
        </div>
        <div className="col-span-6 border-custom border p-2">
          <span className="font-semibold">Course:</span>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="flex items-center">
              {formData.course}
            </label>
          </div>
        </div>
        <div className="col-span-6 border-custom border p-2">
          <span className="font-semibold">Date:</span>
            <div className="flex items-center mt-2">
          <span>{formData.date}</span>
          </div>
        </div>
        <div className="col-span-6 border-custom border p-2">
          <span className="font-semibold">Duration:</span>
          <div className="flex items-center mt-2">
            {formData.time ?
            <>
            <span>Normal:</span>
            <span className="ml-2">4 Weeks / Time:</span>
            <span className="ml-1">{formData.time}</span>
            </> : ''
            }
          </div>
        </div>
        {/* <div className="col-span-6 border-custom border p-2">
          <span className="font-semibold">Private:</span>
          <span className="ml-2">{formData.private}</span>
        </div> */}
        <div className="col-span-6 border-custom border p-2">
          <span className="font-semibold">Level:</span>
          <div className="flex items-center mt-2">
          <span>{formData.level}</span>
          </div>
        </div>
        <div className="col-span-6 border-custom border p-2">
          <span className="font-semibold">Session:</span>
          <div className="flex items-center mt-2">
            <label className="flex items-center mr-4">
              {formData.session}
            </label>
          </div>
        </div>
        <div className="col-span-6 border-custom border p-2">
          <span className="font-semibold">Amount:</span>
          <div className="flex items-center mt-2">
          <span>{formData.feesAmount}</span>
          </div>
        </div>
        <div className="col-span-6 border-custom border p-2">
          <span className="font-semibold">Fees Type:</span>
          <div className="flex items-center mt-2">
          <span>{formData.feesType}</span>
          </div>
        </div>
        <div className="col-span-6 border-custom border p-2">
          <span className="font-semibold">Course:</span>
          <div className="flex items-center mt-2">
          <span>{formData.course}</span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between border-t border-black pt-2">
        <div className="w-1/2 border border-black p-4">
          <span className="font-semibold">Signature:</span>
        </div>
        <div className="w-1/4 border border-black p-4">
          <span className="font-semibold">Stamp:</span>
        </div>
      </div>
    </div>
  );
});

Receipt.displayName = "Receipt";

export default Receipt;
