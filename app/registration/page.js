"use client";
import React, { useState } from "react";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import { Button } from "@/components/ui/button";
// import { useRouter } from 'next/navigation';
import ModalSuccess from "../components/ModalSuccess";
import getStudents from "@/server/getStudents";
import { date } from "zod";
import addStudent from "@/server/addStudent";
import addCourse from "@/server/addCourse";
import addFees from "@/server/addFees";


export default function RegistrationPage() {
  const [name, setName] = useState("");
  const [session, setSession] = useState("");
  const [course, setCourse] = useState("");
  const [level, setLevel] = useState("");
  const [time, setTime] = useState("");
  const [feesType, setFeesType] = useState("");
  const [feesAmount, setFeesAmount] = useState(1600);

  const sessionOptions = ["Regular", "Mid-month"];
  const courseOptions = ["Communication", "Ilets", "English club", "Esp"];
  const levelOptions = ["Pre1", "Pre2", "Level-1", "Level-2", "Level-3", "Level-4", "Level-5", "Level-6", "Level-7", "Level-8"];
  const timeOptions = ["11:00 ~ 1:00", "1:00 ~ 3:00", "3:00 ~ 5:00", "5:00 ~ 7:00", "None"];
  const feesTypeOptions = ["Register-fees", "Course-fees", "Repeat-fees"];
  // const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // add student to the database then use the student id to add course & fees
      const student_id = await addStudent({ name, date: new Date() });
      await addCourse({ student_id, course_name: course, course_level: level, session_type: session, session_time: time });
      await addFees({ student_id, fees_type: feesType, amount: feesAmount, date: new Date()});
      // console.log("fees: ", feesType, feesAmount);
      
    } catch (error) {
      console.log("Error adding student", error);
    }
    // print the registration form
    // console.log("form: ", {
    //   name,
    //   session,
    //   course,
    //   level,
    //   time,
    //   feesType,
    //   feesAmount
    // })
    // Force refresh the page
    setName("");
    setSession("");
    setCourse("");
    setLevel("");
    setTime("");
    setFeesType("");
    setFeesAmount(1600);
    // const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
    // wait().then(() => setOpen(true));
    setOpen(true);
    
    // router.push('/registration/print');
  };
  
  return (
    <div className="container mx-auto py-6">
      <ModalSuccess open={open} setOpen={setOpen}/>
      
      {/* <h1  className="font-serif text-center mb-2 text-4xl font-extrabold leading-none tracking-tight text-gray-200 md:text-5xl">VISION CENTER</h1> */}
      {/* <h2  className="font-serif text-gray-200 text-center text-2xl font-extrabold mb-4">REGISTRATION</h2> */}
      <div className="bg bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-10">
      <img
              src="/vision_logo.png"
              alt="vision logo"
              className="mx-auto h-28 w-auto mb-2" />
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 place-items-center">
        <InputField id="name" label="Name" value={name} onChange={setName} required/>
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
          onChange={setFeesAmount}
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
          className="px-1.5"
        />
        <div className="space-x-4 lg:px-12 col-start-3 justify-self-end self-end ">
          <Button
          className="text-sm text-white duration-150 bg-red-600 rounded-lg hover:bg-red-500 active:bg-red-700"
          type="button"
            onClick={() => {
              setName("");
              setSession("");
              setCourse("");
              setLevel("");
              setTime("");
              setFeesType("");
              setFeesAmount(1600);
            }}
          >
            Clear
          </Button>
          <Button
          className="text-sm text-white duration-150 bg-sky-600 rounded-lg hover:bg-sky-500 active:bg-sky-700"
            type="submit"
          >
            Save & Print
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}

// function InputField({ id, label, type, value, defaultValue, onChange }) {
//     return (
//       <div className="mb-4 col-span-1">
//         <label htmlFor={id} className="block font-bold mb-2 text-gray-100">
//           {label}:
//         </label>
//         <input
//           type={type}
//           id={id}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           defaultValue = {defaultValue}
//           className="w-full pl-12 pr-3 py-2 text-black bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
//         />
//       </div>
//     );
//   }
  
  // function SelectField({ id, label, options, onChange }) {
  //   return (
  //     <div className="mb-4 col-span-1">
  //       <label htmlFor={id} className="block font-bold mb-2 text-gray-100">
  //         {label}:
  //       </label>
  //       <select
  //         id={id}
  //         className="w-full pl-12 pr-3 py-2 text-black bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
  //         onChange={(e) => onChange(e.target.value)}
  //       >
  //         {options.map((option, index) => (
  //           <option key={index} value={option}>
  //             {option}
  //           </option>
  //         ))}
  //       </select>
  //     </div>
  //   );
  // }