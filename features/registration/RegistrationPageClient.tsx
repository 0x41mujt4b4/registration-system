"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InputField from "@/app/components/InputField";
import ModalError from "@/app/components/ModalError";
import Receipt, { RECEIPT_INNER_MM } from "@/app/components/Receipt";
import SelectField from "@/app/components/SelectField";
import { fetchGraphQL, toUserFriendlyErrorMessage } from "@/lib/graphql-client";
import { IRegistrationOptions } from "@/types";

let html2pdf: ((...args: unknown[]) => { set: (options: unknown) => { from: (node: HTMLElement) => { save: () => Promise<void> } } }) | undefined;
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  html2pdf = require("html2pdf.js");
}

const DEFAULT_REGISTRATION_OPTIONS: IRegistrationOptions = {
  sessionOptions: ["Regular", "Mid-month"],
  courseOptions: ["Communication", "Ilets", "English club", "Esp"],
  levelOptions: ["Pre1", "Pre2", "Level-1", "Level-2", "Level-3", "Level-4", "Level-5", "Level-6", "Level-7", "Level-8"],
  timeOptions: ["11:00 - 01:00", "01:00 - 03:00", "03:00 - 05:00", "05:00 - 07:00"],
  feesTypeOptions: ["Register-fees", "Course-fees", "Repeat-fees"],
  defaultFeesAmount: 1600,
};

function firstOption(options: string[], fallback: string): string {
  return options[0] ?? fallback;
}

export default function RegistrationPageClient() {
  const [registrationOptions, setRegistrationOptions] = useState<IRegistrationOptions | null>(null);
  const [name, setName] = useState("");
  const [session, setSession] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [feesType, setFeesType] = useState<string>("");
  const [feesAmount, setFeesAmount] = useState<number | string>("");
  const [date] = useState(new Date().toLocaleDateString());
  const [studentId, setStudentId] = useState<string | null>(null);
  const [receiptNumber, setReceiptNumber] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadOptions = async () => {
      let effectiveOptions = DEFAULT_REGISTRATION_OPTIONS;
      const result = await fetchGraphQL<{ getRegistrationOptions: IRegistrationOptions }>(`
        query GetRegistrationOptions {
          getRegistrationOptions {
            sessionOptions
            courseOptions
            levelOptions
            timeOptions
            feesTypeOptions
            defaultFeesAmount
          }
        }
      `);

      if (result.success) {
        effectiveOptions = result.data.getRegistrationOptions;
      }

      setRegistrationOptions(effectiveOptions);
      setSession(firstOption(effectiveOptions.sessionOptions, firstOption(DEFAULT_REGISTRATION_OPTIONS.sessionOptions, "Regular")));
      setCourse(firstOption(effectiveOptions.courseOptions, firstOption(DEFAULT_REGISTRATION_OPTIONS.courseOptions, "Communication")));
      setLevel(firstOption(effectiveOptions.levelOptions, firstOption(DEFAULT_REGISTRATION_OPTIONS.levelOptions, "Pre1")));
      setTime(firstOption(effectiveOptions.timeOptions, firstOption(DEFAULT_REGISTRATION_OPTIONS.timeOptions, "11:00 - 01:00")));
      setFeesType(firstOption(effectiveOptions.feesTypeOptions, firstOption(DEFAULT_REGISTRATION_OPTIONS.feesTypeOptions, "Register-fees")));
      setFeesAmount(effectiveOptions.defaultFeesAmount ?? DEFAULT_REGISTRATION_OPTIONS.defaultFeesAmount);
      setLoadingOptions(false);
    };
    void loadOptions();
  }, []);

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
            @page { size: 210mm 148mm; margin: 8mm; }
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; color: #000000; background: #ffffff; }
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
      margin: 8,
      filename: "receipt.pdf",
      image: { type: "png", quality: 1 },
      html2canvas: { scale: 2, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: [210, 148] as [number, number], orientation: "l" },
    };
    await html2pdf().set(options).from(receiptRef.current).save();
  };

  const clearForm = () => {
    const options = registrationOptions ?? DEFAULT_REGISTRATION_OPTIONS;
    setName("");
    setSession(firstOption(options.sessionOptions, firstOption(DEFAULT_REGISTRATION_OPTIONS.sessionOptions, "Regular")));
    setCourse(firstOption(options.courseOptions, firstOption(DEFAULT_REGISTRATION_OPTIONS.courseOptions, "Communication")));
    setLevel(firstOption(options.levelOptions, firstOption(DEFAULT_REGISTRATION_OPTIONS.levelOptions, "Pre1")));
    setTime(firstOption(options.timeOptions, firstOption(DEFAULT_REGISTRATION_OPTIONS.timeOptions, "11:00 - 01:00")));
    setFeesType(firstOption(options.feesTypeOptions, firstOption(DEFAULT_REGISTRATION_OPTIONS.feesTypeOptions, "Register-fees")));
    setFeesAmount(options.defaultFeesAmount ?? DEFAULT_REGISTRATION_OPTIONS.defaultFeesAmount);
    setErrorMessage("");
  };

  const clearAllFields = () => {
    setName("");
    setSession("");
    setCourse("");
    setLevel("");
    setTime("");
    setFeesType("");
    setFeesAmount("");
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
    if (!feesType) {
      alert("Please select a Fees Type.");
      return;
    }

    setIsSubmitting(true);
    try {
      const optionalOrUndefined = (value: string) => (value && value.trim() ? value : undefined);

      const addStudentResult = await fetchGraphQL<{ addStudent: { id: string; receiptNumber: number } }>(
        `
        mutation AddStudent(
          $name: String!
          $feesAmount: Float!
          $feesType: String!
          $time: String
          $course: String
          $level: String
          $session: String
          $paymentDate: String
        ) {
          addStudent(
            name: $name
            feesAmount: $feesAmount
            feesType: $feesType
            time: $time
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
          feesAmount: feesNum,
          feesType,
          time: optionalOrUndefined(time),
          course: optionalOrUndefined(course),
          level: optionalOrUndefined(level),
          session: optionalOrUndefined(session),
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
      flushSync(() => {
        setStudentId(student_id);
        setReceiptNumber(receipt_number);
      });

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
    <main className="mx-auto w-full max-w-7xl px-4 py-6 text-slate-800">
      <ModalError
        open={open}
        setOpen={setOpen}
        title="Could not save student"
        message={errorMessage || "Please try again."}
      />
      <div className="surface-elevated w-full rounded-xl p-6 md:p-8">
        <Image
          src="/vision_logo.png"
          alt="vision logo"
          width={112}
          height={112}
          className="mx-auto mb-5 h-28 w-auto"
        />
        {loadingOptions || !registrationOptions ? (
          <div className="py-8 text-center text-sm text-slate-600">Loading registration options...</div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InputField id="name" label="Name" value={name} onChange={setName} required />
          <SelectField
            id="time"
            label="Time"
            placeholder="Select time"
            options={registrationOptions.timeOptions}
            value={time}
            onChange={setTime}
          />
          <SelectField
            id="level"
            label="Level"
            placeholder="Select level"
            options={registrationOptions.levelOptions}
            value={level}
            onChange={setLevel}
          />
          <InputField
            id="fees-amount"
            label="Fees Amount"
            type="number"
            value={feesAmount}
            onChange={(value) => setFeesAmount(value)}
            required
          />
          <SelectField
            id="course"
            label="Course"
            placeholder="Select course"
            options={registrationOptions.courseOptions}
            value={course}
            onChange={setCourse}
          />
          <SelectField
            id="session"
            label="Session"
            placeholder="Select session"
            options={registrationOptions.sessionOptions}
            value={session}
            onChange={setSession}
          />
          <SelectField
            id="fees-type"
            label="Fees Type"
            placeholder="Select fees type"
            options={registrationOptions.feesTypeOptions}
            value={feesType}
            onChange={setFeesType}
            required
            className=""
          />
          <div className="flex flex-wrap justify-end gap-3 md:col-span-2 xl:col-span-3">
            <Button
              className="rounded-lg bg-red-600 text-md text-white duration-150 hover:bg-white hover:text-red-600 active:bg-red-600 active:text-white"
              type="button"
              onClick={clearAllFields}
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
        )}
        <div
          className="pointer-events-none fixed left-[-10000px] top-0 z-[-1] bg-white text-black"
          style={{ width: `${RECEIPT_INNER_MM.w}mm`, maxWidth: `${RECEIPT_INNER_MM.w}mm` }}
          aria-hidden
        >
          <Receipt ref={receiptRef} formData={formData} />
        </div>
      </div>
    </main>
  );
}
