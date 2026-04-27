"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InputField from "@/app/components/InputField";
import ModalError from "@/app/components/ModalError";
import Receipt from "@/app/components/Receipt";
import SelectField from "@/app/components/SelectField";
import { fetchGraphQL, toUserFriendlyErrorMessage } from "@/lib/graphql-client";

let html2pdf: ((...args: unknown[]) => { set: (options: unknown) => { from: (node: HTMLElement) => { save: () => Promise<void> } } }) | undefined;
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  html2pdf = require("html2pdf.js");
}

const SESSION_OPTIONS = ["Regular", "Mid-month"] as const;
const COURSE_OPTIONS = ["Communication", "Ilets", "English club", "Esp"] as const;
const LEVEL_OPTIONS = [
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
] as const;
const TIME_OPTIONS = ["11:00 - 01:00", "01:00 - 03:00", "03:00 - 05:00", "05:00 - 07:00"] as const;
const FEES_TYPE_OPTIONS = ["Register-fees", "Course-fees", "Repeat-fees"] as const;

export default function RegistrationPageClient() {
  const [name, setName] = useState("");
  const [session, setSession] = useState<string>(SESSION_OPTIONS[0]);
  const [course, setCourse] = useState<string>(COURSE_OPTIONS[0]);
  const [level, setLevel] = useState<string>(LEVEL_OPTIONS[0]);
  const [time, setTime] = useState<string>(TIME_OPTIONS[0]);
  const [feesType, setFeesType] = useState<string>(FEES_TYPE_OPTIONS[0]);
  const [feesAmount, setFeesAmount] = useState<number | string>(1600);
  const [date] = useState(new Date().toLocaleDateString());
  const [studentId, setStudentId] = useState<string | null>(null);
  const [receiptNumber, setReceiptNumber] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

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
    setSession(SESSION_OPTIONS[0]);
    setCourse(COURSE_OPTIONS[0]);
    setLevel(LEVEL_OPTIONS[0]);
    setTime(TIME_OPTIONS[0]);
    setFeesType(FEES_TYPE_OPTIONS[0]);
    setFeesAmount(1600);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const feesNum = parseFloat(String(feesAmount));
    if (!name.trim() || Number.isNaN(feesNum) || feesNum <= 0) {
      alert("Please enter a valid name and fees amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const addStudentResult = await fetchGraphQL<{ addStudent: { id: string; receiptNumber: number } }>(
        `
        mutation AddStudent(
          $name: String!
          $time: String!
          $feesAmount: Float!
          $feesType: String!
          $course: String!
          $level: String!
          $session: String!
          $paymentDate: String
        ) {
          addStudent(
            name: $name
            time: $time
            feesAmount: $feesAmount
            feesType: $feesType
            course: $course
            level: $level
            session: $session
            paymentDate: $paymentDate
          ) {
            id
            receiptNumber
          }
        }
      `,
        {
          name,
          time,
          feesAmount: feesNum,
          feesType,
          course,
          level,
          session,
          paymentDate: new Date().toISOString(),
        },
      );

      if (!addStudentResult.success) {
        setErrorMessage(toUserFriendlyErrorMessage(new Error(addStudentResult.error)));
        setOpen(true);
        return;
      }

      const student_id = addStudentResult.data.addStudent.id;
      const receipt_number = addStudentResult.data.addStudent.receiptNumber;
      setStudentId(student_id);
      setReceiptNumber(receipt_number);

      handlePrint();
      await handleSave();
      clearForm();
    } catch (error) {
      console.warn("[Registration] save failed (unexpected)", {
        error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
      });
      setErrorMessage(toUserFriendlyErrorMessage(error));
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <ModalError
        open={open}
        setOpen={setOpen}
        title="Could not save student"
        message={errorMessage || "Please try again."}
      />
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
          <SelectField id="time" label="Time" options={[...TIME_OPTIONS]} value={time} onChange={setTime} />
          <SelectField id="level" label="Level" options={[...LEVEL_OPTIONS]} value={level} onChange={setLevel} />
          <InputField
            id="fees-amount"
            label="Fees Amount"
            type="number"
            value={feesAmount}
            onChange={(value) => setFeesAmount(value)}
          />
          <SelectField
            id="course"
            label="Course"
            options={[...COURSE_OPTIONS]}
            value={course}
            onChange={setCourse}
          />
          <SelectField
            id="session"
            label="Session"
            options={[...SESSION_OPTIONS]}
            value={session}
            onChange={setSession}
          />
          <SelectField
            id="fees-type"
            label="Fees Type"
            options={[...FEES_TYPE_OPTIONS]}
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
