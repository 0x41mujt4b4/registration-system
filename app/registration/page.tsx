"use client";
import { useRef, useState, useEffect } from "react";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ModalError from "../components/ModalError";
import { fetchGraphQL } from "@/lib/graphql-client";
import Receipt from "../components/Receipt";
import { useReactToPrint } from "react-to-print";
import { useSession } from "next-auth/react";
import Image from "next/image";

let html2pdf: any;
if (typeof window !== "undefined") {
  html2pdf = require("html2pdf.js");
}

export default function RegistrationPage() {
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
  const { status } = useSession();

  const sessionOptions = ["Regular", "Mid-month"];
  const courseOptions = ["Communication", "Ilets", "English club", "Esp"];
  const levelOptions = [
    "Pre1", "Pre2", "Level-1", "Level-2", "Level-3",
    "Level-4", "Level-5", "Level-6", "Level-7", "Level-8",
  ];
  const timeOptions = [
    "11:00 - 01:00", "01:00 - 03:00", "03:00 - 05:00", "05:00 - 07:00",
  ];
  const feesTypeOptions = ["Register-fees", "Course-fees", "Repeat-fees"];

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const formData = { name, session, course, level, time, feesType, feesAmount, date, studentId, receiptNumber };

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  const handleSave = async () => {
    if (typeof window !== "undefined" && receiptRef.current) {
      const options = {
        margin: 1,
        filename: "receipt.pdf",
        image: { type: "png", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(options).from(receiptRef.current).save();
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!name || !time || !level || !feesAmount || !course || !session || !feesType) {
      alert("Please fill in all fields before saving.");
      return;
    }

    setIsSubmitting(true);
    try {
      const addStudentResult = await fetchGraphQL<{ addStudent: { id: string, receiptNumber: number } }>(`
        mutation AddStudent($name: String!, $date: String!) {
          addStudent(name: $name, date: $date) {
            id
            receiptNumber
          }
        }
      `, { name, date: new Date().toISOString() });

      const student_id = addStudentResult.addStudent.id;
      const receipt_number = addStudentResult.addStudent.receiptNumber;
      setStudentId(student_id);
      setReceiptNumber(receipt_number);

      await fetchGraphQL(`
        mutation AddCourse($student_id: ID!, $course_name: String, $course_level: String, $session_type: String, $session_time: String) {
          addCourse(student_id: $student_id, course_name: $course_name, course_level: $course_level, session_type: $session_type, session_time: $session_time) {
            id
          }
        }
      `, {
        student_id,
        course_name: course,
        course_level: level,
        session_type: session,
        session_time: time,
      });

      await fetchGraphQL(`
        mutation AddFees($student_id: ID!, $fees_type: String, $amount: Float, $date: String!) {
          addFees(student_id: $student_id, fees_type: $fees_type, amount: $amount, date: $date) {
            id
          }
        }
      `, {
        student_id,
        fees_type: feesType,
        amount: parseFloat(String(feesAmount)),
        date: new Date().toISOString(),
      });

      handlePrint();
      await handleSave();

      setName("");
      setSession("");
      setCourse("");
      setLevel("");
      setTime("");
      setFeesType("");
      setFeesAmount(1600);
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
          className="mx-auto h-28 w-auto mb-5"
        />
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-3 gap-4 place-items-center"
        >
          <InputField
            id="name"
            label="Name"
            value={name}
            onChange={setName}
            required
          />
          <SelectField
            id="time"
            label="Time"
            options={timeOptions}
            value={time}
            onChange={setTime}
          />
          <SelectField
            id="level"
            label="Level"
            options={levelOptions}
            value={level}
            onChange={setLevel}
          />
          <InputField
            id="fees-amount"
            label="Fees Amount"
            type="number"
            defaultValue="1600"
            onChange={(v) => setFeesAmount(v)}
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
          <div className="space-x-4 lg:px-10 col-start-3 justify-self-end self-end">
            <Button
              className="text-md text-white duration-150 bg-red-600 rounded-lg hover:bg-white hover:text-red-600 active:bg-red-600 active:text-white"
              type="button"
              onClick={() => {
                setName(""); setSession(""); setCourse("");
                setLevel(""); setTime(""); setFeesType(""); setFeesAmount(1600);
              }}
            >
              Clear
            </Button>
            <Button
              className="text-md text-white duration-150 bg-sky-600 rounded-lg hover:bg-white hover:text-sky-600 active:bg-sky-600 active:text-white disabled:bg-sky-400 disabled:cursor-not-allowed"
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
