"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InputField from "@/app/components/InputField";
import ModalError from "@/app/components/ModalError";
import Receipt from "@/app/components/Receipt";
import SelectField from "@/app/components/SelectField";
import { fetchGraphQL } from "@/lib/graphql-client";

let html2pdf: ((...args: unknown[]) => { set: (options: unknown) => { from: (node: HTMLElement) => { save: () => Promise<void> } } }) | undefined;
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  html2pdf = require("html2pdf.js");
}

export default function RegistrationPageClient() {
  const [name, setName] = useState("");
  const [session, setSession] = useState("");
  const [course, setCourse] = useState("");
  const [level, setLevel] = useState("");
  const [time, setTime] = useState("");
  const [feesType, setFeesType] = useState("");
  const [feesAmount, setFeesAmount] = useState<number | string>(1600);
  const [date] = useState(new Date().toLocaleDateString());
  const [studentId, setStudentId] = useState<string | null>(null);
  const [receiptNumber, setReceiptNumber] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const sessionOptions = ["Regular", "Mid-month"];
  const courseOptions = ["Communication", "Ilets", "English club", "Esp"];
  const levelOptions = [
    "Pre1",
    "Pre2",
    "Level-1",
    "Level-2",
    "Level-3",
    "Level-4",
    "Level-5",
    "Level-6",
    "Level-7",
    "Level-8",
  ];
  const timeOptions = ["11:00 - 01:00", "01:00 - 03:00", "03:00 - 05:00", "05:00 - 07:00"];
  const feesTypeOptions = ["Register-fees", "Course-fees", "Repeat-fees"];

  const formData = {
    name,
    session,
    course,
    level,
    time,
    feesType,
    feesAmount,
    date,
    studentId,
    receiptNumber,
  };

  const handlePrint = () => {
    if (!receiptRef.current || typeof window === "undefined") return;

    const inlineComputedStyles = (source: Element, target: Element) => {
      const computed = window.getComputedStyle(source);
      const cssText = Array.from(computed)
        .map((prop) => `${prop}: ${computed.getPropertyValue(prop)};`)
        .join(" ");
      target.setAttribute("style", cssText);

      const sourceChildren = Array.from(source.children);
      const targetChildren = Array.from(target.children);
      sourceChildren.forEach((child, index) => {
        const targetChild = targetChildren[index];
        if (targetChild) {
          inlineComputedStyles(child, targetChild);
        }
      });
    };

    const styledClone = receiptRef.current.cloneNode(true) as HTMLElement;
    inlineComputedStyles(receiptRef.current, styledClone);

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { margin: 0; padding: 16px; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>${styledClone.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleSave = async () => {
    if (!receiptRef.current || !html2pdf) return;

    const options = {
      margin: 1,
      filename: "receipt.pdf",
      image: { type: "png", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    await html2pdf().set(options).from(receiptRef.current).save();
  };

  const clearForm = () => {
    setName("");
    setSession("");
    setCourse("");
    setLevel("");
    setTime("");
    setFeesType("");
    setFeesAmount(1600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!name || !time || !level || !feesAmount || !course || !session || !feesType) {
      alert("Please fill in all fields before saving.");
      return;
    }

    setIsSubmitting(true);
    try {
      const addStudentResult = await fetchGraphQL<{ addStudent: { id: string; receiptNumber: number } }>(
        `
        mutation AddStudent($name: String!, $date: String!) {
          addStudent(name: $name, date: $date) {
            id
            receiptNumber
          }
        }
      `,
        { name, date: new Date().toISOString() },
      );

      const student_id = addStudentResult.addStudent.id;
      const receipt_number = addStudentResult.addStudent.receiptNumber;
      setStudentId(student_id);
      setReceiptNumber(receipt_number);

      await fetchGraphQL(
        `
        mutation AddCourse($student_id: ID!, $course_name: String, $course_level: String, $session_type: String, $session_time: String) {
          addCourse(student_id: $student_id, course_name: $course_name, course_level: $course_level, session_type: $session_type, session_time: $session_time) {
            id
          }
        }
      `,
        {
          student_id,
          course_name: course,
          course_level: level,
          session_type: session,
          session_time: time,
        },
      );

      await fetchGraphQL(
        `
        mutation AddFees($student_id: ID!, $fees_type: String, $amount: Float, $date: String!) {
          addFees(student_id: $student_id, fees_type: $fees_type, amount: $amount, date: $date) {
            id
          }
        }
      `,
        {
          student_id,
          fees_type: feesType,
          amount: parseFloat(String(feesAmount)),
          date: new Date().toISOString(),
        },
      );

      handlePrint();
      await handleSave();
      clearForm();
    } catch (error) {
      setOpen(true);
      console.error("Error adding student:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <ModalError open={open} setOpen={setOpen} />
      <div className="bg bg-slate-300 bg-opacity-75 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-[7%]">
        <Image
          src="/vision_logo.png"
          alt="vision logo"
          width={112}
          height={112}
          className="mx-auto mb-5 h-28 w-auto"
        />
        <form onSubmit={handleSubmit} className="grid grid-cols-3 place-items-center gap-4">
          <InputField id="name" label="Name" value={name} onChange={setName} required />
          <SelectField id="time" label="Time" options={timeOptions} value={time} onChange={setTime} />
          <SelectField id="level" label="Level" options={levelOptions} value={level} onChange={setLevel} />
          <InputField
            id="fees-amount"
            label="Fees Amount"
            type="number"
            defaultValue="1600"
            onChange={(value) => setFeesAmount(value)}
          />
          <SelectField
            id="course"
            label="Course"
            options={courseOptions}
            value={course}
            onChange={setCourse}
          />
          <SelectField
            id="session"
            label="Session"
            options={sessionOptions}
            value={session}
            onChange={setSession}
          />
          <SelectField
            id="fees-type"
            label="Fees Type"
            options={feesTypeOptions}
            value={feesType}
            onChange={setFeesType}
            className=""
          />
          <div className="col-start-3 justify-self-end space-x-4 self-end lg:px-10">
            <Button
              className="rounded-lg bg-red-600 text-md text-white duration-150 hover:bg-white hover:text-red-600 active:bg-red-600 active:text-white"
              type="button"
              onClick={clearForm}
            >
              Clear
            </Button>
            <Button
              className="rounded-lg bg-sky-600 text-md text-white duration-150 hover:bg-white hover:text-sky-600 active:bg-sky-600 active:text-white disabled:cursor-not-allowed disabled:bg-sky-400"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save & Print"}
            </Button>
          </div>
        </form>
        <div style={{ display: "none" }}>
          <Receipt ref={receiptRef} formData={formData} />
        </div>
      </div>
    </div>
  );
}
