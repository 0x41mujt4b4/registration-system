"use client";
import React, { useState } from "react";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // print the registration form
    console.log("form: ", {
      name,
      session,
      course,
      level,
      time,
      feesType,
      feesAmount
    })
    // Force refresh the page
    setName("");
    setSession("");
    setCourse("");
    setLevel("");
    setTime("");
    setFeesType("");
    setFeesAmount(1600);
    // router.push('/registration/print');
  };

  return (
    <div className="container mx-auto py-6">
      {/* <h1  class="text-center mb-2 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Vision Center</h1> */}
      <h2  className="text-gray-200 text-center text-4xl font-extrabold mb-4">REGISTRATION</h2>
      <div className="bg bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-8">

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 grid-cols-2 gap-4 place-items-center">
        <InputField id="name" label="Name" value={name} onChange={setName} />
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
        <SelectField
          id="fees-type"
          label="Fees Type"
          options={feesTypeOptions}
          value={feesType}
          onChange={setFeesType}
        />
        <SelectField
          id="course"
          label="Course"
          options={courseOptions}
          value={course}
          onChange={setCourse}
        />
        <InputField
          id="fees-amount"
          label="Fees Amount"
          type="number"
          defaultValue="1600"
          onChange={setFeesAmount}
        />
        <SelectField
          id="session"
          label="Session"
          options={sessionOptions}
          value={session}
          onChange={setSession}
        />
        <div className="space-x-4 col-start-3 justify-self-center self-end ">
          <Button
          className="gap-2 text-sm text-white duration-150 bg-red-600 rounded-lg hover:bg-red-500 active:bg-red-700"
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
          className="gap-2 text-sm text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700"
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